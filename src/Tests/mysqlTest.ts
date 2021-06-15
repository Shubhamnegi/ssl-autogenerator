import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { Mysql } from "../Connections/mysql";
import { AutomatedCertificatesRepository } from "../Repository/AutomatedCertificatesRepository";
import { CertificateNotFound } from "../Errors/CertificateNotFound";

describe('Test suite for mysql', () => {
    it('should be create and check connection', async () => {
        Mysql.connect();
        await Mysql.healthCheck();
    }).timeout(10000);

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