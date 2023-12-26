import jwt from "jsonwebtoken"
import { customError } from "../../utils/customError.js"
import { promisify } from "util"
import { publishCustomerEvents } from "../../utils/index.js"
import { authenticateUser } from "../../utils/authenticateUser.js"

export async function protectRoute(req, res, next) {
    let token = req.headers.authorization
    if (!token) {
        next(new customError("Token not provided", 400))
    }

    let decoded = await promisify(jwt.verify)(String(token).startsWith("Bear") ? String(token).split(" ")[1] : String(token), process.env.JWT_SECRET)

    if (!decoded) {
        next(new customError("Unable to decode the user", 400))
    }

    let userPayload = {
        "event": "GET_USER",
        "data": {
            "userId": decoded.id
        }
    }
    // console.log(userPayload, " is the userpayload");

    // let existingUser = await publishCustomerEvents(userPayload)
    // console.log(existingUser, " is the existing User");
    let existingUser = await authenticateUser(userPayload)

    req.user = existingUser
    next()
}