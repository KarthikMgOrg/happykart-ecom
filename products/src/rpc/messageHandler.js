import rabbitMQClient from "./client.js";

export class messageHandler {

    static async handle(data, correlationId, replyTo) {
        console.log("handling message");
        await rabbitMQClient.produceToCustomer(data, correlationId, replyTo)
    }
}