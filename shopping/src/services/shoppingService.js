import { shoppingController } from "../database/controller/shoppingController.js"

export class shoppingService {
    constructor() {
        this.service = new shoppingController()
    }

    async getOrders() {
        let orders = await this.service.getOrders()
        return orders
    }

    async createOrder(userId) {
        let newOrder = await this.service.createOrder(userId)
        return newOrder
    }
}