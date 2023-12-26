import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createChannel } from "./src/utils/index.js";
import { expressApp } from "./express-app.js";
import rabbitMQClient from "./src/rpc/client.js";
import { getParameterValue } from "./src/utils/get_ssm_params.js";
import { createClient } from "redis";
import swaggerSpecs from "./swagger.js";
import swaggerUi from "swagger-ui-express";

//load config
dotenv.config();

async function createConnection() {
  let connString = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/shopping/mongo_uri"
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

export async function connectToRedis() {
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

  // console.log(connString);
  // declare express app
  const app = express();

  // create a channel
  const channel = await createChannel();

  //connect to db
  await createConnection();

  //redis client
  const redis = await connectToRedis();

  //swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  // attach middleware
  await expressApp(app, channel, redis);

  //connect to rpc
  await rabbitMQClient.initialize();

  //listen to port
  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(
      `Shopping Service listening to port ${process.env.EXPRESS_PORT}`
    );
  });
}

startApp();
