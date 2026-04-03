const sql = require("../../Database/config/postgres");

const placeOrder = async (req, res) => {
  try {
    const user_id = req.user.sub;

    //Fetch user cart
    const cartItems = await sql`
      SELECT c.cart_id, c.product_id, c.quantity, p.price, p.quantity AS stock
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = ${user_id};
    `;

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    //Validate stock
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          error: `Product ID ${item.product_id} has only ${item.stock} left`,
        });
      }
    }

    //Calculate total amount from cart
    const total_amount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Begin Transaction
    const orderResponse = await sql.begin(async (tx) => {
      // STEP 4.1 → CREATE ORDER
      const order = await tx`
        INSERT INTO orders (user_id, total_amount)
        VALUES (${user_id}, ${total_amount})
        RETURNING *;
      `;
      const order_id = order[0].order_id;

      // INSERT ORDER ITEMS
      const orderItems = await tx`
        INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
        VALUES ${tx(
          cartItems.map((i) => [order_id, i.product_id, i.quantity, i.price])
        )}
        RETURNING *;
      `;

      // DEDUCT PRODUCT STOCK
      for (const item of cartItems) {
        await tx`
          UPDATE products
          SET quantity = quantity - ${item.quantity}
          WHERE product_id = ${item.product_id};
        `;
      }

      // CLEAR CART
      await tx`
        DELETE FROM cart WHERE user_id = ${user_id};
      `;

      // Return order + order_items
      return { order: order[0], items: orderItems };
    });

    //SUCCESS RESPONSE
    res.status(201).json({
      message: "Order placed successfully",
      order: orderResponse.order,
      items: orderResponse.items,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTrackingStatus = async (req, res) => {
  try {
    const { order_id, tracking_status } = req.body;

    if (!order_id || !tracking_status)
      return res
        .status(400)
        .json({ error: "order_id and tracking_status required" });

    const allowed = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!allowed.includes(tracking_status))
      return res.status(400).json({ error: "Invalid tracking status" });

    const updated = await sql`
      UPDATE orders
      SET tracking_status=${tracking_status}
      WHERE order_id=${order_id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ error: "Order not found" });

    res.status(200).json({
      message: "Tracking status updated",
      order: updated[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTrackingStatus = async (req, res) => {
  try {
    const { order_id } = req.params.id;
    const user_id = req.user.sub;

    const order = await sql`
      SELECT tracking_status
      FROM orders
      WHERE order_id=${order_id} AND user_id=${user_id}
      LIMIT 1;
    `;

    if (order.length === 0)
      return res.status(404).json({ error: "Order not found or unauthorized" });

    res.status(200).json({
      order_id,
      tracking_status: order[0].tracking_status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order_id = req.params.id;
    const user_id = req.user.sub;

    if (!order_id) {
      return res.status(400).json({ error: "order_id required" });
    }

    const order = await sql`
      SELECT * FROM orders 
      WHERE order_id = ${order_id} AND user_id = ${user_id}
      LIMIT 1;
    `;

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    res.status(200).json(order[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.sub;

    const orders = await sql`
      SELECT * FROM orders
      WHERE user_id = ${user_id}
      ORDER BY order_date DESC;
    `;

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order_id = req.params.id;
    const user_id = req.user.sub;

    if (!order_id) {
      return res.status(400).json({ error: "order_id required" });
    }

    const order = await sql`
      SELECT * FROM orders
      WHERE order_id = ${order_id} AND user_id = ${user_id}
      LIMIT 1;
    `;

    if (order.length === 0)
      return res.status(404).json({ error: "Order not found or unauthorized" });

    if (order[0].status === "cancelled")
      return res.status(400).json({ error: "Order already cancelled" });

    if (order[0].status === "shipped")
      return res.status(400).json({ error: "Order shipped, can't cancelled" });

    const updated = await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE order_id = ${order_id}
      RETURNING *;
    `;

    res.status(200).json({
      message: "Order cancelled",
      order: updated[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await sql`
      SELECT * FROM orders
      ORDER BY order_date DESC;
    `;

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { order_id, status, mode_of_payment, total_amount } = req.body;

    if (!order_id) return res.status(400).json({ error: "order_id required" });

    const order = await sql`
      UPDATE orders
      SET
        status = COALESCE(${status}, status),
        mode_of_payment = COALESCE(${mode_of_payment}, mode_of_payment),
        total_amount = COALESCE(${total_amount}, total_amount)
      WHERE order_id = ${order_id}
      RETURNING *;
    `;

    if (order.length === 0)
      return res.status(404).json({ error: "Order not found" });

    res.status(200).json({
      message: "Order updated successfully",
      order: order[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  placeOrder,
  cancelOrder,
  updateOrder,
  getOrderDetails,
  getUserOrders,
  getAllOrders,
  updateTrackingStatus,
  getTrackingStatus,
};
