import { createClient } from "redis";
import { getParameterValue } from "../../src/utils/get_ssm_params.js";

// const client = createClient({
//   password: "MrfKfwJi38Inw1l2kBwoEs7RyHQo2tVf",
//   socket: {
//     host: "redis-17465.c325.us-east-1-4.ec2.cloud.redislabs.com",
//     port: 17465,
//   },
// });

// client.on("error", (err) => console.log("Redis Client Error", err));

// await client.connect();

// await client.set("key", "test-redis-key");
// const value = await client.get("key");

// console.log(value, " is the retrieved value");

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

export async function disconnectFromRedis(redisClient) {
  try {
    if (redisClient) {
      // Wait for any pending commands to be processed before disconnecting
      await new Promise((resolve) => {
        redisClient.quit(() => {
          resolve();
        });
      });
    } else {
      console.log("Not connected to Redis");
    }
  } catch (error) {
    console.error(`Error disconnecting from Redis: ${error}`);
    throw error; // Re-throw the error to indicate disconnection failure
  }
}
