const sql = require("../../Database/config/postgres");


const placeOrder = async (req, res) => {
  try {
    const user_id = req.user.sub;
    const { total_amount, mode_of_payment } = req.body;

    if (!total_amount || !mode_of_payment) {
      return res.status(400).json({ error: "total_amount and mode_of_payment required" });
    }

    const order = await sql`
      INSERT INTO orders (user_id, total_amount, mode_of_payment)
      VALUES (${user_id}, ${total_amount}, ${mode_of_payment})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.query;
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
    const { order_id } = req.body;
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

    if (!order_id)
      return res.status(400).json({ error: "order_id required" });

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
};
