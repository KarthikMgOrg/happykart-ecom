import express from "express";
import { expressApp } from "./express-app.js";
import mongoose from "mongoose";
import { handleErrors } from "./src/utils/handleErrors.js";
import { createChannel } from "./src/utils/index.js";
import dotenv from "dotenv";
import rabbitMQClient from "./src/rpc/client.js";
import { customerService } from "./src/services/customerService.js";
import { getParameterValue } from "./src/utils/get_ssm_params.js";
import swaggerSpecs from "./swagger.js";
import swaggerUi from "swagger-ui-express";
import { createClient } from "redis";
import {
  connectToRedis,
  disconnectFromRedis,
} from "./src/redis/connectToRedis.js";

//load dotenv
dotenv.config();

// export async function connectToRedis() {
//   let redisHost = await getParameterValue("/javascript/mini_projects/11_moving_to_microservice_with_message_broker/REDIS_HOST");
//   let redisPort = await getParameterValue("/javascript/mini_projects/11_moving_to_microservice_with_message_broker/REDIS_PORT");
//   let redisPass = await getParameterValue("/javascript/mini_projects/11_moving_to_microservice_with_message_broker/REDIS_PASS");

//   const client = createClient({
//     password: redisPass,
//     socket: {
//       host: redisHost,
//       port: redisPort,
//     },
//   });

//   await client.connect();
//   console.log("Connected to Redis");
//   return client;
// }

// export async function disconnectFromRedis(redisClient) {
//   try {
//     if (redisClient) {
//       // Wait for any pending commands to be processed before disconnecting
//       await new Promise((resolve) => {
//         redisClient.quit(() => {
//           resolve();
//         });
//       });

//       console.log("Disconnected from Redis");
//     } else {
//       console.log("Not connected to Redis");
//     }
//   } catch (error) {
//     console.error(`Error disconnecting from Redis: ${error}`);
//     throw error; // Re-throw the error to indicate disconnection failure
//   }
// }

async function createConnection() {
  let connString = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/customer/mongo_uri"
  );

  await mongoose
    .connect(connString)
    .then((data) => {
      console.log("Connected to mongo");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function startApp() {
  //make an express app
  const app = express();

  //instantiate customer service
  const service = new customerService();

  // create a channel
  const channel = await createChannel();

  //swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  //create mongo connection
  // let connString = process.env.MONGO_CONNECTION_STRING
  //     .replace("username", process.env.MONGO_USER)
  //     .replace("password", process.env.MONGO_PASS)
  //     .replace("db_name", process.env.MONGO_DB_NAME)

  // let connString = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`

  //create db connection
  // await createConnection(`mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`)
  await createConnection();

  //redis client
  const redis = await connectToRedis();

  //connect to expressApp
  await expressApp(app, channel, redis);

  //connect to rpc
  await rabbitMQClient.initialize(service);

  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(
      `Customer service listening at port ${process.env.EXPRESS_PORT}`
    );
  });

  //error handler
  handleErrors(app);
}

startApp();
