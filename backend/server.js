<<<<<<< HEAD

// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
  
// ---------------------//
app.get('/test', (req, res) => {
  res.send("TEST WORKING");
});

// MongoDB Connection (Use your Atlas URI here)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));


// 🔥 SEED ROUTE (TEST ROUTE)
app.get('/api/seed', async (req, res) => {
  console.log("🔥 /api/seed hit");

  try {
    const existingUser = await User.findOne();

    if (existingUser) {
      return res.send("User already exists");
    }

    const newUser = new User({
      balance: 20000,
      creditScore: 750,
      monthlyBudget: 15000,
      expenses: [
        { amount: 2000, category: "Food" },
        { amount: 1000, category: "Travel" }
      ],
      goals: [
        { current: 4000, target: 10000 }
      ],
      investments: {
        total: 5000,
        currentValue: 5500
      }
    });

    await newUser.save();

    res.send("✅ Dummy user created");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating user");
  }
});

// 🧩 LOGIC: PARALLEL DASHBOARD DATA
app.get('/api/dashboard', async (req, res) => {
  try {
    const user = await User.findOne(); // In a real app, use req.user.id
    if (!user) return res.status(404).send("User not found");

    // Parallelism: Calculate all metrics at once
    const totalSpent = user.expenses.reduce((sum, e) => sum + e.amount, 0);
    const goalPct = Math.round((user.goals[0].current / user.goals[0].target) * 100);
    
    // Smart Alert logic
    const alerts = [];
    if (totalSpent > user.monthlyBudget) alerts.push("⚠️ You crossed your ₹15,000 monthly budget.");
    if (user.balance > 10000) alerts.push("🔥 You saved more than last week!");

    res.json({ user, totalSpent, goalPct, alerts });
  } catch (err) { res.status(500).json(err); }
});

// 💸 LOGIC: SMART PAYMENTS + CREDIT SCORE SIMULATOR
app.post('/api/expense', async (req, res) => {
  const { amount, category } = req.body;
  const user = await User.findOne();

  // 1. Update Balance
  user.balance -= amount;
  user.expenses.push({ amount, category });

  // 2. Credit Score Simulation Logic
  if (amount > 5000) {
    user.creditScore -= 5; // Large spending drops score
  } else {
    user.creditScore += 2; // Consistent small spending builds score
  }

  // 3. Micro-Insurance Recommender Logic
  let rec = null;
  if (category === "Travel" && amount > 2000) {
    rec = "Suggest Travel Insurance for ₹99?";
  }

  await user.save();
  res.json({ user, recommendation: rec });
});

// 📈 LOGIC: BEGINNER INVESTING MODULE
app.post('/api/invest', async (req, res) => {
  const { amount, riskType } = req.body; // riskType: 'Safe', 'Medium', 'Risky'
  const user = await User.findOne();

  let returnRate = riskType === 'Risky' ? 0.15 : (riskType === 'Medium' ? 0.08 : 0.05);
  const profit = amount * returnRate;
  
  user.investments.total += amount;
  user.investments.currentValue += (amount + profit);
  user.balance -= amount;

  await user.save();
  res.json({ newTotal: user.investments.currentValue, profit });
});

// 🧠 LOGIC: AI ADVISORY (Rule-based)
app.post('/api/advice', async (req, res) => {
  const { question } = req.body;
  const user = await User.findOne();

  let advice = "";
  if (question.toLowerCase().includes('buy')) {
    advice = user.balance < 5000 ? "❌ Not recommended, keep an emergency fund." : "✅ You can afford it, but it might slow your goal progress.";
  } else {
    advice = "🤖 Based on your ₹20k balance, I suggest moving ₹2000 to 'Safe' investments.";
  }
  res.json({ advice });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
=======
import express from "express";
import aiRoute from "./routes/ai.js";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
// app.use(express.json());
app.use("/api", aiRoute);
require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");



app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use(express.static("public"));


// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.listen(5000, () => {
  console.log("FinTrack backend running at http://localhost:5000");
});
>>>>>>> 254daaaeef18c2fb2d1afb8e3fb51e2a8f77589d
