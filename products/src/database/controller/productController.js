import { customError } from "../../utils/customError.js";
import { productModel } from "../model/product.js";
import mongoose from "mongoose";

export class productController {

    // get all products
    async getProducts() {
        let products = await productModel.find()
        return products
    }

    async deleteProduct(id) {
        try {
            let deletedItem = await productModel.findByIdAndDelete(id)
            return deletedItem
        } catch (error) {
            throw new customError("Unable to delete the item")
        }
    }

    //get one product
    async getProductByID(id) {
        console.log(105);
        let product = await productModel.findById(id)
        return product
    }

    //add one product
    async addNewProduct(req) {
        let { title, brand,rating, countOfRating, mrp, availablePrice, discount, noCostOfEmi, countOfBought, url, thumbnail, images } = req.body
        let data = { title, brand,rating, countOfRating, mrp, availablePrice, discount, noCostOfEmi, countOfBought, url, thumbnail, images }
        let newProduct = await productModel.create(data)
        return newProduct
    }


}