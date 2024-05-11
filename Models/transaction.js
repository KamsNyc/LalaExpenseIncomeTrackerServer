const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  selectedBusiness: {
    type: String
  },
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Receipt'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
    required: true
  },
  ImageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
