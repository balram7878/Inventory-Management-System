const express = require("express");
const redisClient = require("../../Database/config/redis");
const authRouter = require("../../domains/auth/auth.routes");
const inventoryRouter = require("../../domains/inventory/inventory.routes");
const categoryRouter = require("../../domains/category/category.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventory-categories", categoryRouter);

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
