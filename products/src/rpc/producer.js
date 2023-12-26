import { v4 as uuidv4 } from "uuid";
import { rabbitmq } from "./config.js";

export class producer {
  constructor(channel, queue, eventEmitter) {
    (this.channel = channel),
      (this.queue = queue),
      (this.eventEmitter = eventEmitter);
  }

  async produce(data) {
    // console.log("Produced message from products client is: ", data);
    // create a random id that acts as correlation id
    // console.log("*** Reply To: ***", this.queue);
    const uuid = uuidv4();
    this.channel.sendToQueue(
      rabbitmq.standardSendQueue,
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
        resolve(reply);
      });
    });
  }
}
