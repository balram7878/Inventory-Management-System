const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Database/config/db");
const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const inventoryRoutes = require("./src/routes/inventory.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const orderRoutes = require("./src/routes/order.routes");
const cartRoutes = require("./src/routes/cart.routes");
const customerRoutes = require("./src/routes/customer.routes");
const supplierRoutes = require("./src/routes/supplier.routes");
const { notFound, errorHandler } = require("./src/middleware/error.middleware");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://inventory-management-system-neelam.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Inventory API running" });
});

app.use("/", authRoutes);
app.use("/products", productRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/customers", customerRoutes);
app.use("/suppliers", supplierRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const initializeServer = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

initializeServer();
