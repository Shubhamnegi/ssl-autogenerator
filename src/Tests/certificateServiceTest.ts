import { init } from "./init";
init(); // To set all env
import { expect } from 'chai';
import { CertificateService } from "../Services/CertificateService";


describe('Test suite for certificate service', () => {
    it('Should be able to create challenge', async () => {
        const result = await CertificateService.initchallenge(
            {
                brandId: '3065',
                domainName: "lechef.co.in",
                domainType: "internal",
                issuer: "sslforfree"
            },
            {
                commonName: "lechef.co.in",
                country: "IN",
                location: "Delhi",
                organization: "lechef.co.in",
                organizationalUnit: "food",
                state: "Delhi"
            }
        )
        console.log(result);

        expect(result).to.be.not.null;
    }).timeout(60000)
})