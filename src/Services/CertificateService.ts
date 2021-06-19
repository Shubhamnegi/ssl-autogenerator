import { AWS_CONSTANTS } from '../Constants/AWS_CONSTANTS';
import { NextActionEnum } from '../Constants/NextActionEnum';
import { AutomatedCertificateRequest } from '../Declarations/AutomatedCertificateInterface';
import { CsrRequest } from '../Declarations/CsrRequestInterface';
import { CertificateNotFound } from '../Errors/CertificateNotFound';
import { challengeFileHelper, createBufferFromArray } from '../Helpers/challengeFileHelper';
import { getLogger } from '../Helpers/logger';
import { messageFormatter } from '../Helpers/util';
import { AutomatedCertificatesRepository } from '../Repository/AutomatedCertificatesRepository';
import { HaProxyGroupsRepository } from '../Repository/HaProxyGroupsRepository';
import { SslForFree } from '../Vendors/SslForFree';
import { AwsService } from './AwsService';
import { delayedQueueFormatter } from '../Helpers/formatters';
import { unzipHelper } from '../Helpers/unzipHelper';
import { tempDir } from '../Constants/SSL_FOR_FREE';
import path from 'path';
import { readFileSync } from 'fs'


export class CertificateService {
    private static logger = getLogger('CertificateService');
    public static async initchallenge(request: AutomatedCertificateRequest, csrRequest: CsrRequest) {
        const domainName = request.domainName;
        const log = this.logger.child({ domainName });

        try {
            await AutomatedCertificatesRepository.getCertificateByDomainName(domainName);
            throw new Error("Domain name alerady registerd");
        } catch (error) {
            if (error instanceof CertificateNotFound) {
                log.info("domain not registred lets continue")
            }
        }

        // create new draft certificate
        const sslForFree = new SslForFree(domainName);
        const uniqeCertName = new Date().getTime().toString();
        const certResult = await sslForFree.createCertificate(csrRequest, uniqeCertName);

        log.debug(certResult.data);

        // register new certificate
        await AutomatedCertificatesRepository.registerAutomatedCertificate({
            brandId: request.brandId,
            domainName: request.domainName,
            certificateHash: certResult.data.id,
            csrMeta: JSON.stringify(csrRequest),
            issuer: request.issuer,
            domainType: request.domainType
        })


        const validationLink = certResult.data.validation.other_methods[domainName].file_validation_url_http;
        log.info("Certificate requested for domain" + domainName + "Validation link: " + validationLink);

        // create challenge file
        const fileBuffer = createBufferFromArray(certResult.data.validation.other_methods[domainName].file_validation_content);

        // upload challenge file        
        const prefix = `assets/ssl/${request.brandId}/`
        const fileName = (validationLink.slice(validationLink.lastIndexOf('/') + 1));

        const csrS3Path = AWS_CONSTANTS.s3Domain + "/" + prefix;
        const csrS3Fullpath = csrS3Path + fileName;

        log.info("s3 path:" + csrS3Fullpath)

        await AwsService.uploadFileBuffer(fileBuffer, prefix + fileName);

        const privateKeyName = request.domainName.replace(/\./ig, "_") + "_private.key_" + request.brandId
        const privateS3Path = AWS_CONSTANTS.s3Domain + "/" + prefix;
        const privateS3FullPath = privateS3Path + privateKeyName;

        const privateKeyBuffer = readFileSync(path.join(tempDir, uniqeCertName + ".key"))
        await AwsService.uploadFileBuffer(privateKeyBuffer, prefix + privateKeyName);

        log.info("s3 path:" + privateS3FullPath)

        await AutomatedCertificatesRepository.updateChallengeAndKey(
            certResult.data.id,
            csrS3Fullpath,
            privateS3FullPath
        ); // Update database with s3 link of challenge file and key

        // Push challenge file to all queue for uploading to ha proxy with group attribute

        const message = messageFormatter('CREATE', {
            challengeFilePath: csrS3Fullpath,
            brandId: request.brandId
        });

        log.debug("challenge message" + JSON.stringify(message))

        const groups = await HaProxyGroupsRepository.getListOfIpsForHaProxyGroup(request.domainType);

        for (const group of groups) {
            const queueUrl = await AwsService.getQueueUrlByName(group.challengeQueue);
            await AwsService.pushMessageToQueue(message, queueUrl, 0) // push challenge file to all haproxy 
            log.debug("pushed message to " + group.challengeQueue);
        }
        const delayedQueue = await AwsService.getQueueUrlByName(AWS_CONSTANTS.delayedQueue);
        log.debug("pushing message to " + delayedQueue);

        // Push delayed message to queue for valition 
        const delayedMessage = delayedQueueFormatter(certResult.data.id, NextActionEnum.VALIDATE)
        const delayedMessageFormatted = messageFormatter('CREATE', delayedMessage)

        await AwsService.pushMessageToQueue(
            delayedMessageFormatted,
            delayedQueue,
            60
        );

        log.debug("pushed message to delayed queue " + delayedMessageFormatted);
        return csrS3Path;
    }

