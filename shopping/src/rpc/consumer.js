export class consumer {
  constructor(channel, queue, eventEmitter) {
    this.channel = channel;
    (this.queue = queue), (this.eventEmitter = eventEmitter);
  }

  async consume() {
    console.log("Ready to consume messages from shopping: ");
    this.channel.consume(
      this.queue,
      (message) => {
        // console.log("Consumed message from shopping side is ", JSON.parse(message.content.toString()));
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true,
      }
    );
  }

  async consumeCustomer() {
    console.log(`Ready to consume replies that come from customer `);
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
}
