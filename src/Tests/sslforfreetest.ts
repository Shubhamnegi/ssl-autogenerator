import { init } from "./init";
init(); // To set all env
import { SslForFree } from '../Vendors/SslForFree'
import { expect } from 'chai';
import { CsrRequest } from "../Declarations/CsrRequestInterface";
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
    //     const domain = "lechef.co.in";
    //     const hash = "9ea86bad8e688736822266ec36420063";
    //     const sslforfree = new SslForFree(domain)
    //     const result = await sslforfree.validateCertificate(hash);

    //     console.log(JSON.stringify(result.data));

    //     expect(result.data).to.haveOwnProperty("success");
    //     expect(result.data).to.haveOwnProperty("error");
    // }).timeout(60000);

    // it('should be able to download certificate', async () => {
    //     const domain = "lechef.co.in";
    //     const hash = "d5a7686ad42e8d5a36dc07fb56a34346";
    //     const sslforfree = new SslForFree(domain)
    //     await sslforfree.downloadCertificate(hash);

    //     const filepath = path.join(tempDir + "//" + hash + ".zip");
    //     console.log(filepath)
    //     expect(existsSync(filepath)).to.be.eql(true);

    // }).timeout(60000);

    it('should be able to get validation status', async () => {
        const hash = "9ea86bad8e688736822266ec36420063";
        const result = await sslforfree.getValidationStatus(hash);

        console.log(result.data)
        expect(result).to.be.not.null;
        expect(result.data).to.be.not.null;
        expect(result.data).to.haveOwnProperty('validation_completed');
        // expect(result.data).to.haveOwnProperty('details');
    });

})