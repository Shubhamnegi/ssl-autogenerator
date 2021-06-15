export class CertificateNotFound extends Error {
    constructor(request: any) {
        super("Not Certificate found with reqeust : " + JSON.stringify(request));
        this.name = "CertificateNotFound"
        Object.setPrototypeOf(this, CertificateNotFound.prototype);
    }
}