const Supplier = require("../models/Supplier");

const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    return res.status(201).json(supplier);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return res.status(200).json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createSupplier, getSuppliers };
