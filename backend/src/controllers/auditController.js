const Audit = require('../models/Audit');
const { isValidObjectId } = require('mongoose');

// Create audit entry function remains unchanged
const createAuditEntry = async (transactionId, action, userId, before, after) => {
  try {
    if (!isValidObjectId(transactionId) || !isValidObjectId(userId)) {
      console.error('Invalid transactionId or userId for audit entry');
      return;
    }
    const auditEntry = new Audit({
      transactionId,
      action,
      userId,
      before,
      after
    });
    await auditEntry.save();
  } catch (error) {
    console.error('Error creating audit entry:', error);
  }
};

// GET /audit with filters and pagination
const getAuditEntries = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 50,
      transactionId,
      userId,
      action,
      from,
      to
    } = req.query;

    const query = {};

    if (transactionId) {
      if(!isValidObjectId(transactionId)) {
        return res.status(400).send({"message": "Invalid transaction ID."})
      }
      query.transactionId = transactionId;
    }
    if (userId) {
      if(!isValidObjectId(userId)) {
        return res.status(400).send({"message": "Invalid userId."})
      }
      query.userId = userId;
    }
    if (action && ['create', 'update', 'soft-delete', 'restore'].includes(action)) {
      query.action = action;
    }
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const totalCount = await Audit.countDocuments(query);

    const data = await Audit.find(query)
      .populate('userId', '_id name')
      .populate('transactionId')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      data,
      totalCount,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('Error fetching audit entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAuditEntry,
  getAuditEntries
};
