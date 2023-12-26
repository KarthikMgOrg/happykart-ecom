import { shoppingService } from "../services/shoppingService.js";
import { protectRoute } from "./middleware/protectRoute.js";
import { subscribeMessage } from "../utils/index.js";

export async function appRouter(app, channel, redis) {
  const service = new shoppingService();

  //subscribe to messages
  subscribeMessage(channel, service);

  app.use("/favicon.ico", (req, res) => {
    res.status(404).end();
  });

  /**
   * @swagger
   * /:
   *   get:
   *     summary: Health Check
   *     description: Check the health status of the API.
   *     responses:
   *       200:
   *         description: API is up and running
   */
  app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
  });

  //get customers
  /**
   * @swagger
   * /api/shopping:
   *   get:
   *     summary: Get Shopping Service
   *     description: Get information about the shopping service.
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   example: "Welcome to shopping service"
   */
  app.get("/api/shopping", async (req, res, next) => {
    res.status(200).json({ data: "Welcome to shopping service" });
  });

  /**
   * @swagger
   * /api/shopping/getOrders:
   *   get:
   *     summary: Get Orders
   *     description: Get a list of orders.
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     example: { orderId: "123", status: "Pending" }
   *       401:
   *         description: Unauthorized request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  app.get("/api/shopping/getOrders", protectRoute, async (req, res, next) => {
    let orders = await service.getOrders();
    res.status(200).json({ data: orders });
  });
  /**
   * @swagger
   * /api/shopping/createOrder:
   *   post:
   *     summary: Create Order
   *     description: Create a new order.
   *     responses:
   *       200:
   *         description: Order created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   example: { orderId: "456", status: "Processing" }
   *       401:
   *         description: Unauthorized request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */
  app.post(
    "/api/shopping/createOrder",
    protectRoute,
    async (req, res, next) => {
      let userId = req.user._id;
      let newOrder = await service.createOrder(userId);
      res.status(200).json({ data: newOrder });
    }
  );
}
