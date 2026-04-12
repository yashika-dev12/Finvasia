// ============================================================
//  FinTrack — Simple Local Backend
//  SETUP:
//    1. Make sure Node.js is installed (nodejs.org)
//    2. Put this file in your project folder
//    3. Run:  npm init -y && npm install express cors
//    4. Run:  node server.js
//    5. Open: http://localhost:5000
// ============================================================

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
let user = {
  balance: 20000,
  expenses: [],
  savings: 0,
  creditScore: 650
};
let chatHistory = [];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// const express = require('express');
// const cors    = require('cors');
// const fs      = require('fs');
// const path    = require('path');
dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ── Serve your HTML files from the same folder ──
app.use(express.static("public"));

// ============================================================
//  DATABASE  (plain JSON files — no install needed)
// ============================================================

const DB_DIR = path.join(__dirname, 'db');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

// Read a collection
function readDB(name) {
  const file = path.join(DB_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Write a collection
function writeDB(name, data) {
  const file = path.join(DB_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Auto-increment ID helper
function nextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

// ── Seed default data if DB is empty ──
function seedIfEmpty() {
  if (!readDB('users').length) {
    writeDB('users', [
      { id: 1, name: 'Tanishqa', email: 'tanishqa@example.com', password: 'pass123',
        balance: 20500, creditScore: 720, monthlyBudget: 30000 }
    ]);
  }
  if (!readDB('expenses').length) {
    writeDB('expenses', [
      { id: 1, userId: 1, category: 'Food',     amount: 12000, month: 'June', year: 2025 },
      { id: 2, userId: 1, category: 'Travel',   amount: 7000,  month: 'June', year: 2025 },
      { id: 3, userId: 1, category: 'Shopping', amount: 5500,  month: 'June', year: 2025 }
    ]);
  }
  if (!readDB('transactions').length) {
    writeDB('transactions', [
      { id: 1, userId: 1, date: '12 Jun', description: 'Swiggy Order',   category: 'Food',     amount: 850,  status: 'done' },
      { id: 2, userId: 1, date: '11 Jun', description: 'Zomato x3',      category: 'Food',     amount: 1200, status: 'done' },
      { id: 3, userId: 1, date: '10 Jun', description: 'Ola Cab',         category: 'Travel',   amount: 320,  status: 'done' },
      { id: 4, userId: 1, date: '09 Jun', description: 'Amazon Order',    category: 'Shopping', amount: 2200, status: 'done' },
      { id: 5, userId: 1, date: '08 Jun', description: 'Grocery Store',   category: 'Food',     amount: 3400, status: 'done' },
      { id: 6, userId: 1, date: '07 Jun', description: 'Train Ticket',    category: 'Travel',   amount: 980,  status: 'done' },
      { id: 7, userId: 1, date: '06 Jun', description: 'Myntra',          category: 'Shopping', amount: 1800, status: 'done' },
      { id: 8, userId: 1, date: '05 Jun', description: 'Cafe Coffee Day', category: 'Food',     amount: 450,  status: 'done' }
    ]);
  }
  if (!readDB('goals').length) {
    writeDB('goals', [
      { id: 1, userId: 1, title: 'Emergency Fund', targetAmount: 100000, savedAmount: 35000 }
    ]);
  }
  if (!readDB('alerts').length) {
    writeDB('alerts', [
      { id: 1, userId: 1, icon: '⚠️', message: 'You crossed your ₹15,000 monthly budget.',   read: false },
      { id: 2, userId: 1, icon: '🔥', message: 'You saved more than last week!',               read: false }
    ]);
  }
  if (!readDB('group_members').length) {
    writeDB('group_members', [
      { id: 1, groupId: 1, name: 'Tanishqa',   initials: 'TA', role: 'admin',   relation: 'Self',   budget: 20000, spent: 12400 },
      { id: 2, groupId: 1, name: 'Ravi Sharma', initials: 'RS', role: 'member',  relation: 'Spouse', budget: 15000, spent: 9800  },
      { id: 3, groupId: 1, name: 'Aarav',       initials: 'AS', role: 'limited', relation: 'Child',  budget: 5000,  spent: 2100  },
      { id: 4, groupId: 1, name: 'Priya Devi',  initials: 'PD', role: 'limited', relation: 'Parent', budget: 8000,  spent: 7400  }
    ]);
  }
  console.log('✅  Database ready (db/ folder)');
}

seedIfEmpty();

// ============================================================
//  ROUTES
// ============================================================

// ── GET /api/dashboard ──────────────────────────────────────
// Used in index.html → initDashboard()
app.get('/api/dashboard', (req, res) => {
  const users    = readDB('users');
  const expenses = readDB('expenses');
  const goals    = readDB('goals');
  const alerts   = readDB('alerts');

  const user     = users[0];                           // single-user app
  const goal     = goals.find(g => g.userId === user.id) || {};
  const goalPct  = goal.targetAmount
    ? Math.round((goal.savedAmount / goal.targetAmount) * 100) : 0;
  const monthly  = expenses.filter(e => e.userId === user.id && e.month === 'June');
  const totalSpent = monthly.reduce((s, e) => s + e.amount, 0);

  res.json({
    user:       { balance: user.balance, creditScore: user.creditScore },
    goalPct,
    totalSpent,
    categoryBreakdown: monthly.map(e => ({ category: e.category, amount: e.amount })),
    alerts:     alerts.filter(a => a.userId === user.id && !a.read)
  });
});

// ── GET /api/expenses ────────────────────────────────────────
app.get('/api/expenses', (req, res) => {
  const { userId = 1, month, year } = req.query;
  let data = readDB('expenses').filter(e => e.userId === Number(userId));
  if (month) data = data.filter(e => e.month === month);
  if (year)  data = data.filter(e => e.year  === Number(year));
  res.json(data);
});

// ── POST /api/expense ─────────────────────────────────────────
// Used in index.html → addExpense()
app.post('/api/expense', (req, res) => {
  const { amount, category, userId = 1 } = req.body;
  if (!amount || !category) return res.status(400).json({ error: 'amount and category required' });

  const expenses = readDB('expenses');
  const existing = expenses.find(e => e.userId === userId && e.category === category && e.month === 'June');

  if (existing) {
    existing.amount += Number(amount);
  } else {
    expenses.push({ id: nextId(expenses), userId, category, amount: Number(amount), month: 'June', year: 2025 });
  }
  writeDB('expenses', expenses);

  // Simple recommendation logic
  const total = expenses.filter(e => e.userId === userId && e.month === 'June').reduce((s, e) => s + e.amount, 0);
  const user  = readDB('users').find(u => u.id === userId);
  let recommendation = null;
  if (total > user.monthlyBudget) recommendation = 'You have crossed your monthly budget. Consider cutting back on ' + category + '.';

  res.json({ success: true, recommendation });
});

// ── GET /api/transactions ────────────────────────────────────
app.get('/api/transactions', (req, res) => {
  const { userId = 1, category } = req.query;
  let data = readDB('transactions').filter(t => t.userId === Number(userId));
  if (category && category !== 'all') data = data.filter(t => t.category === category);
  res.json(data);
});

// ── POST /api/transaction ─────────────────────────────────────
app.post('/api/transaction', (req, res) => {
  const { description, category, amount, userId = 1 } = req.body;
  if (!description || !category || !amount) return res.status(400).json({ error: 'Missing fields' });

  const txns = readDB('transactions');
  const now  = new Date();
  const dateLabel = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const tx = { id: nextId(txns), userId, date: dateLabel, description, category, amount: Number(amount), status: 'done' };
  txns.unshift(tx);
  writeDB('transactions', txns);
  res.json({ success: true, transaction: tx });
});

// ── GET /api/alerts ──────────────────────────────────────────
app.get('/api/alerts', (req, res) => {
  const { userId = 1 } = req.query;
  res.json(readDB('alerts').filter(a => a.userId === Number(userId) && !a.read));
});

// ── PATCH /api/alerts/:id/read ───────────────────────────────
app.patch('/api/alerts/:id/read', (req, res) => {
  const alerts = readDB('alerts');
  const alert  = alerts.find(a => a.id === Number(req.params.id));
  if (!alert) return res.status(404).json({ error: 'Not found' });
  alert.read = true;
  writeDB('alerts', alerts);
  res.json({ success: true });
});

// ── GET /api/goals ───────────────────────────────────────────
app.get('/api/goals', (req, res) => {
  const { userId = 1 } = req.query;
  res.json(readDB('goals').filter(g => g.userId === Number(userId)));
});

// ── PATCH /api/goals/:id ─────────────────────────────────────
app.patch('/api/goals/:id', (req, res) => {
  const goals = readDB('goals');
  const goal  = goals.find(g => g.id === Number(req.params.id));
  if (!goal) return res.status(404).json({ error: 'Not found' });
  Object.assign(goal, req.body);
  writeDB('goals', goals);
  res.json({ success: true, goal });
});

// ── GET /api/group/members ───────────────────────────────────
app.get('/api/group/members', (req, res) => {
  res.json(readDB('group_members'));
});

// ── POST /api/group/members ──────────────────────────────────
// Used in groups.html → addMember()
app.post('/api/group/members', (req, res) => {
  const { name, role, relation, budget } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const members = readDB('group_members');
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const member = { id: nextId(members), groupId: 1, name, initials, role: role || 'member', relation: relation || 'Other', budget: Number(budget) || 5000, spent: 0 };
  members.push(member);
  writeDB('group_members', members);
  res.json({ success: true, member });
});

// ── DELETE /api/group/members/:id ────────────────────────────
app.delete('/api/group/members/:id', (req, res) => {
  let members = readDB('group_members');
  members = members.filter(m => m.id !== Number(req.params.id));
  writeDB('group_members', members);
  res.json({ success: true });
});

// ── POST /api/auth/login ─────────────────────────────────────
// Used in auth.html → handleLogin()
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = readDB('users').find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  // In production use JWT — this is a simple session token
  res.json({ success: true, token: `token_${user.id}`, userId: user.id, name: user.name });
});

// ── POST /api/auth/register ──────────────────────────────────
// Used in auth.html → handleSignup()
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const users = readDB('users');
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });

  const user = { id: nextId(users), name, email, password, balance: 0, creditScore: 0, monthlyBudget: 20000 };
  users.push(user);
  writeDB('users', users);
  res.json({ success: true, userId: user.id });
});

