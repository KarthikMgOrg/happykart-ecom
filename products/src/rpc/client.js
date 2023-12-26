import amqplib from "amqplib";
import { rabbitmq } from "./config.js";
import { producer } from "./producer.js";
import { consumer } from "./consumer.js";
import { EventEmitter } from "events";

class rabbitMQClient {
  connection;
  producer;
  consumer;
  producerChannel;
  consumerChannel;
  eventEmitter;
  static instance;

  async initialize(service) {
    try {
      this.connection = await amqplib.connect(rabbitmq.url);
      console.log("Connected to RPC");

      // producer
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: ReplyQueue } = await this.consumerChannel.assertQueue("", {
        durable: false,
        expires: 60000,
        autoDelete: true,
      });
      this.EventEmitter = new EventEmitter();

      this.producer = new producer(
        this.producerChannel,
        ReplyQueue,
        this.EventEmitter
      );
      this.consumer = new consumer(
        this.consumerChannel,
        ReplyQueue,
        this.EventEmitter
      );

      //consume messages
      this.consumer.consume();

      //consume from products
      const { queue: productSendQueue } =
        await this.consumerChannel.assertQueue(rabbitmq.productSendQueue, {
          durable: false,
          expires: 60000,
          autoDelete: true,
        });

      this.customerEventEmitter = new EventEmitter();
      this.customerProducer = new producer(
        this.producerChannel,
        productSendQueue,
        this.customerEventEmitter
      );
      this.customerConsumer = new consumer(
        this.consumerChannel,
        productSendQueue,
        this.customerEventEmitter
      );

      this.customerConsumer.consumeFromCustomer(service);
    } catch (error) {
      console.log("Some issue in products rpc-client");
      console.log(error);
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new rabbitMQClient();
    }
    return this.instance;
  }

  async produce(data) {
    let resp = await this.producer.produce(data);
    // console.log(resp, " is the recieved data at produce");
    return resp;
  }

  // this produce just replies
  async produceToCustomer(data, correlationId, replyQueue) {
    console.log("Produced messages from products side to : ", replyQueue);
    this.producerChannel.sendToQueue(
      replyQueue,
      Buffer.from(JSON.stringify(data)),
      {
        correlationId: correlationId,
      }
    );
  }
}

export default rabbitMQClient.getInstance();
