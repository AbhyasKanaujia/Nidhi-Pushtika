const Transaction = require('../models/Transaction');

// GET /reports/summary
// Returns totalIncome, totalExpense, and balance for a given date range or overall
const getSummaryReport = async (req, res) => {
  try {
    const { from, to } = req.query || {};

    const match = {
      deleted: false
    };

    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from);
      if (to) match.date.$lte = new Date(to);
    }

    const aggregation = [
      { $match: match },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ];

    const results = await Transaction.aggregate(aggregation);

    let totalIncome = 0;
    let totalExpense = 0;

    results.forEach(r => {
      if (r._id === 'income') {
        totalIncome = r.totalAmount;
      } else if (r._id === 'expense') {
        totalExpense = r.totalAmount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance
    });
  } catch (error) {
    console.error('Error fetching summary report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSummaryReport
};
