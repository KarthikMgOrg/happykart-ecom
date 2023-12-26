import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { appRouter } from "./src/api/shopping.js";
import helmet from "helmet";

export async function expressApp(app, channel, redis) {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: true }));
  await appRouter(app, channel, redis);
}
