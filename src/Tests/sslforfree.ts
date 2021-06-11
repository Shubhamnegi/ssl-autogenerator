import { init } from "./init";
init(); // To set all env
import { SslForFree } from '../Vendors/SslForFree'
import { expect } from 'chai';

describe("Test suite for ssl for free", () => {
    const domain = "haus.delivery";
    const sslforfree = new SslForFree(domain);
    const certStatus = 'draft'
    let certificateId: string;

    it('Should be able to list domains', async () => {
        const result = await sslforfree.searchCertificate(certStatus);
        // console.log(result);

        expect(result).to.be.not.null;
        expect(result.data).to.haveOwnProperty('results');
        expect(result.data.results.length).to.be.greaterThan(0);
        expect(result.data.results[0].id).to.be.not.null;

        certificateId = result.data.results[0].id;
    });

    it('should be able to get certificate', async () => {
        const result = await sslforfree.getCertificate(certificateId);

        expect(result).to.be.not.null;
        expect(result.data).to.haveOwnProperty('id')
        expect(result.data.id).to.be.eql(certificateId);
        expect(result.data.status).to.be.eql(certStatus);

        console.log(result.data.common_name)
    })
})