// Class to generalize errors of the application. So we don't need to use native Error from Javascript
export class AppError {

    // there is two public readonly information, to register the error message and http status code, which by default is 400 (bad request)
    public readonly message: string

    public readonly statusCode: number

    constructor(message: string, statusCode: number = 400) {
        this.message = message
        this.statusCode = statusCode
    }
}