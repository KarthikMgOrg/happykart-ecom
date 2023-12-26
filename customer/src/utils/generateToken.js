import jwt from "jsonwebtoken";
import { getParameterValue } from "./get_ssm_params.js";
import dotenv from "dotenv";

//load config
dotenv.config();

export async function generateToken(newUser) {
  console.log(newUser, " is the created user");
  const jwt_secret = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/jwt_secret"
  );
  let token = jwt.sign({ id: newUser._id }, jwt_secret, {
    expiresIn: "3d",
  });
  return token;
}
