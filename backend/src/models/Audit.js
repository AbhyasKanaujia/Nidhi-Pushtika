const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  action: {
    type: String,
    enum: ['create', 'update', 'soft-delete', 'restore'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  before: {
    type: Object,
    default: null
  },
  after: {
    type: Object,
    default: null
  }
});

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
