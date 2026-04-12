// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  balance: { type: Number, default: 20500 },
  creditScore: { type: Number, default: 720 },
  monthlyBudget: { type: Number, default: 15000 },
  goals: [{
    name: { type: String, default: "iPhone" },
    target: { type: Number, default: 80000 },
    current: { type: Number, default: 28000 }
  }],
  expenses: [{
    category: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  }],
  investments: {
    total: { type: Number, default: 1000 },
    currentValue: { type: Number, default: 1150 }
  }
});
module.exports = mongoose.model('User', UserSchema);
