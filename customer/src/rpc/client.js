import amqplib from "amqplib";
import { rabbitmq } from "./config.js";
import { producer } from "./producer.js";
import { consumer } from "./consumer.js";
import dotenv from "dotenv";
import { getParameterValue } from "../utils/get_ssm_params.js";
import { EventEmitter } from "events";

//load dotenv
dotenv.config();

export class rabbitMQClient {
  producer;
  consumer;
  connection;
  producerChannel;
  consumerChannel;
  isinitialized = false;
  static instance;

  async initialize(service) {
    try {
      // define the connection
      let rabbitmqURI = await getParameterValue(
        "/javascript/mini_projects/11_moving_to_microservice_with_message_broker/rabbitmq_uri"
      );
      this.connection = await amqplib.connect(rabbitmqURI);
      console.log("Connected to RPC");

      // producer
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: ReplyQueue } = await this.consumerChannel.assertQueue(
        rabbitmq.standardSendQueue,
        { durable: false, expires: 60000, autoDelete: true }
      );
      this.eventEmitter = new EventEmitter();

      this.producer = new producer(
        this.producerChannel,
        ReplyQueue,
        this.eventEmitter
      );
      this.consumer = new consumer(
        this.consumerChannel,
        ReplyQueue,
        this.eventEmitter
      );

      this.consumer.consume(service);

      // communicate with products
      const { queue: productSendQueue } =
        await this.consumerChannel.assertQueue("", {
          durable: false,
          expires: 60000,
          autoDelete: true,
        });
      this.productEventEmitter = new EventEmitter();

      this.productProducer = new producer(
        this.producerChannel,
        productSendQueue,
        this.productEventEmitter
      );
      this.productConsumer = new consumer(
        this.producerChannel,
        productSendQueue,
        this.productEventEmitter
      );

      this.productConsumer.consumeProducts();

      // communicate with shopping

      const { queue: shoppingSendQueue } =
        await this.consumerChannel.assertQueue(rabbitmq.customerSendQueue, {
          durable: false,
          expires: 60000,
          autoDelete: true,
        });
      this.customerEventEmitter = new EventEmitter();

      this.customerProducer = new producer(
        this.producerChannel,
        shoppingSendQueue,
        this.customerEventEmitter
      );
      this.customerConsumer = new consumer(
        this.consumerChannel,
        shoppingSendQueue,
        this.customerEventEmitter
      );

      this.customerConsumer.consumeShopping(service);
    } catch (error) {
      console.log("Some issue in customer rpc-client");
      console.log(error);
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new rabbitMQClient();
    }
    return this.instance;
  }

  async produce(data, correlationId, replyQueue) {
    // if (!this.isinitialized) {
    //     // define the connection
    //     this.connection = await amqplib.connect(rabbitmq.url)
    //     // define producer and consumer channels
    //     this.producerChannel = await this.connection.createChannel()
    //     this.consumerChannel = await this.connection.createChannel()

    //     this.eventEmitter = new EventEmitter()

    //     //define the queue that customer would be recieving on
    //     const { queue: RPCQueue } = await this.consumerChannel.assertQueue(
    //         rabbitmq.recieveQueue,
    //         { exclusive: false }
    //     )

    //     // define producer and consumers
    //     this.producer = new producer(this.producerChannel, RPCQueue, this.eventEmitter)
    //     this.consumer = new consumer(this.producerChannel, RPCQueue, this.eventEmitter)
    // }
    // console.log("producing reply");
    return await this.producer.produce(data, correlationId, replyQueue);
  }

  async produceToProducts(data) {
    return await this.productProducer.produceToProducts(data);
  }

  async produceToShopping(data, correlationId, replyQueue) {
    return await this.customerProducer.produceToShopping(
      data,
      correlationId,
      replyQueue
    );
  }
}

export default rabbitMQClient.getInstance();
