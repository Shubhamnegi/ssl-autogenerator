import { init } from "./init";
init(); // To set all env

import { expect } from 'chai';
import { challengeFileHelper } from '../Helpers/challengeFileHelper';

describe("Challange file test suite", () => {
    const link = "http://shakkr.in/.well-known/pki-validation/1B0FFD0EBD303CD85643A543010F737D.txt";
    const contents = [
        '05B0D3AA232F1C5A304BBCCB8FEE9466BE1EEEA946C57914769EA8E48E499104',
        'comodoca.com',
        '5e3cf8d52ef51c3'
    ];


    it("Should be able to create a file", () => {
        const rs = challengeFileHelper(link, contents);
        console.log(rs);
    })
})