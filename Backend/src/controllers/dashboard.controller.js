const Product = require("../models/Product");
const Order = require("../models/Order");

const getStats = async (req, res) => {
  try {
    const [totalProducts, lowStockCount, totalOrders, salesSummary] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ quantity: { $lte: 5 } }),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      totalProducts,
      lowStockCount,
      totalOrders,
      totalSales: salesSummary[0]?.totalSales || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