// ── POST /api/ai-advisor ─────────────────────────────────────
// Used in script.js → askBtn listener
app.post('/api/ai-advisor', (req, res) => {
  const { question = '' } = req.body;
  const q = question.toLowerCase();

  let verdict, advice;
  if (q.includes('fd') || q.includes('fixed') || q.includes('bond') || q.includes('save')) {
    verdict = 'Recommended';
    advice  = 'Fixed Deposits and bonds are low-risk. Consider a 6-month FD for your savings.';
  } else if (q.includes('gold') || q.includes('buy')) {
    verdict = 'Neutral';
    advice  = 'Gold can hedge inflation. Limit to 10–15% of your portfolio.';
  } else if (q.includes('invest') || q.includes('sip') || q.includes('mutual')) {
    verdict = 'Recommended';
    advice  = 'SIPs in index funds are great for long-term wealth. Start with ₹500/month.';
  } else {
    verdict = 'Not Recommended';
    advice  = 'Based on your ₹20k balance, build a 3-month emergency fund first before new investments.';
  }

  res.json({ verdict, advice });
});

// ── GET /api/reports/monthly ─────────────────────────────────
app.get('/api/reports/monthly', (req, res) => {
  const { userId = 1 } = req.query;
  const data = [
    { month: 'Jan', year: 2025, totalSpent: 18000 },
    { month: 'Feb', year: 2025, totalSpent: 19500 },
    { month: 'Mar', year: 2025, totalSpent: 20000 },
    { month: 'Apr', year: 2025, totalSpent: 21200 },
    { month: 'May', year: 2025, totalSpent: 22800 },
    { month: 'Jun', year: 2025, totalSpent: 24500 }
  ];
  res.json(data);
});

