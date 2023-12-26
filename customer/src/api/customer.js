import { customerService } from "../services/customerService.js";
import { protectRoute } from "./middleware/protectRoute.js";
import { subscribeMessage } from "../utils/index.js";
import { rabbitMQClient } from "../rpc/client.js";
export function appRouter(app, channel, redis) {
  const service = new customerService();

  // subscribe to a channel
  subscribeMessage(channel, service);
  // Health check endpoint
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
   * /api/customers:
   *   get:
   *     summary: Get Customers
   *     description: Get a welcome message for the customer service.
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
   *                   example: "Welcome to customer service"
   */
  app.get("/api/customers", async (req, res, next) => {
    res.status(200).json({ data: "Welcome to customer service" });
  });
  app.get(
    "/api/customers/getCustomer/:id",
    protectRoute,
    async (req, res, next) => {
      let { id } = req.params;
      let customer = await service.getCustomerById(id);
      res.status(200).json({ data: customer });
    }
  );

  //signup
  /**
   * @swagger
   * /api/customers/signup:
   *   post:
   *     summary: Customer Signup
   *     description: Register a new customer.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               passwordConfirm:
   *                 type: string
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   example: { customerId: "123", email: "john@example.com" }
   */
  app.post("/api/customers/signup", async (req, res, next) => {
    // let {email, password, passwordConfirm} = req.body
    try {
      let signup = await service.signup(req.body);
      res.status(200).json({ data: signup });
    } catch (error) {
      next(error.message);
    }
  });

  /**
   * @swagger
   * /api/customers/getCustomer/{id}:
   *   get:
   *     summary: Get Customer by ID
   *     description: Get details of a customer by ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Customer ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   example: { customerId: "123", name: "John Doe" }
   *     security:
   *       - bearerAuth: []
   */
  app.get("/api/customers/cart", protectRoute, async (req, res, next) => {
    let cartDetails;
    let cachedCart = await redis.get(`${req.user._id}:cartData`);
    if (cachedCart) {
      // console.log("cache found");
      cartDetails = JSON.parse(cachedCart);
    } else {
      // console.log("no cache found!");
      cartDetails = await service.getCart(req.user);
      await redis.set(`${req.user._id}:cartData`, JSON.stringify(cartDetails), {
        EX: 60 * 3,
      });
    }
    res.status(200).json({ data: cartDetails });
  });
  /**
   * @swagger
   * /api/customers/wishlist:
   *   get:
   *     summary: Get Customer's Wishlist
   *     description: Get details of the customer's wishlist.
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   example: { items: [...], total: 50 }
   *     security:
   *       - bearerAuth: []
   */
  app.get("/api/customers/wishlist", protectRoute, async (req, res, next) => {
    let wishlistDetails;
    let wishlistCache = await redis.get(`${req.user._id}:wishlistData`);
    if (wishlistCache) {
      console.log("wishlist - cache found");
      wishlistDetails = JSON.parse(wishlistCache);
    } else {
      console.log("wishlist - no cache");
      wishlistDetails = await service.getWishlist(req.user);
      await redis.set(
        `${req.user._id}:wishlistData`,
        JSON.stringify(wishlistDetails),
        {
          EX: 60 * 3,
        }
      );
    }
    res.status(200).json({ data: wishlistDetails });
  });

  //clear the cart
  /**
   * @swagger
   * /api/customers/cart:
   *   delete:
   *     summary: Clear Customer's Cart
   *     description: Clear the customer's shopping cart.
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
   *                   example: "Cart cleared successfully"
   *     security:
   *       - bearerAuth: []
   */
  app.delete("/api/customers/cart", protectRoute, async (req, res, next) => {
    console.log("deleting cart");
    await service.clearCart(req.user);
    res.status(200).json({ data: "deleted the cart" });
  });

  /**
   * @swagger
   * /api/customers/address:
   *   get:
   *     summary: Get Customer's Address
   *     description: Get the customer's address details.
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   example: { street: "123 Main St", city: "City", zip: "12345" }
   *     security:
   *       - bearerAuth: []
   */
  app.get("/api/customers/address", protectRoute, async (req, res, next) => {
    let address = await service.getAddress(req.user);
    res.status(200).json({ data: address });
  });
  /**
   * @swagger
   * /api/customers/app-events:
   *   use:
   *     post:
   *       summary: Subscribe to App Events
   *       description: Subscribe to events in the application.
   *       responses:
   *         200:
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   data:
   *                     type: string
   *                     example: "Subscription successful"
   *       security:
   *         - bearerAuth: []
   */
  app.use("/api/customers/app-events", protectRoute, async (req, res, next) => {
    console.log("Recieved axios request");
    let payload = req.body;
    let userId = req.user._id;
    console.log(req.user, " is the user in app-events");
    let data = await service.subscribeToEvents(payload, userId);
    res.send(data);
  });

  app.post(
    "/api/customers/updateAddress",
    protectRoute,
    async (req, res, next) => {
      let addedAddress = await service.updateAddress(req);
      res.status(200).json({ data: addedAddress });
    }
  );
}
