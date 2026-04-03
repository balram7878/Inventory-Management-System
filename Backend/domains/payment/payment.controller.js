const sql = require("../../Database/config/postgres");
const { v4: uuidv4 } = require("uuid");

const initiatePayment = async (req, res) => {
  try {
    const user_id = req.user.sub;
    const { order_id, payment_method } = req.body;

    if (!order_id || !payment_method)
      return res.status(400).json({ error: "order_id and payment_method required" });

    const order = await sql`
      SELECT * FROM orders WHERE order_id=${order_id} AND user_id=${user_id};
    `;

    if (order.length === 0)
      return res.status(404).json({ error: "Order not found" });

    const transaction_id = "TXN-" + uuidv4();

    const payment = await sql`
      INSERT INTO payment(order_id, user_id, amount, payment_method, transaction_id)
      VALUES (${order_id}, ${user_id}, ${order[0].total_amount}, ${payment_method}, ${transaction_id})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Payment initiated",
      payment: payment[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const confirmPayment = async (req, res) => {
  try {
    const { transaction_id } = req.body;

    if (!transaction_id)
      return res.status(400).json({ error: "transaction_id required" });

    const payment = await sql`
      UPDATE payment
      SET status='success'
      WHERE transaction_id=${transaction_id}
      RETURNING *;
    `;

    if (payment.length === 0)
      return res.status(404).json({ error: "Invalid transaction" });

    // Also update order status
    await sql`
      UPDATE orders
      SET status='paid'
      WHERE order_id=${payment[0].order_id};
    `;

    res.status(200).json({
      message: "Payment successful",
      payment: payment[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  initiatePayment,
  confirmPayment,
};
