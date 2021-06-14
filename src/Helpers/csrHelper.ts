import { CsrRequest } from "../Declarations/CsrRequest";
import Ajv from 'ajv'
import { schema } from "../Validators/CsrRequestValidator";
import { InvalidCsrRequest } from "../Errors/InvalidCsrRequest";
import { execSync } from 'child_process'
import { readFileSync } from 'fs';

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
    const finalCommand = `openssl req -nodes -newkey rsa:2048 -keyout /tmp/${unique}.key -out /tmp/${unique}.csr -subj "${subject}"`
    execSync(finalCommand);
    const buf = readFileSync(`/tmp/${unique}.csr`);
    
    // use below comment for windows
    // console.log(__dirname + "\\..\\temp\\temp.csr");
    // const buf = readFileSync(__dirname + "\\..\\temp\\temp.csr");
    return buf.toString();
}