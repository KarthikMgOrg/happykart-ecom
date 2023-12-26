import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { appRouter } from "./src/api/products.js";
import { createChannel } from "./src/utils/index.js";
import helmet from "helmet";

export async function expressApp(app, redis) {
  app.use(express.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());
  const channel = await createChannel();
  await appRouter(app, channel, redis);
}
