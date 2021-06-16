import { CsrRequest } from "../Declarations/CsrRequestInterface";
import Ajv from 'ajv'
import { schema } from "../Validators/CsrRequestValidator";
import { InvalidCsrRequest } from "../Errors/InvalidCsrRequest";
import { execSync } from 'child_process'
import { readFileSync } from 'fs';
import { tempDir } from "../Constants/SSL_FOR_FREE";

/**
 * This will help build a csr request
 * This is required by all the vendors
 * 
 * @param request {CsrRequest}
 */
export const getcsr = (request: CsrRequest) => {
    const unique = new Date().getTime();
    const ajv = new Ajv();
    const validate = ajv.compile(schema)
    const valid = validate(request)
    if (!valid) {
        throw new InvalidCsrRequest(validate.errors)
    }
    let subject = `/C=${request.country}/ST=${request.state}/L=${request.location}/O=${request.organization}/OU=${request.organizationalUnit}/CN=${request.commonName}`
    let openSSlBinary = "openssl";
    if (process.env.OPENSSL_BINARY) {
        openSSlBinary = process.env.OPENSSL_BINARY;
    }
    
    const finalCommand = `${openSSlBinary} req -nodes -newkey rsa:2048 -keyout "${tempDir}\\${unique}.key" -out "${tempDir}\\${unique}.csr" -subj "${subject}"`
    execSync(finalCommand);
    const buf = readFileSync(`${tempDir}/${unique}.csr`);
    
    return buf.toString();
}