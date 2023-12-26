import { customError } from "./customError.js";

export function handleErrors(app) {
    console.log("Handling Errors");
    app.all("*", (req, res, next) => {
        let err = new customError(`Cant find the requested page ${req.originalUrl}`)
        next(err)
    })

    app.use((err, req, res, next) => {
        console.log(err, " is the error")
        res.status(400).json({
            status: "Failure",
            data: err.message,
            message: err
        })
    })
}