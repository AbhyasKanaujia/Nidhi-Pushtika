const Transaction = require('../models/Transaction');

// Middleware to enforce fiscal-year lock for editors
// Admins bypass this lock
// Assumes fiscal year is calendar year for simplicity; adjust as needed
module.exports = async function fiscalLock(req, res, next) {
  try {
    const user = req.user;
    if (user.role === 'admin') {
      return next();
    }

    // For editors, check if transaction date is in current fiscal year
    // For POST, date is in req.body.date or today
    // For PATCH and DELETE, fetch transaction date from DB

    const currentYear = new Date().getFullYear();

    let transactionDate;

    if (req.method === 'POST') {
      transactionDate = req.body.date ? new Date(req.body.date) : new Date();
    } else {
      const transactionId = req.params.id;
      if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID required' });
      }
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      transactionDate = transaction.date;
    }

    const transactionYear = transactionDate.getFullYear();

    if (transactionYear !== currentYear) {
      return res.status(403).json({ message: 'Fiscal year lock: cannot modify transactions outside the current fiscal year' });
    }

    next();
  } catch (error) {
    console.error('Fiscal lock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
