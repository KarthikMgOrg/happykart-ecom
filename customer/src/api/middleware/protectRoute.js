import { promisify } from "util";
import jwt from "jsonwebtoken";
import { customerModel } from "../../database/model/customer.js";
import { customError } from "../../utils/customError.js";

export async function protectRoute(req, res, next) {
  //get token from request
  let decoded;
  let token = req.headers.authorization;
  if (!token) {
    return next(new customError("Token not provided", 400));
  }

  //extract user from token
  try {
    decoded = await promisify(jwt.verify)(
      String(token).startsWith("Bear") ? token.split(" ")[1] : token,
      process.env.JWT_SECRET
    );
  } catch (error) {
    return next(new customError(error.message, 400));
  }

  if (!decoded.id) {
    return next(new customError("Unable to find the provided user", 404));
  }

  //if decoded.id then we fetch the user
  let existingUser = await customerModel.findById(decoded.id);
  if (!existingUser) {
    return next(new customError("User not found for the passed in ID", 400));
  }
  req.user = existingUser;
  next();
}
