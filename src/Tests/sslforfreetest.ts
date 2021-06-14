import { init } from "./init";
init(); // To set all env
import { SslForFree } from '../Vendors/SslForFree'
import { expect } from 'chai';
import { CsrRequest } from "../Declarations/CsrRequest";
import { existsSync, statSync } from 'fs';
import path from 'path';
import { tempDir } from "../Constants/SSL_FOR_FREE";


describe("Test suite for ssl for free", () => {
    const domain = "haus.delivery";
    const sslforfree = new SslForFree(domain);
    const certStatus = 'draft'
    let certificateId: string;

    // it('Should be able to list domains', async () => {

    //     const result = await sslforfree.searchCertificate(certStatus);
    //     // console.log(result);

    //     expect(result).to.be.not.null;
    //     expect(result.data).to.haveOwnProperty('results');
    //     expect(result.data.results.length).to.be.greaterThan(0);
    //     expect(result.data.results[0].id).to.be.not.null;

    //     certificateId = result.data.results[0].id;
    // });

    // it('should be able to get certificate', async () => {
    //     const result = await sslforfree.getCertificate(certificateId);

    //     expect(result).to.be.not.null;
    //     expect(result.data).to.haveOwnProperty('id')
    //     expect(result.data.id).to.be.eql(certificateId);
    //     expect(result.data.status).to.be.eql(certStatus);

    //     console.log(result.data.common_name)
    // })

    // it('should be able to create certificate', async () => {
    //     const request: CsrRequest = {
    //         country: "In",
    //         commonName: "shakkr.in",
    //         location: "delhi",
    //         organization: "shakkr.in",
    //         organizationalUnit: "food",
    //         state: "delhi"
    //     }
    //     const domain = "shakkr.in";
    //     const sslforfree = new SslForFree(domain);
    //     const result = await sslforfree.createCertificate(request);
    //     console.log(result.data);

    //     expect(result).to.be.not.null;
    //     expect(result.data).to.haveOwnProperty('id')        
    //     console.log(result.data.validation.other_methods['shakkr.in'].file_validation_url_http);
    //     console.log(result.data.validation.other_methods['shakkr.in'].file_validation_content);

    // }).timeout(60000);

    // it('should be able to validate certificate', async () => {
    //     const domain = "trezeokitchens.in";
    //     const hash = "b9e6cf88fedd95e2915fd4cfaabb9c52";
    //     const sslforfree = new SslForFree(domain)
    //     const result = await sslforfree.validateCertificate(hash);

    //     console.log(JSON.stringify(result.data));

    //     expect(result.data).to.haveOwnProperty("success");
    //     expect(result.data).to.haveOwnProperty("error");
    // }).timeout(60000);

    it('should be able to download certificate', async () => {
        const domain = "memsaabfood.com";
        const hash = "872acd21568e90a89b59ca1a3aec94a7";
        const sslforfree = new SslForFree(domain)
        await sslforfree.downloadCertificate(hash);

        const filepath = path.join(tempDir + "\\" + hash + ".zip");
    
        expect(existsSync(filepath)).to.be.eql(true);

    }).timeout(60000);

})