import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";


export const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product must have a name"]
    },
    mrp: {
        type: Number,
        required: [true, "MRP cannot be empty"]
    },
    available_price: {
        type: Number,
        required: [true, "Available Price cannot be empty"],
        validator: {
            validate: function (el) {
                return el <= this.mrp
            },
            message: "Available Price cannot be greater than MRP"
        }
    },
    url: {
        type: String,
        required: [true, "URL cannot be empty"],
        validator: {
            validate: [isEmail, "URL invalid"]
        }
    }
})