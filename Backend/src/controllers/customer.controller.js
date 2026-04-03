const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(201).json(customer);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    return res.status(200).json(customers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomer, getCustomers };
