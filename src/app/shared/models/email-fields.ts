export class EmailFields {
    public to: string;
    public subject: string;
    public message: string

    constructor(to: string, subject: string, message: string) {
        this.to = to;
        this.subject = subject;
        this.message = message;
    }
}