app.post("/api/ai-response", (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();

  let reply = "";

  if (msg.includes("invest")) {
    reply = `
📊 Investment Advice:
Investing is a great long-term strategy, but you should start carefully.

💡 Suggestion:
Begin with low-risk options like SIPs or index funds instead of directly buying high-volatility stocks.

⚠️ Risk Level: Medium

📌 Tip:
Always keep an emergency fund before investing.
    `;
  }

  else if (msg.includes("stock")) {
    reply = `
📈 Stock Market Advice:
Stocks can give high returns but are highly volatile in the short term.

💡 Suggestion:
Focus on long-term investing rather than daily trading.

⚠️ Risk Level: High

📌 Tip:
Research companies before investing.
    `;
  }

  else if (msg.includes("save")) {
    reply = `
💰 Savings Advice:
Saving money is the foundation of financial stability.

💡 Suggestion:
Try saving at least 20–30% of your monthly income.

⚠️ Risk Level: Low

📌 Tip:
Automate your savings if possible.
    `;
  }

  else {
    reply = `
🤖 Financial Assistant:
I can help you with investing, saving, budgeting, and financial planning.

💡 Try asking:
- Should I invest?
- How to save money?
- Is stock trading safe?
    `;
  }

  res.json({ reply });
});

// ============================================================
//  START
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🚀  FinTrack backend running at http://localhost:${PORT}`);
  console.log(`📁  Database files are in the  db/  folder`);
  console.log(`🌐  Open http://localhost:${PORT}/index.html to view your app\n`);
});



