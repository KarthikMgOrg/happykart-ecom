import { customError } from "../utils/customError.js";
import { protectRoute } from "./middleware/protectRoute.js";
import { publishCustomerEvents, publishMessage } from "../utils/index.js";
import { ProductService } from "../service/productService.js";
import rabbitMQClient from "../rpc/client.js";

export async function appRouter(app, channel, redis) {
  const service = new ProductService();

  //routes
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

  //get all products
  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get All Products
   *     description: Get a list of all products.
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
   *                     example: { productId: "123", title: "Product 1" }
   */
  app.get("/api/products", async (req, res, next) => {
    let data;
    let cachedData = await redis.get("listingDataCache");
    if (cachedData) {
      console.log("cache found");
      data = JSON.parse(cachedData);
    } else {
      console.log("no cache found");
      data = await service.getProducts();
      await redis.set("listingDataCache", JSON.stringify(data), {
        EX: 60 * 5,
      });
    }

    res.status(200).json({ data });
    // let data = await service.getProducts();
    // res.status(200).json({ data });
  });

  //add new product
  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Add New Product
   *     description: Add a new product.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               url:
   *                 type: string
   *               mrp:
   *                 type: number
   *               availablePrice:
   *                 type: number
   *               seller:
   *                 type: string
   *     responses:
   *       201:
   *         description: Product added successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   example: { productId: "456", title: "Product 2" }
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
  app.post("/api/products", protectRoute, async (req, res, next) => {
    try {
      console.log(req.body, " is the body");
      // let { title, url, mrp, availablePrice, seller } = req.body
      let data = await service.addNewProduct(req);
      res.status(201).json({ data });
    } catch (error) {
      next(new customError(error.message, 401));
    }
  });

  //delete a product
  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete Product by ID
   *     description: Delete a product by ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Product ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   example: "Item deleted"
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
  app.delete("/api/products/:id", protectRoute, async (req, res, next) => {
    try {
      let { id } = req.params;
      let deletedProduct = await service.deleteProduct(id);
      res.status(200).json({ data: "Item deleted" });
    } catch (error) {
      next(new customError(error.message, 401));
    }
  });

  //add/update to wishlist
  /**
   * @swagger
   * /api/products/manageWishlist:
   *   patch:
   *     summary: Add/Update to Wishlist
   *     description: Add or update a product to the user's wishlist.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               payload:
   *                 type: object
   *     responses:
   *       200:
   *         description: Updated wishlist successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   example: "Updated wishlist"
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
  app.patch(
    "/api/products/manageWishlist",
    protectRoute,
    async (req, res, next) => {
      let { payload } = req.body;
      payload.data.userId = req.user._id;
      // let data = await publishCustomerEvents(payload, headers)
      publishMessage(
        channel,
        process.env.CUSTOMER_BINDING_KEY,
        JSON.stringify(payload)
      );
      res.status(200).json({ data: "updated wishlist" });
    }
  );

  //add/update to cart
  /**
   * @swagger
   * /api/products/manageCart:
   *   patch:
   *     summary: Add/Update to Cart
   *     description: Add or update a product to the user's cart.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               payload:
   *                 type: object
   *     responses:
   *       200:
   *         description: Updated cart successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   example: "Updated cart"
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
  app.patch(
    "/api/products/manageCart",
    protectRoute,
    async (req, res, next) => {
      console.log(100);
      let { payload } = req.body;
      payload.data.userId = req.user._id;
      // let data = await publishCustomerEvents(payload, headers)
      publishMessage(
        channel,
        process.env.CUSTOMER_BINDING_KEY,
        JSON.stringify(payload)
      );
      res.status(200).json({ data: "updated cart" });
    }
  );

  // configure app-events
  /**
   * @swagger
   * /api/products/app-events:
   *   use:
   *     post:
   *       summary: Configure App Events
   *       description: Configure events for the application.
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 payload:
   *                   type: object
   *       responses:
   *         200:
   *           description: Configuration successful
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   data:
   *                     type: string
   *                     example: "Configuration successful"
   */
  app.use("/api/products/app-events", async (req, res, next) => {
    let { payload } = req.body;
    let data = await service.subscribeToEvents(req.body);
    res.status(200).json({ data });
  });

  //rpc route
  /**
   * @swagger
   * /api/products/rpc:
   *   get:
   *     summary: RPC Route
   *     description: Execute RPC operation.
   *     responses:
   *       200:
   *         description: RPC operation successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: string
   *                   example: "RPC operation successful"
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
  app.get("/api/products/rpc", protectRoute, async (req, res, next) => {
    let { payload } = req.body;
    payload.data.userId = req.user._id;
    await rabbitMQClient.produce(payload);
    res.status(200).json({ data: "Message published" });
  });

  //get product by ID
  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Get Product by ID
   *     description: Get details of a product by ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Product ID
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
   *                   example: { productId: "123", title: "Product 1" }
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
  app.get("/api/products/:id", protectRoute, async (req, res, next) => {
    let { id } = req.params;
    let data = await service.getProductsByID(id);
    res.status(200).json({ data });
  });
}
