const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = new Expense({ title, amount, category });
    await expense.save();

    res.json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
};