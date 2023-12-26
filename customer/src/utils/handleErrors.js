import { customError } from "./customError.js"


export function handleErrors(app) {
    console.log("Handling Errors");
    app.all("*", (req, res, next) => {
        let err = new customError(`Cant find the requested page ${req.originalUrl}`)
        next(err)
    })

    app.use((err, req, res, next) => {
        console.log(err, " is the error")
        const response = {
            status: 'Failure',
            error: {
              message: err.message,
              data:err,
              stack: err.stack, // Include the stack trace if needed
            },
          };
        res.status(400).json(response)
    })
}