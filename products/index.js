import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createChannel } from "./src/utils/index.js";
import { expressApp } from "./express-app.js";
import { handleErrors } from "./src/utils/handleErrors.js";
import rabbitMQClient from "./src/rpc/client.js";
import { ProductService } from "./src/service/productService.js";
import { createClient } from "redis";

import { getParameterValue } from "./src/utils/get_ssm_params.js";
import swaggerSpecs from "./swagger.js";
import swaggerUi from "swagger-ui-express";
//load config
dotenv.config();

async function createConnection() {
  let connString = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/products/mongo_uri"
  );
  console.log(connString);

  await mongoose
    .connect(connString)
    .then((data) => {
      console.log("Connected to mongo");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function connectToRedis() {
  let redisHost = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/REDIS_HOST"
  );
  let redisPort = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/REDIS_PORT"
  );
  let redisPass = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/REDIS_PASS"
  );

  const client = createClient({
    password: redisPass,
    socket: {
      host: redisHost,
      port: redisPort,
    },
  });

  await client.connect();
  console.log("Connected to Redis");
  return client;
}

async function startApp() {
  // let connString = process.env.MONGO_CONNECTION_STRING
  //     .replace("username", process.env.MONGO_USER)
  //     .replace("password", process.env.MONGO_PASS)
  //     .replace("db_name", process.env.MONGO_DB_NAME)

  // let connString = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`

  // declare express app
  const app = express();

  //declare the service
  const service = new ProductService();

  // create a channel
  //swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  //connect to db
  await createConnection();

  //redis client
  const redis = await connectToRedis();

  // attach middleware
  await expressApp(app, redis);

  //connect to rpc
  await rabbitMQClient.initialize(service);

  //listen to port
  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(
      `Products Service listening to port ${process.env.EXPRESS_PORT}`
    );
  });

  handleErrors(app);
}

startApp();
