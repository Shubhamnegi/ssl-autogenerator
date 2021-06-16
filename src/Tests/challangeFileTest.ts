import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { existsSync, statSync } from 'fs'
import { challengeFileHelper, createBufferFromArray } from '../Helpers/challengeFileHelper';

describe("challenge file test suite", () => {
    const link = "http://shakkr.in/.well-known/pki-validation/1B0FFD0EBD303CD85643A543010F737D.txt";
    const contents = [
        '05B0D3AA232F1C5A304BBCCB8FEE9466BE1EEEA946C57914769EA8E48E499104',
        'comodoca.com',
        '5e3cf8d52ef51c3'
    ];


    // it("Should be able to create a file", () => {
    //     const rs = challengeFileHelper(link, contents);
    //     const stats = statSync(rs).size;

    //     expect(existsSync(rs)).to.be.eql(true);
    //     expect(stats).to.be.greaterThan(0);
    // });


    it('should be able to create buffer', () => {
        const rs = createBufferFromArray(contents);
        console.log(rs);
        console.log(rs.toString())
        expect(rs).instanceOf(Buffer)
    })
})