import { AWS_CONSTANTS } from '../Constants/AWS_CONSTANTS';
import { AutomatedCertificateRequest } from '../Declarations/AutomatedCertificateInterface';
import { CsrRequest } from '../Declarations/CsrRequestInterface';
import { challengeFileHelper } from '../Helpers/challengeFileHelper';
import { getLogger } from '../Helpers/logger';
import { messageFormatter } from '../Helpers/util';
import { AutomatedCertificatesRepository } from '../Repository/AutomatedCertificatesRepository';
import { HaProxyGroupsRepository } from '../Repository/HaProxyGroupsRepository';
import { SslForFree } from '../Vendors/SslForFree';
import { AwsService } from './AwsService';

export class CertificateService {
    private static logger = getLogger('CertificateService');
    public static async initChallange(request: AutomatedCertificateRequest, csrRequest: CsrRequest) {
        const domainName = request.domainName;
        const log = this.logger.child({ domainName });

        // create new draft certificate
        const sslForFree = new SslForFree(domainName);
        const certResult = await sslForFree.createCertificate(csrRequest);

        // register new certificate
        await AutomatedCertificatesRepository.registerAutomatedCertificate({
            domainName: request.domainName,
            certificateHash: certResult.data.id,
            csrMeta: JSON.stringify(csrRequest),
            issuer: request.issuer,
            domainType: request.domainType
        })


        const validationLink = certResult.data.validation.other_methods[domainName].file_validation_url_http;
        log.info("Certificate requested for domain" + domainName + "Validation link: " + validationLink);

        // create challange file
        const filePath = challengeFileHelper(validationLink, certResult.data.validation.other_methods[domainName].file_validation_content);
        log.info('challange file local path:' + filePath);

        // upload challange file
        const prefix = `assets/ssl/${domainName}/`
        await AwsService.uploadFile(filePath, prefix);
        const s3Path = AWS_CONSTANTS.s3Domain + "/" + prefix;

        log.info("s3 path:" + s3Path)

        await AutomatedCertificatesRepository.updateChallangeFile(certResult.data.id, s3Path); // Update database with s3 link of challenge file

        // Push challange file to all queue for uploading to ha proxy with group attribute
        const message = messageFormatter('CREATE', { challengeFilePath: s3Path });

        log.debug("challange message" + JSON.stringify(message))

        const groups = await HaProxyGroupsRepository.getListOfIpsForHaProxyGroup(request.domainType);

        for (const group of groups) {
            const queueUrl = await AwsService.getQueueUrlByName(group.challengeQueue);
            await AwsService.pushMessageToQueue(message, queueUrl, 0) // push challange file to all haproxy 
            log.debug("pushed message to " + group.challengeQueue);
        }
        const delayedQueue = await AwsService.getQueueUrlByName(AWS_CONSTANTS.delayedQueue);
        log.debug("pushing message to " + delayedQueue);

        // Push delayed message to queue for valition 
        await AwsService.pushMessageToQueue(messageFormatter(
            'CREATE',
            {
                certificateId: certResult.data.id,
                domainType: request.domainType,
                nextAction: "validate"
            }),
            delayedQueue,
            0);

        log.debug("pushed message to delayed queue");
    }

    public static async triggerValidation(certificateId: string) {
        // On fetching message from queue
        // Request vendor to validate challange
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
        await ssl.downloadCertificate(certificateId);
        // Download certificate
        // Upload certificate to s3
        // Push certificate link to topic with group attribute 
        // Update database
    }

    public static getEligibleDomainsForRenewal() {
        // Query database for domains with current date > expiry - 10 days
        // Push all the messages in queue for renewal with a delay of 10 min
        // use this cron only once in a day to remove conflicts
    }

}