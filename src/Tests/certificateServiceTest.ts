import { init } from "./init";
init(); // To set all env
import { expect } from 'chai';
import { CertificateService } from "../Services/CertificateService";


describe('Test suite for certificate service', () => {
    it('Should be able to create challenge', async () => {
        const result = await CertificateService.initchallenge(
            {
                brandId: '4697',
                domainName: "wataburger.in",
                domainType: "internal",
                issuer: "sslforfree"
            },
            {
                commonName: "wataburger.in",
                country: "IN",
                location: "Delhi",
                organization: "wataburger.in",
                organizationalUnit: "food",
                state: "Delhi"
            }
        )
        console.log(result);

        expect(result).to.be.not.null;
    }).timeout(60000)

    // it('should be able to validate and download certificate', async () => {
    //     const result = await CertificateService.getValidationStatus('cb622e5362de0928c2c4676581c9f915')
    // }).timeout(60000)
})