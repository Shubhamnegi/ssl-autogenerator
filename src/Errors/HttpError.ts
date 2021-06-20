export class HttpError {
    public status: number;
    public message: string;
    public error: Error

    constructor(error: Error, status = 500, message = "") {
        this.error = error;
        this.status = status;
        this.message = message
        if (this.message === "" && this.status === 500) {
            this.message = "Internal Server Error"
        }
    }
}