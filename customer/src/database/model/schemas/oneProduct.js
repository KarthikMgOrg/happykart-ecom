import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";

export const oneProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "product title cannot be empty"],
  },
  mrp: {
    type: Number,
    required: [true, "mrp cannot be empty"],
  },
  availablePrice: {
    type: Number,
    required: [true, "availablePrice cannot be empty"],
  },
  url: {
    type: String,
    validate: {
      validator: isURL,
      message: "url must be a valid hyperlink",
    },
  },
  brand: {
    type: String,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: isURL,
      message: "url must be a valid hyperlink",
    },
    cart: {
      type: Number,
      default: 1,
    },
  },
  qty: {
    type: Number,
  },
});
