import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { CsrRequest } from "../Declarations/CsrRequestInterface";
import { getcsr } from "../Helpers/csrHelper";

describe("Csr test suite ", () => {
    it('should be able to create csr', () => {
        const request: CsrRequest = {
            country: "IN",
            commonName: "shubham.negi",
            location: "gurgaon",
            organization: "limetray",
            organizationalUnit: "tech",
            state: "haryana"
        }
        const result = getcsr(request);
        
        // console.log(result);

        expect(result).to.be.not.null;
        expect(typeof result).to.be.eql('string')
        
    })

})
