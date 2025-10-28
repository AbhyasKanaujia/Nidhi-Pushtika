const Transaction = require('../models/Transaction');
const { createAuditEntry } = require('./auditController');
const mongoose = require('mongoose');
const {isValidObjectId} = require("mongoose");

// GET /transactions
// Supports filtering, pagination, role-based visibility
const getTransactions = async (req, res) => {
  try {
    const user = req.user;
    const {
      page = 1,
      pageSize = 50,
      from,
      to,
      type,
      search,
      includeDeleted
    } = req.query;

    const query = {};

    // Date range filter
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    // Type filter
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    // Search filter (note or amount)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { note: searchRegex },
        { amount: isNaN(Number(search)) ? undefined : Number(search) }
      ].filter(cond => cond !== undefined);
    }

    // Deleted filter
    if (user.role === 'admin') {
      if (includeDeleted === 'true') {
        // include deleted
      } else {
        query.deleted = false;
      }
    } else {
      // editors and readers cannot see deleted
      query.deleted = false;
    }

    // Editors cannot see deleted
    if (user.role === 'editor' || user.role === 'reader') {
      query.deleted = false;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // Query total count
    const totalCount = await Transaction.countDocuments(query);

    // Query data with sorting by date desc
    const data = await Transaction.find(query)
      .populate('createdBy', '_id name')
      .populate('updatedBy', '_id name')
      .sort({ date: -1 })
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
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /transactions
const createTransaction = async (req, res) => {
  try {
    const user = req.user;
    const { type, amount, note = '', date } = req.body || {};

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const transactionDate = date ? new Date(date) : new Date();

    const newTransaction = new Transaction({
      type,
      amount,
      note,
      date: transactionDate,
      createdBy: user.id,
      updatedBy: user.id,
      deleted: false
    });

    await newTransaction.save();

    // Audit log
    await createAuditEntry(newTransaction._id, 'create', user.id, null, newTransaction.toObject());

    const populatedTransaction = await Transaction.findById(newTransaction._id)
      .populate('createdBy', '_id name')
      .populate('updatedBy', '_id name')
      .lean();

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const user = req.user;
    const transactionId = req.params.id;
    const updateFields = {};

    const allowedFields = ['type', 'amount', 'note', 'date'];
    if (req.body && typeof req.body === 'object') {
      for (const key of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          updateFields[key] = req.body[key];
        }
      }
    }

    if ('type' in updateFields && !['income', 'expense'].includes(updateFields.type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
    if ('amount' in updateFields) {
      if (typeof updateFields.amount !== 'number' || updateFields.amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }
    }
    if ('date' in updateFields) {
      updateFields.date = new Date(updateFields.date);
    }

    if(!isValidObjectId(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction id' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.deleted) {
      return res.status(400).json({ message: 'Cannot update a soft-deleted transaction without restore' });
    }

    const before = transaction.toObject();

    Object.assign(transaction, updateFields);
    transaction.updatedBy = user.id;
    transaction.updatedAt = new Date();

    await transaction.save();

    const after = transaction.toObject();

    // Audit log
    await createAuditEntry(transaction._id, 'update', user.id, before, after);

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('updatedBy', '_id name')
      .lean();

    res.json(populatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /transactions/:id (soft delete)
const softDeleteTransaction = async (req, res) => {
  try {
    const user = req.user;
    const transactionId = req.params.id;

    if(!isValidObjectId(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction id' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.deleted) {
      return res.status(400).json({ message: 'Transaction already deleted' });
    }

    const before = transaction.toObject();

    transaction.deleted = true;
    transaction.deletedBy = user.id;
    transaction.deletedAt = new Date();
    transaction.updatedBy = user.id;
    transaction.updatedAt = new Date();

    await transaction.save();

    const after = transaction.toObject();

    // Audit log
    await createAuditEntry(transaction._id, 'soft-delete', user.id, before, after);

    res.json({ success: true });
  } catch (error) {
    console.error('Error soft deleting transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /transactions/:id/restore (admin only)
const restoreTransaction = async (req, res) => {
  try {
    const user = req.user;
    const transactionId = req.params.id;

    if (!isValidObjectId(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (!transaction.deleted) {
      return res.status(400).json({ message: 'Transaction is not deleted' });
    }

    const before = transaction.toObject();

    transaction.deleted = false;
    transaction.deletedBy = null;
    transaction.deletedAt = null;
    transaction.updatedBy = user.id;
    transaction.updatedAt = new Date();

    await transaction.save();

    const after = transaction.toObject();

    // Audit log
    await createAuditEntry(transaction._id, 'restore', user.id, before, after);

    res.json({ success: true });
  } catch (error) {
    console.error('Error restoring transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  softDeleteTransaction,
  restoreTransaction
};
