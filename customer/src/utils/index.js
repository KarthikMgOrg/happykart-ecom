import axios from "axios";
import amqplib from "amqplib";
import { getParameterValue } from "./get_ssm_params.js";

export async function publishProductsEvent(payload, headers) {
  try {
    const res = await axios.post(
      "http://localhost:3001/api/products/app-events",
      payload,
      {
        headers: headers,
      }
    );
    if (!res.status === 200) {
      console.log("Axios Error");
    }
    let data = await res.data;
    return data;
  } catch (error) {
    console.log("Some Error in making the request");
    console.log(error);
  }
}

// ***************************** MESSAGE BROKER *****************************

// create a channel
export async function createChannel() {
  try {
    let exchangeName = await getParameterValue(
      "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/rabbitmq_uri"
    );
    const connection = await amqplib.connect(exchangeName);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", {
      durable: false,
      expires: 60000,
      autoDelete: true,
    });
    return channel;
  } catch (error) {
    throw error;
  }
}

//publish messages
export async function publishMessage(channel, binding_key, message) {
  try {
    let exchangeName = await getParameterValue(
      process.env.EXCHANGE_NAME_SSM_KEY
    );
    await channel.publish(exchangeName, binding_key, Buffer.from(message));
  } catch (error) {
    throw error;
  }
}

//subscribe to messages
export async function subscribeMessage(channel, service) {
  let exchangeName = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/jwt_secret"
  );
  await channel.assertExchange(exchangeName, "direct", { durable: true });
  const q = await channel.assertQueue("", {
    durable: false,
    expires: 60000,
    autoDelete: true,
  });
  channel.bindQueue(q.queue, exchangeName, process.env.CUSTOMER_BINDING_KEY);
  channel.consume(q.queue, (data) => {
    // console.log(data.content.toString());
    channel.ack(data);
    service.subscribeToEvents(JSON.parse(data.content));
  });
}
