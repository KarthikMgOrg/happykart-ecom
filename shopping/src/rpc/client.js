import amqplib from "amqplib";
import { rabbitmq } from "./config.js";
import { producer } from "./producer.js";
import { consumer } from "./consumer.js";
import { EventEmitter } from "events";

export class rabbitMQClient {
  connection;
  producer;
  consumer;
  producerChannel;
  consumerChannel;
  static instance;
  eventEmitter;

  async initialize() {
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

      //communicate with customer
      const { queue: customerSendQueue } =
        await this.consumerChannel.assertQueue("", {
          durable: false,
          expires: 60000,
          autoDelete: true,
        });

      this.customerEventEmitter = new EventEmitter();

      this.customerProducer = new producer(
        this.producerChannel,
        customerSendQueue,
        this.customerEventEmitter
      );
      this.customerConsumer = new consumer(
        this.consumerChannel,
        customerSendQueue,
        this.customerEventEmitter
      );

      this.customerConsumer.consumeCustomer();
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
    return await this.producer.produce(data);
  }

  async produceToCustomer(data) {
    return await this.customerProducer.produceToCustomer(data);
  }
}

export default rabbitMQClient.getInstance();
