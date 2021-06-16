import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { Mysql } from "../Connections/mysql";
import { AutomatedCertificatesRepository } from "../Repository/AutomatedCertificatesRepository";
import { CertificateNotFound } from "../Errors/CertificateNotFound";
import { HaProxyGroupsRepository } from "../Repository/HaProxyGroupsRepository";
import { iRegexp } from "sequelize/types/lib/operators";
import { AutomatedCertificate } from "../Declarations/AutomatedCertificateInterface";

describe('Test suite for mysql', () => {
    it('should be create and check connection', async () => {
        Mysql.connect();
        await Mysql.healthCheck();
    }).timeout(10000);

    it('should be able to get ha proxy group for internal', async () => {
        const result = await HaProxyGroupsRepository.getListOfIpsForHaProxyGroup('internal');
        expect(result.length).to.be.greaterThan(0);
        for (const item of result) {
            expect(item.groupType).to.be.eql('internal');
        }
    })

    it('should fail on invalid certificate', async () => {
        try {
            await AutomatedCertificatesRepository.getCertificateByHash("Dummy");
            throw new Error("Invalid")
        } catch (error) {
            expect(error).instanceOf(CertificateNotFound);
        }
    })

    it('should be able to insert new certificate', async () => {
        const cert: AutomatedCertificate = {
            domainName: "test_domain_name",
            certificateHash: "123",
            csrMeta: '{"asdasd":"asdasdasd","asdas":"asdasd","asdas1":"asdasd","asdas2":"asdasd"}',
            issuer: "sslforfree",
            domainType: "internal"
        };

        const result = await AutomatedCertificatesRepository.registerAutomatedCertificate(cert);
        expect(result).to.be.not.null;
        expect(result.id).to.be.not.null
        expect(result.domainName).to.be.eql(cert.domainName);
    })

    it('should be able to update challange file', async () => {
        const result = await AutomatedCertificatesRepository.updateChallangeFile("123", "https://updaeted.challange.file");

        expect(result).to.be.not.null;
        expect(result.challangeFilePath).to.be.eql("https://updaeted.challange.file");
    })


    it('should be able to update challange file', async () => {
        const result = await AutomatedCertificatesRepository.updateCertificatePath(
            "123",
            {
                certificateKeyPath: "keyPath",
                certificateCrtPat: "crtPath",
                certificateCaBundlePath: "caBundle"
            }
        );

        expect(result).to.be.not.null;
        expect(result.certificateKeyPath).to.be.eql("keyPath");
        expect(result.certificateCrtPath).to.be.eql("crtPath");
        expect(result.certificateCaBundlePath).to.be.eql("caBundle");
    });

    it('should be able to update renew data', async () => {
        const result = await AutomatedCertificatesRepository.updateAutoRenewDate(
            "123"
        );

        expect(result).to.be.not.null;
        expect(result.autoRenewedOn).to.be.not.null;
    })

    after(() => {
        Mysql.closeConnection();
    })
})