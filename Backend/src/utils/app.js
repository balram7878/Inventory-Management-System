const express = require("express");
const redisClient = require("../../Database/config/redis");
const authRouter = require("../../domains/auth/auth.routes");
const inventoryRouter = require("../../domains/inventory/inventory.routes");
const categoryRouter = require("../../domains/category/category.routes");
const cartRouter = require("../../domains/cart/cart.routes");
const orderRouter = require("../../domains/order/order.routes");
const orderItemsRouter = require("../../domains/order_items/order_items.routes");
const paymentRouter = require("../../domains/payment/payment.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventory-categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/order-items", orderItemsRouter);
app.use("/payment", paymentRouter);

const initializeConnections = async () => {
  try {
    await redisClient.connect();
    app.listen(process.env.PORT, () => {
      console.log("Listening at ", process.env.PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

initializeConnections();
