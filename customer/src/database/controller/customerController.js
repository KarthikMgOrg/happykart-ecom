import { customError } from "../../utils/customError.js";
import { publishProductsEvent } from "../../utils/index.js";
import { customerModel } from "../model/customer.js";
import rabbitMQClient from "../../rpc/client.js";
import {
  connectToRedis,
  disconnectFromRedis,
} from "../../redis/connectToRedis.js";

import { promisify } from "util";

export class customerController {
  async getCustomers() {
    let customers = await customerModel.find();
    return customers;
  }
  async getCustomerById(id) {
    let customer = await customerModel.findById(id).populate("cart");
    return customer;
  }
  async signup({ email, password, passwordConfirm }) {
    let newUser;
    try {
      if (!email || !password) {
        throw new customError("Either email or password is not provided", 401);
      }
      newUser = await customerModel.create({
        email,
        password,
        passwordConfirm,
      });
    } catch (error) {
      console.log(error);
      throw new customError(error.message, 400);
    }
    return newUser;
  }
  async login(data) {
    console.log(data);
    // check if both email and password are provided
    if (!data.email || !data.password) {
      throw new customError("Either email or password is not provided", 401);
    }

    //get user's old password from db based on given email
    let existingUser = await customerModel
      .findOne({ email: data.email })
      .select("+password");
    if (!existingUser) {
      throw new customError("User does not exist", 401);
    }
    // check if provided password matches existing password
    let correctPassword = await existingUser.checkPassword(
      data.password,
      existingUser.password
    );
    if (!correctPassword) {
      throw new customError("Passwords do not match", 400);
    }
    return existingUser;
  }
  async getCart(data) {
    let user = await customerModel.findById(data._id);
    if (!user) {
      throw new customError("User does not exist", 400);
    }
    return user.cart;
  }
  async clearCart(data) {
    const redis = await connectToRedis();
    let user = await customerModel.findById(data._id);
    console.log(user, " is the user");
    user.cart = [];
    await user.save();
    await redis.set(`${data._id}:cartData`, JSON.stringify([]), {
      EX: 60 * 3,
    });
    // redis.del(`${userId}:cartData`);
    await disconnectFromRedis(redis);
  }
  async getWishlist(data) {
    let user = await customerModel.findById(data._id);
    if (!user) {
      throw new customError("User does not exist", 400);
    }
    return user.wishList;
  }
  async getAddress(data) {
    let user = await customerModel.findById(data._id);
    if (!user) {
      throw new customError("User does not exist", 400);
    }
    return user.address;
  }
  async updateAddress(data) {
    console.log(data.body, " is the recieved data");
    let { street, city, state } = data.body;
    let id = data.user._id;

    //get the user
    let existingUser = await customerModel.findById(id);
    if (!existingUser) {
      throw new customError("User does not exist", 400);
    }

    existingUser.address = { street, city, state };
    let updatedUser = await existingUser.save({ validateModifiedOnly: true });
    return updatedUser;
  }
  async manageCart(payload) {
    const redis = await connectToRedis();
    let { productId, userId, isRemove, qty } = payload.data;

    //getuser payload
    let getProductPayload = {
      event: "GET_PRODUCT",
      data: {
        productId: productId,
      },
    };
    //get product data via rpc call
    let existingProduct = await rabbitMQClient.produceToProducts(
      getProductPayload
    );
    if (!existingProduct._id) {
      return new customError("Could not find the product", 400);
    }

    //get user data
    let existingUser = await customerModel.findById(userId);
    let cartItems = existingUser.cart;

    if (cartItems.length > 0) {
      console.log("cart items length is greater than 0");
      let isExist = false;
      const cartItemIds = cartItems.map((item) => item._id.toString());
      let existingObjectId = existingProduct._id.toString();
      const isItemInCart = cartItemIds.includes(existingObjectId);
      if (isItemInCart) {
        isExist = true;
        if (isRemove) {
          let idxToRemove = cartItems.indexOf(existingObjectId);
          const currentItemIndex = cartItems.findIndex(
            (item) => item._id.toString() === existingObjectId
          );

          const currentItem = cartItems.find(
            (item) => item._id.toString() === String(existingObjectId)
          );
          if (currentItem.qty > 1) {
            console.log("quantity greater than 1");
            let updatedItem = currentItem;
            // let currentQty = updatedItem.qty
            updatedItem.qty -= 1;
            cartItems[currentItemIndex] = updatedItem;
          } else {
            cartItems.splice(currentItemIndex, 1);
          }
        } else {
          const currentItemIndex = cartItems.findIndex(
            (item) => item._id === existingObjectId
          );
          const currentItem = cartItems.find(
            (item) => item._id.toString() === String(existingObjectId)
          );
          currentItem.qty += 1;
          cartItems[currentItemIndex] = currentItem;
        }
      } else {
        if (!isRemove) {
          existingProduct.qty = 1;
          cartItems.push(existingProduct);
        }
      }
    } else {
      if (!isRemove) {
        existingProduct.qty = qty;
        cartItems.push(existingProduct);
      }
    }
    existingUser.cart = cartItems;
    let updateUserCart = await existingUser.save();
    // console.log(cartItems, " is the final cart before redis push");
    await redis.set(`${userId}:cartData`, JSON.stringify(cartItems), {
      EX: 60 * 5,
    });
    // redis.del(`${userId}:cartData`);
    await disconnectFromRedis(redis);
    return updateUserCart;
  }
  async manageWishlist(payload) {
    const redis = await connectToRedis();
    console.log("Managing wishlist controller");
    let { productId, userId, isRemove } = payload.data;
    //getuser payload
    let getProductPayload = {
      event: "GET_PRODUCT",
      data: {
        productId: productId,
      },
    };
    let headers = {
      "Content-Type": "application/json",
    };

    //get product data
    // let existingProduct = await productModel.findById(productId)
    // let existingProduct = await publishProductsEvent(getProductPayload, headers)
    let existingProduct = await rabbitMQClient.produceToProducts(
      getProductPayload
    );
    if (!existingProduct) {
      return new customError("Could not find the product", 400);
    }

    console.log(existingProduct, " is the existing product");

    //get user data
    let existingUser = await customerModel.findById(userId);
    let wishListItems = existingUser.wishList;

    if (wishListItems.length > 0) {
      let isExist = false;
      const wishListItemIds = wishListItems.map((item) => item._id.toString());
      let existingObjectId = existingProduct._id.toString();

      const isItemInWishlist = wishListItemIds.includes(existingObjectId);
      if (isItemInWishlist) {
        isExist = true;
        if (isRemove) {
          const currentItemIndex = wishListItems.findIndex(
            (item) => item._id.toString() === existingObjectId
          );
          wishListItems.splice(currentItemIndex, 1);
        } else {
          wishListItems.push(existingProduct);
        }
      } else {
        if (!isRemove) {
          wishListItems.push(existingProduct);
        }
      }
    } else {
      wishListItems.push(existingProduct);
    }
    existingUser.wishList = wishListItems;
    let updateUserWishlist = await existingUser.save();
    await redis.set(`${userId}:wishlistData`, JSON.stringify(wishListItems), {
      EX: 60 * 5,
    });
    await disconnectFromRedis(redis);

    return updateUserWishlist;
  }
  async addOrder(payload) {
    let { userId, order } = payload.data;

    //get user
    let existingUser = await customerModel.findById(userId);
    existingUser.orders.push(order._id);
    existingUser.cart = [];
    await existingUser.save();
    console.log("Updated orders");
  }
}
