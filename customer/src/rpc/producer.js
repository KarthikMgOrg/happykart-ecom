import { v4 as uuidv4 } from "uuid";
import { rabbitmq } from "./config.js";

export class producer {
  constructor(channel, queue, eventEmitter) {
    this.channel = channel;
    (this.queue = queue), (this.eventEmitter = eventEmitter);
  }

  // this produce just replies
  async produce(data, correlationId, replyQueue) {
    console.log("Produced messages from customer side: ", replyQueue);
    this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(data)), {
      correlationId: correlationId,
    });
  }

  async produceToProducts(data) {
    console.log("Produced message to products: ", data);
    // create a random id that acts as correlation id
    console.log("*** Reply To: ***", this.queue);
    const uuid = uuidv4();
    this.channel.sendToQueue(
      rabbitmq.productSendQueue,
      Buffer.from(JSON.stringify(data)),
      {
        correlationId: uuid,
        replyTo: this.queue,
      }
    );

    //wait for the response
    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());
        // console.log(`Final reply`, reply);
        resolve(reply);
      });
    });
  }

  async produceToShopping(data, correlationId, replyQueue) {
    console.log("Produced messages from customer side: ", replyQueue);
    this.channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify(data)), {
      correlationId: correlationId,
    });
  }
}
