import { promisify } from "util"
import jwt from "jsonwebtoken"
import { customerModel } from "../database/model/customer.js"
import { customError } from "./customError.js"

export async function protectRoute(req, res, next) {

    //get token from request
    let { token } = req.headers.authorization
    if (!token) {
        next(new customError("Token not provided", 400))
    }

    //extract user from token
    let decoded = await promisify(jwt.verify)(String(token).split(" ")[1] ? String(token).startsWith("Bear") : String(token))
    if (!decoded.id) {
        next(new customError("Unable to find the provided user", 404))
    }

    //if decoded.id then we fetch the user
    let existingUser = await customerModel.findById(decoded.id)
    if (!existingUser) {
        next(new customError("User not found for the passed in ID", 400))
    }
    req.user = existingUser
    next()

}