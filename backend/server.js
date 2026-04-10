const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 LOGIC: Credit Score & Smart Alerts
const updateFinanceLogic = (user) => {
  const totalSpent = user.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Credit Score Simulator: Saves money -> score up, Overspends -> score down
  if (totalSpent > 15000) user.creditScore -= 5;
  else user.creditScore += 2;

  // Smart Alert Logic
  let alerts = [];
  if (totalSpent > 15000) alerts.push("⚠️ You crossed your ₹15,000 budget!");
  if (user.balance > 10000) alerts.push("🔥 Great job! You have a healthy balance.");
  
  return { alerts, totalSpent };
};

// 🛣 API: Add Expense
app.post('/api/expense', async (req, res) => {
  const { amount, category } = req.body;
  const user = await User.findOne(); // Simplified for single user
  
  user.expenses.push({ amount, category });
  user.balance -= amount;
  
  const logic = updateFinanceLogic(user);
  await user.save();
  res.json({ user, alerts: logic.alerts });
});

// 🛣 API: AI Advisory (Rule-based)
app.post('/api/advice', async (req, res) => {
  const { question } = req.body;
  const user = await User.findOne();
  
  let advice = "";
  if (user.balance < 5000) advice = "❌ Not recommended, your balance is too low.";
  else if (question.includes('buy')) advice = "✅ You have enough savings, but consider your goal progress.";
  else advice = "🤖 Focus on reaching your goal: " + user.savingsGoal.name;

  res.json({ advice });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
