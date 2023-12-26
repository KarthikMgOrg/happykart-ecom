import jwt from "jsonwebtoken";
import { customError } from "../../utils/customError.js";
import { promisify } from "util";
import { publishCustomerEvents } from "../../utils/index.js";
import { authenticateUser } from "../../utils/authenticateUser.js";

export async function protectRoute(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return next(new customError("Token not provided", 400));
  }

  let decoded = await promisify(jwt.verify)(
    String(token).startsWith("Bear")
      ? String(token).split(" ")[1]
      : String(token),
    process.env.JWT_SECRET
  );

  if (!decoded) {
    return next(new customError("Unable to decode the user", 400));
  }

  let userPayload = {
    event: "GET_USER",
    data: {
      userId: decoded.id,
    },
  };
  let existingUser = await authenticateUser(userPayload);
  if (!existingUser) {
    return next(new customError("user does not exist", 400));
  }
  req.user = existingUser;
  next();
}
