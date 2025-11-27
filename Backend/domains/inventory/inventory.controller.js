const sql = require("../../Database/config/postgres"); 

const addProduct = async (req, res) => {
  try {

    const { name, category_id, price, quantity, reorder_value } = req.body;

    if (!name || !category_id || !price || !quantity || !reorder_value) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = await sql`
      INSERT INTO products (name, category_id, price, quantity, reorder_value)
      VALUES (${name}, ${category_id}, ${price}, ${quantity}, ${reorder_value})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Product added successfully",
      product: product[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.body; 

    if (!product_id)
      return res.status(400).json({ error: "product_id required" });

    const deleted = await sql`
      DELETE FROM products
      WHERE product_id = ${product_id}
      RETURNING *;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted", product: deleted[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getProduct = async (req, res) => {
  try {
    const { product_id } = req.query;

    if (!product_id)
      return res.status(400).json({ error: "product_id required" });

    const product = await sql`
      SELECT * FROM products
      WHERE product_id = ${product_id}
      LIMIT 1;
    `;

    if (product.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC;
    `;

    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { product_id, name, category_id, price, quantity, reorder_value } =
      req.body;

    if (!product_id)
      return res.status(400).json({ error: "product_id required" });

    const updated = await sql`
      UPDATE products
      SET 
        name = ${name},
        category_id = ${category_id},
        price = ${price},
        quantity = ${quantity},
        reorder_value = ${reorder_value}
      WHERE product_id = ${product_id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updated[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  updateProduct,
};
