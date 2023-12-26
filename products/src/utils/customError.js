export class customError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}