    public static async triggerValidation(certificateId: string) {
        // On fetching message from queue
        // Request vendor to validate challenge
        const result = await AutomatedCertificatesRepository.getCertificateByHash(certificateId);
        const domainName = result.domainName;
        const log = this.logger.child({ domainName });
        log.info("requesting validation");

        const ssl = new SslForFree(domainName);
        const validationResult = await ssl.validateCertificate(certificateId);
        if (validationResult.data.error) {
            // Error occured;
            log.error(validationResult.data.error);
            throw new Error("Error validating certificate");
        }
        // On successfull validation 

    }

    public static async getValidationStatus(certificateId: string) {
        // get certificate details by id
        const result = await AutomatedCertificatesRepository.getCertificateByHash(certificateId);
        const domainName = result.domainName;
        const log = this.logger.child({ domainName });
        log.info("requesting validation status");
        // check validation status
        // if validation is 1 then download certificate

        const ssl = new SslForFree(domainName);
        const validationResult = await ssl.getValidationStatus(certificateId);

        if (validationResult.data.validation_completed === 0) {
            throw new Error("Validation failed")
        }
        // Download certificate
        await ssl.downloadCertificate(certificateId);

        // Unzip         
        unzipHelper(
            path.join(tempDir, certificateId + '.zip'),
            path.join(tempDir, certificateId)
        )

        // Append doain name  and brand id
        // Upload certificate to s3

        const brandId = result.brandId
        const prefix = `assets/ssl/${brandId}/`

        const caBundleS3Path = AWS_CONSTANTS.s3Domain + "/" + prefix;
        const caBundleFileName = 'ca_bundle.crt_' + brandId
        const caBundleS3Fullpath = caBundleS3Path + caBundleFileName;

        log.info('s3 path', caBundleS3Fullpath)

        const caBundleBuffer = readFileSync(path.join(tempDir, certificateId, "ca_bundle.crt"))
        await AwsService.uploadFileBuffer(caBundleBuffer, prefix + caBundleFileName);

        const certificateS3Path = AWS_CONSTANTS.s3Domain + "/" + prefix;
        const certificateFileName = 'ca_bundle.crt_' + brandId
        const certificateS3Fullpath = certificateS3Path + certificateFileName;

        log.info('s3 path', certificateS3Fullpath)

        const certificateBuffer = readFileSync(path.join(tempDir, certificateId, "certificate.crt"))
        await AwsService.uploadFileBuffer(certificateBuffer, prefix + certificateFileName);

        await AutomatedCertificatesRepository.updateCertificates(certificateId, caBundleS3Fullpath, certificateS3Fullpath)

        


        // Push certificate link to topic with group attribute 
        // Update database
        // const groups = await HaProxyGroupsRepository.getListOfIpsForHaProxyGroup(result.domainType);
        // for (const g of groups) {
        //     log.debug('push to ' + g.certificateQueue)
        // }
        // rename certificate and upload to the queue
        // push next stats as 
    }

    public static getEligibleDomainsForRenewal() {
        // Query database for domains with current date > expiry - 10 days
        // Push all the messages in queue for renewal with a delay of 10 min
        // use this cron only once in a day to remove conflicts
    }

}