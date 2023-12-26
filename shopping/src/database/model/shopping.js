import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";

//declare schema

export const shoppingSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "OrderId cannot be empty"],
    },
    customerId: {
      type: String,
      required: [true, "customerId cannot be empty"],
    },
    amount: {
      type: Number,
      required: [true, "Bill amount cannot be empty"],
    },
    status: {
      type: String,
      default: "Created",
      enum: ["Created", "Shipped", "Delivered"],
    },
    items: [
      {
        title: {
          type: String,
          required: [true, "product title cannot be empty"],
        },
        thumbnail: {
          type: String,
        },
        url: {
          type: String,
          validate: {
            validator: isURL,
            message: "url must be a valid hyperlink",
          },
        },
        seller: {
          type: String,
          default: "Appario Retail",
        },
      },
    ],
  },
  { timestamps: true }
);

export const shoppingModel = mongoose.model("Shopping", shoppingSchema);
