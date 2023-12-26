import axios from "axios";
import amqplib from "amqplib";
import { getParameterValue } from "./get_ssm_params.js";

export async function publishCustomerEvents(payload) {
  let headers = {
    "Content-Type": "application/json",
  };
  try {
    let res = await axios.post(
      "http://customer:3000/api/customers/app-events",
      payload,
      {
        headers: headers,
      }
    );
    if (!res.status === 200) {
      console.log("Axios Error");
    }
    let data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

// ***************************** MESSAGE BROKER *****************************

// create a channel
export async function createChannel() {
  try {
    let rabbitmquri = await getParameterValue(
      "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/rabbitmq_uri"
    );
    const connection = await amqplib.connect(rabbitmquri);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", {
      durable: true,
    });
    return channel;
  } catch (error) {
    throw error;
  }
}

//publish messages
export async function publishMessage(channel, binding_key, message) {
  let exchangeName = await getParameterValue(
    "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/jwt_secret"
  );
  try {
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
  channel.bindQueue(q.queue, exchangeName, process.env.SHOPPING_SERVICE);
  channel.consume(q.queue, (data) => {
    console.log("recieved data");
    console.log(data.content.toString());
    channel.ack(data);
  });
}
