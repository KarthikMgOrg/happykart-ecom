import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcryptjs";
import { oneProductSchema } from "./schemas/oneProduct.js";
import { placedOrderSchema } from "./schemas/placedOrders.js";
import isURL from "validator/lib/isURL.js";

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email cannot be empty"],
    unique: [true, "email is already registered with us"],
    validator: {
      validate: [isEmail, "Please provide a valid email"],
    },
  },
  password: {
    type: String,
    required: [true, "password cannot be empty"],
    minLength: [4, "password length must be atleast 4"],
  },

  passwordConfirm: {
    type: String,
    required: [true, "passwordConfirm cannot be empty"],
    minLength: [4, "passwordConfirm length must be at least 4"],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Passwords do not match!!!",
    },
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
  },
  // cart: [{ cartSchema }],
  cart: [oneProductSchema],
  wishList: [oneProductSchema],
  orders: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Shopping", // Reference to the Order model in another microservice
    },
  ],
});

//query middleware

//document middleware
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  this.passwordConfirm = hash;
  next();
});

//instance methods
customerSchema.methods.checkPassword = async function (
  candidatePass,
  userPass
) {
  return await bcrypt.compare(candidatePass, userPass);
};

//create customer model
export const customerModel = mongoose.model("customer", customerSchema);
