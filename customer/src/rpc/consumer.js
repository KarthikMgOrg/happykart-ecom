import { messageHandler } from "./messageHandler.js";

export class consumer {
  constructor(channel, queue, eventEmitter) {
    this.channel = channel;
    (this.queue = queue), (this.eventEmitter = eventEmitter);
  }

  async consume(service) {
    console.log("Ready to consume messages from customer ");
    this.channel.consume(
      this.queue,
      async (message) => {
        let payload = JSON.parse(message.content.toString());
        // console.log("Normal - Consumed message is ", payload);
        let rpcResp = await service.subscribeToEvents(payload);
        // console.log(rpcResp, " is processed response to be sent to client");
        const { correlationId, replyTo } = message.properties;
        await messageHandler.handle(rpcResp, correlationId, replyTo);
      },
      {
        noAck: true,
      }
    );
  }

  async consumeProducts() {
    console.log(`Ready to consume replies that come from products `);
    this.channel.consume(
      this.queue,
      (message) => {
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
        console.log("succesfully emitted the message!");
      },
      {
        noAck: true,
      }
    );
  }

  async consumeShopping(service) {
    console.log("Ready to consume messages from shopping ");
    this.channel.consume(
      this.queue,
      async (message) => {
        let payload = JSON.parse(message.content.toString());
        // console.log("Normal - Consumed message is ", payload);
        let rpcResp = await service.subscribeToEvents(payload);
        console.log(rpcResp, " is processed response to be sent to client");
        const { correlationId, replyTo } = message.properties;
        await messageHandler.handleShopping(rpcResp, correlationId, replyTo);
      },
      {
        noAck: true,
      }
    );
  }
}
