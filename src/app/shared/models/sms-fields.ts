export class SmsFields {
    public countryCode: string;
    public phoneNumber: string;
    public message: string

    constructor(countryCode: string, phoneNumber: string, message: string) {
        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.message = message;
    }
}