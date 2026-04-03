const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { products, customerId } = req.body;

    if (!products || products.length === 0 || !customerId) {
      return res.status(400).json({ message: "products and customerId are required" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      products: orderItems,
      totalAmount,
      customerId,
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email role")
      .populate("products.productId", "name category imageUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate("products.productId", "name category imageUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const payForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: access denied" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.paymentMethod = paymentMethod || "card";
    await order.save();

    return res.status(200).json({
      message: "Payment completed successfully",
      order,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, getMyOrders, payForOrder };
