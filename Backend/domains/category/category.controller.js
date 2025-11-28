const sql = require("../../Database/config/postgres");

const addCategory = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).json({ message: "please provide category details" });

    const categories = Array.isArray(req.body) ? req.body : [req.body];

    const names = categories.map(c =>
      typeof c === "string" ? c : c.category_name
    );

    const validNames = names.filter(Boolean);

    if (validNames.length === 0)
      return res.status(400).json({ message: "No valid category names provided" });

    const uniqueNames = [...new Set(validNames)];

    const result = await sql`
      INSERT INTO categories (category_name)
      VALUES ${sql(uniqueNames.map(n => [n]))}
      ON CONFLICT (category_name) DO NOTHING
      RETURNING *;
    `;

    res.status(201).json({
      message: `${result.length} new category(s) added`,
      added: result,
      skipped: uniqueNames.length - result.length, // duplicates skipped
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.body;

    if (!category_id)
      return res.status(400).json({ error: "category_id is required" });

    const deleted = await sql`
      DELETE FROM categories
      WHERE category_id = ${category_id}
      RETURNING *;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ error: "Category not found" });

    res.status(200).json({
      message: "Category deleted successfully",
      category: deleted[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategoryDetails = async (req, res) => {
  try {
    const { category_id, category_name } = req.body;

    if (!category_id || !category_name)
      return res
        .status(400)
        .json({ error: "category_id and category_name required" });

    const updated = await sql`
      UPDATE categories
      SET category_name = ${category_name}
      WHERE category_id = ${category_id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ error: "Category not found" });

    res.status(200).json({
      message: "Category updated successfully",
      category: updated[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await sql`
      SELECT * FROM categories
      ORDER BY category_name ASC;
    `;
    if (categories.length === 0)
      res.status(200).json({
        message: "No category in the inventory",
      });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCategory,
  deleteCategory,
  updateCategoryDetails,
  getAllCategory,
};
