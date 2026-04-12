const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses
} = require("../controllers/expenseController");

router.post("/expense", addExpense);
router.get("/expense", getExpenses);

module.exports = router;