const sql = require("../../Database/config/postgres");
const addProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Please provide product details",
      });
    }

    const products = Array.isArray(req.body) ? req.body : [req.body];

    if (products.length === 0) {
      return res
        .status(400)
        .json({ error: "Empty product list is not allowed" });
    }

    for (const p of products) {
      if (
        !p.name ||
        !p.category_id ||
        p.price == null ||
        p.quantity == null ||
        p.reorder_value == null
      ) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      if (p.price <= 0)
        return res.status(400).json({ error: "Price must be greater than 0" });

      if (p.quantity <= 0)
        return res
          .status(400)
          .json({ error: "Quantity must be greater than 0" });

      if (p.reorder_value <= 0)
        return res
          .status(400)
          .json({ error: "Reorder value must be greater than 0" });
    }

    for (const p of products) {
      const exists = await sql`
        SELECT 1 FROM products
        WHERE name = ${p.name} AND category_id = ${p.category_id}
        LIMIT 1;
      `;

      if (exists.length > 0) {
        return res.status(409).json({
          error: `Duplicate product "${p.name}" in category ${p.category_id}`,
        });
      }
    }

    const result = await sql`
      INSERT INTO products (name, category_id, price, quantity, reorder_value)
      VALUES ${sql(
        products.map((p) => [
          p.name,
          p.category_id,
          p.price,
          p.quantity,
          p.reorder_value,
        ])
      )}
      RETURNING *;
    `;

    res.status(201).json({
      message: `${result.length} product(s) added successfully`,
      products: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product_id  = req.params.id;

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
    const product_id = req.params.id;

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

const totalProducts = async (req, res) => {
  try {
    const result = await sql`
      SELECT COUNT(*) AS total_products, SUM(quantity) AS total_stock
      FROM products;
    `;

    res.status(200).json({
      total_products: result[0].total_products || 0,
      total_stock: result[0].total_stock || 0,
    });
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
  totalProducts,
};
