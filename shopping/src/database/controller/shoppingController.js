import { shoppingModel } from "../model/shopping.js";
import { createChannel, publishCustomerEvents } from "../../utils/index.js";
import { v4 as uuidv4 } from "uuid";
import rabbitMQClient from "../../rpc/client.js";
import { publishMessage } from "../../utils/index.js";

export class shoppingController {
  async getOrders() {
    let orders = await shoppingModel.find();
    return orders;
  }
  async createOrder(userId) {
    //get customer cart details from the model
    let getUserPayload = {
      event: "GET_USER",
      data: {
        userId: userId,
      },
    };
    // let existingUser = await publishCustomerEvents(getUserPayload)
    let existingUser = await rabbitMQClient.produceToCustomer(getUserPayload);
    let existingUserCart = existingUser.cart;
    let existingUserId = existingUser._id.toString();
    // console.log(existingUserCart, " is the current cart");
    let total = 0;
    let status = "Created";

    if (existingUserCart && Array.isArray(existingUserCart)) {
      existingUserCart.map((item) => {
        total += item.availablePrice;
      });
    }

    //create random id
    const orderId = uuidv4();

    //create an order entry into order model
    let newOrder = await shoppingModel.create({
      orderId: orderId,
      customerId: existingUserId,
      amount: total,
      status: status,
      items: existingUserCart,
    });

    //add order to user
    let orderPayload = {
      event: "ADD_ORDER",
      data: {
        userId: userId,
        order: newOrder,
      },
    };

    console.log("adding order details to user");
    // await publishCustomerEvents(orderPayload) // this is an async request hence rmq can be used

    const channel = await createChannel();

    await publishMessage(
      channel,
      process.env.CUSTOMER_BINDING_KEY,
      JSON.stringify(orderPayload)
    );
    return newOrder;
  }
}
