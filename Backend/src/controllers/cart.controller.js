const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.populate("items.productId", "name price quantity category imageUrl");

    const validItems = (cart.items || []).filter((item) => item.productId);
    if (validItems.length !== cart.items.length) {
      cart.items = validItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));
      await cart.save();
      await cart.populate("items.productId", "name price quantity category imageUrl");
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity || 1);

    if (!productId || qty <= 0) {
      return res.status(400).json({ message: "productId and positive quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await getOrCreateCart(req.user.id);
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    await cart.populate("items.productId", "name price quantity category imageUrl");
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user.id);

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    await cart.populate("items.productId", "name price quantity category imageUrl");
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }

    const cart = await getOrCreateCart(req.user.id);
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = qty;
    await cart.save();

    await cart.populate("items.productId", "name price quantity category imageUrl");
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const checkoutCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.populate("items.productId");

    if (!cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);

      if (!product) {
        return res.status(404).json({ message: "One or more products no longer exist" });
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
      customerId: req.user.id,
      paymentStatus: "pending",
      orderStatus: "payment_pending",
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Checkout successful. Please complete payment.",
      order,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  checkoutCart,
};
