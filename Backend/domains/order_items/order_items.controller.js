const sql = require("../../Database/config/postgres");


const addOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price_per_unit } = req.body;

   
    if (!order_id || !product_id || !quantity || !price_per_unit) {
      return res.status(400).json({
        error: "order_id, product_id, quantity, price_per_unit are required"
      });
    }

    if (quantity <= 0)
      return res.status(400).json({ error: "quantity must be > 0" });

    if (price_per_unit <= 0)
      return res.status(400).json({ error: "price_per_unit must be > 0" });

    
    const orderExists = await sql`
      SELECT 1 FROM orders WHERE order_id = ${order_id} LIMIT 1;
    `;
    if (orderExists.length === 0)
      return res.status(404).json({ error: "Order does not exist" });

  
    const productExists = await sql`
      SELECT 1 FROM products WHERE product_id = ${product_id} LIMIT 1;
    `;
    if (productExists.length === 0)
      return res.status(404).json({ error: "Product does not exist" });


    const item = await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
      VALUES (${order_id}, ${product_id}, ${quantity}, ${price_per_unit})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Order item added successfully",
      item: item[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getOrderItems = async (req, res) => {
  try {
    const { order_id } = req.query;
    const user_id = req.user.sub;

    if (!order_id)
      return res.status(400).json({ error: "order_id is required" });

   
    const order = await sql`
      SELECT * FROM orders 
      WHERE order_id = ${order_id} AND user_id = ${user_id}
      LIMIT 1;
    `;

    if (order.length === 0)
      return res.status(404).json({ error: "Order not found or unauthorized" });


    const items = await sql`
      SELECT 
        order_items.item_id,
        order_items.product_id,
        order_items.quantity,
        order_items.price_per_unit,
        order_items.sub_total,
        products.name
      FROM order_items
      JOIN products ON order_items.product_id = products.product_id
      WHERE order_items.order_id = ${order_id};
    `;

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderItem = async (req, res) => {
  try {
    const { item_id, quantity, price_per_unit } = req.body;

    if (!item_id)
      return res.status(400).json({ error: "item_id is required" });

    if (quantity !== undefined && quantity <= 0)
      return res.status(400).json({ error: "quantity must be > 0" });

    if (price_per_unit !== undefined && price_per_unit <= 0)
      return res.status(400).json({ error: "price_per_unit must be > 0" });

    const updated = await sql`
      UPDATE order_items
      SET 
        quantity = COALESCE(${quantity}, quantity),
        price_per_unit = COALESCE(${price_per_unit}, price_per_unit)
      WHERE item_id = ${item_id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ error: "Order item not found" });

    res.status(200).json({
      message: "Order item updated successfully",
      item: updated[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    const { item_id } = req.body;

    if (!item_id)
      return res.status(400).json({ error: "item_id is required" });

    const deleted = await sql`
      DELETE FROM order_items
      WHERE item_id = ${item_id}
      RETURNING *;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ error: "Order item not found" });

    res.status(200).json({
      message: "Order item deleted",
      item: deleted[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
};
