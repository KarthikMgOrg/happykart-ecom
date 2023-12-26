import { customerController } from "../database/controller/customerController.js";
import { generateToken } from "../utils/generateToken.js";
import {
  connectToRedis,
  disconnectFromRedis,
} from "../redis/connectToRedis.js";

export class customerService {
  constructor() {
    this.service = new customerController();
  }

  async getCustomers() {
    let customers = await this.service.getCustomers();
    return customers;
  }
  async getCustomerById(data) {
    let user = await this.service.getCustomerById(data);
    return user;
  }
  async signup(data) {
    let newUser = await this.service.signup(data);
    const token = await generateToken(newUser);
    return token;
  }
  async login(data) {
    let loginUser = await this.service.login(data);
    let { id } = loginUser;
    //generate token
    const token = await generateToken(loginUser);
    return { token, id };
  }
  async getCart(data) {
    let cart = await this.service.getCart(data);
    return cart;
  }

  async clearCart(data) {
    this.service.clearCart(data);
  }

  async getWishlist(data) {
    let wishlist = await this.service.getWishlist(data);
    return wishlist;
  }
  async getAddress(data) {
    let address = await this.service.getAddress(data);
    return address;
  }
  async updateAddress(data) {
    let address = await this.service.updateAddress(data);
    return address;
  }
  async subscribeToEvents(payload) {
    let { event, data } = payload;
    let { productId, userId } = data;

    // const redisClient = await connectToRedis();

    switch (event) {
      case "GET_USER":
        console.log("getting user!!! for userID ", userId);
        let user = await this.service.getCustomerById(userId);
        return user;
      case "MANAGE_CART":
        let updatedCart = await this.service.manageCart(payload);
        return updatedCart;
      case "MANAGE_WISHLIST":
        console.log("managin wishlist!!!");
        let updatedWishlist = await this.service.manageWishlist(payload);
        return updatedWishlist;
      case "ADD_ORDER":
        console.log("adding order to user");
        this.service.addOrder(payload);
      case "default":
        break;
    }
  }
}
