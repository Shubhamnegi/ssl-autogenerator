import { init } from "./init";
init(); // To set all env
import { expect } from 'chai';
import { CertificateService } from "../Services/CertificateService";


describe('Test suite for certificate service', () => {
    it('Should be able to create challenge', async () => {
        const result = await CertificateService.initchallenge(
            {
                brandId: '1946',
                domainName: "cocojaunt.com",
                domainType: "internal",
                issuer: "sslforfree"
            },
            {
                commonName: "cocojaunt.com",
                country: "IN",
                location: "Delhi",
                organization: "cocojaunt",
                organizationalUnit: "food",
                state: "Delhi"
            }
        )
        console.log(result);

        expect(result).to.be.not.null;
    }).timeout(60000)
})