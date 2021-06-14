export class InvalidCsrRequest extends Error {
    constructor(request: any) {
        super("Invalid csr request, error: " + JSON.stringify(request));
        this.name = "InvalidCsrRequest"
        Object.setPrototypeOf(this, InvalidCsrRequest.prototype);
    }
}