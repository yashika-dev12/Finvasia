const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  balance: { type: Number, default: 20500 },
  creditScore: { type: Number, default: 720 },
  savingsGoal: { target: Number, current: Number, name: String },
  expenses: [{ 
    category: String, 
    amount: Number, 
    date: { type: Date, default: Date.now } 
  }],
  investments: [{
    type: String, // Safe, Medium, Risky
    amount: Number,
    returns: Number
  }]
});

module.exports = mongoose.model('User', UserSchema);
