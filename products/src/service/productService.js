import { productController } from "../database/controller/productController.js"

export class ProductService {
    constructor() {
        this.service = new productController()
    }

    async getProducts() {
        return await this.service.getProducts()
    }

    async getProductsByID(id) {
        console.log(104);
        let data = await this.service.getProductByID(id)
        return data
    }

    async addNewProduct(req) {
        return await this.service.addNewProduct(req)
    }
    
    async deleteProduct(id) {
        return await this.service.deleteProduct(id)
    }

    async subscribeToEvents(payload) {
        console.log('103 Triggering.... Customer Events')
        console.log(payload, " is the payload");
        const { event, data } = payload;
        let { id, userId, productId } = data
        switch (event) {
            case 'GET_PRODUCT':
                console.log("getting product");
                const productData = await this.getProductsByID(productId)
                return productData
            default:
                console.log("Default case fired");
                break
        }
    }
}