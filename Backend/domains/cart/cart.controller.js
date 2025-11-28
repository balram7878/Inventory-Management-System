const sql = require("../../Database/config/postgres");


const addToCart = async (req, res) => {
  try {
    const user_id = req.user.sub;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity)
      return res.status(400).json({ error: "product_id and quantity required" });

    const exists = await sql`
      SELECT * FROM cart
      WHERE user_id = ${user_id} AND product_id = ${product_id};
    `;

    if (exists.length > 0) {
      const updated = await sql`
        UPDATE cart
        SET quantity = quantity + ${quantity}
        WHERE user_id = ${user_id} AND product_id = ${product_id}
        RETURNING *;
      `;

      return res.status(200).json({
        message: "Cart updated (added to existing quantity)",
        cart_item: updated[0],
      });
    }

  
    const cartItem = await sql`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (${user_id}, ${product_id}, ${quantity})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Item added to cart",
      cart_item: cartItem[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const user_id = req.user.sub;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity)
      return res.status(400).json({ error: "product_id and quantity required" });

    const updated = await sql`
      UPDATE cart
      SET quantity = ${quantity}
      WHERE user_id = ${user_id} AND product_id = ${product_id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ error: "Cart item not found" });

    res.status(200).json({
      message: "Cart item updated",
      cart_item: updated[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const user_id = req.user.sub;
    const { product_id } = req.body;

    if (!product_id)
      return res.status(400).json({ error: "product_id required" });

    const deleted = await sql`
      DELETE FROM cart
      WHERE user_id = ${user_id} AND product_id = ${product_id}
      RETURNING *;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ error: "Item not found in cart" });

    res.status(200).json({
      message: "Item removed from cart",
      item: deleted[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCart = async (req, res) => {
  try {
    const user_id = req.user.sub;

    const items = await sql`
      SELECT 
        cart.cart_id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        (products.price * cart.quantity) AS sub_total
      FROM cart
      JOIN products ON cart.product_id = products.product_id
      WHERE cart.user_id = ${user_id}
      ORDER BY cart.added_at DESC;
    `;

    res.status(200).json(items);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const clearCart = async (req, res) => {
  try {
    const user_id = req.user.sub;

    await sql`
      DELETE FROM cart
      WHERE user_id = ${user_id};
    `;

    res.status(200).json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart
};
