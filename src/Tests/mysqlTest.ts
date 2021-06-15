import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { Mysql } from "../Connections/mysql";
import { AutomatedCertificatesRepository } from "../Repository/AutomatedCertificatesRepository";
import { CertificateNotFound } from "../Errors/CertificateNotFound";
import { HaProxyGroupsRepository } from "../Repository/HaProxyGroupsRepository";

describe('Test suite for mysql', () => {
    it('should be create and check connection', async () => {
        Mysql.connect();
        await Mysql.healthCheck();
    }).timeout(10000);

    it('should be able to get ha proxy group for internal', async () => {
        const result = await HaProxyGroupsRepository.getListOfIpsForHaProxyGroup('ha_internal_1');
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

    after(() => {
        Mysql.closeConnection();
    })
})