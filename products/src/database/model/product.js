import mongoose, { mongo } from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import isURL from "validator/lib/isURL.js";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product name cannot be empty"]
    },
    brand: {
        type:String,
        default: "Amazon"
    },
    rating: {
        type:Number,
        required: [true, 'Rating value is required'],
        min:[1.0, 'Rating must be at least 1.0'],
        max:[5.0, 'Rating cannot exceed 5.0']
    },
    countOfRating : {
        type:Number
    },
    mrp: {
        type: Number,
        required: [true, "mrp cannot be empty"],
    },
    availablePrice: {
        type: Number,
        required: [true, "available price cannot be empty"],
        validator: {
            validate: function (el) {
                return el <= this.mrp
            },
            message: "available price cannot be higher than MRP"
        }
    },
    discount: {
        type: Number
    },
    noCostEmi: {
        type:String
    },
    countOfBought: {
        type:String
    },
    url: {
        type: String,
        required: [true, "URL field cannot be empty"],
        validate: [isURL, "Please enter a valid URL"],
        unique: [true, "Product already exists"]
    },
    thumbnail: {
        type: String,
        default: "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
    },
    images: [
        {
            type:String
        }
    ]
})


//document middleware

//query middleware

//instance methods

export const productModel = mongoose.model("product", productSchema)