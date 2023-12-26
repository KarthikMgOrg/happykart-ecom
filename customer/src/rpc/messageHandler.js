import rabbitMQClient from "./client.js";

export class messageHandler {

    static async handle(data, correlationId, replyTo) {
        console.log("handling message");
        await rabbitMQClient.produce(data, correlationId, replyTo)
    }

    static async handleShopping(data, correlationId, replyTo) {
        console.log("handling message");
        await rabbitMQClient.produceToShopping(data, correlationId, replyTo)
    }
}