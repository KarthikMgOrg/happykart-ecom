import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";

export const placedOrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        default:null
        // required: [true, "OrderId cannot be empty"],
        // unique: [true, "OrderId already exists.. Make sure you pass in your unique ID"]
    },
    customerId: {
        type: String,
        // required: [true, "customerId cannot be empty"]
    },
    amount: {
        type: Number,
        // required: [true, "Bill amount cannot be empty"]
    },
    status: {
        type: String,
        default: "Created",
        enum: ["Created", "Shipped", "Delivered"]
    },
    items: [
        {
            title: {
                type: String,
                // required: [true, "product title cannot be empty"]
            },
            mrp: {
                type: Number,
                // required: [true, "mrp cannot be empty"]
            },
            availablePrice: {
                type: Number,
                // required: [true, "availablePrice cannot be empty"]
            },
            url: {
                type: String,
                validate: {
                    validator: isURL,
                    message: "url must be a valid hyperlink"
                }
            },
            seller: {
                type: String,
                default: "Appario Retail"
            }
        }
    ]
})


