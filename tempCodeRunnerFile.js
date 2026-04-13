// ============================================================
//  FinTrack AI Chatbot — Backend Server
//
//  SETUP:
//    1. npm install express cors node-fetch
//    2. Get a free API key from console.anthropic.com
//    3. Replace YOUR_ANTHROPIC_API_KEY below (or set env var)
//    4. node chatbot-server.js
//    5. Open http://localhost:5001/chatbot.html
// ============================================================
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Simple JSON file chat history ──
const HISTORY_FILE = path.join(__dirname, 'chat_history.json');
function loadHistory()  { return fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : []; }
function saveHistory(h) { fs.writeFileSync(HISTORY_FILE, JSON.stringify(h, null, 2)); }

// ── FinTrack system prompt ──
const SYSTEM_PROMPT = `You are FinBot, the AI financial advisor built into FinTrack — a personal finance dashboard for Indian users.

You help users with:
- Understanding their spending across Food, Travel, and Shopping categories
- Budget management and savings advice
- Investment guidance (FDs, SIPs, gold, mutual funds)
- Credit score improvement
- Goal planning (emergency fund, travel, gadgets)
- Reading and interpreting their financial reports
- Group budget management for family/roommates

Context about the user's current data:
- Current balance: ₹20,500
- Credit score: 720 (Good)
- Monthly budget: ₹30,000
- This month's spending: Food ₹12,000 | Travel ₹7,000 | Shopping ₹5,500
- Savings goal progress: 35% (Emergency Fund of ₹1,00,000)
- Investment: ₹1,000 invested → now ₹1,150 (15% return)

Personality:
- Friendly, concise, and practical
- Use ₹ for currency amounts, not $
- Give specific actionable tips
- Keep responses short (2–4 sentences usually)
- Use occasional emojis to stay approachable
- If asked about something outside finance, gently redirect to financial topics
- Never say you're Claude or made by Anthropic — you are FinBot by FinTrack`;

// ============================================================
//  POST /api/chat  — main chat endpoint
// ============================================================
app.post('/api/chat', async (req, res) => {
  const { message, sessionId = 'default' } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

  // Load history for this session
  const allHistory = loadHistory();
  const session    = allHistory.filter(h => h.sessionId === sessionId);
  const messages   = session.map(h => ({ role: h.role, content: h.content }));

  // Add new user message
  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system:     SYSTEM_PROMPT,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic error:', err);
      return res.status(500).json({ error: err.error?.message || 'API error' });
    }

    const data  = await response.json();
    const reply = data.content[0].text;

    // Save to history
    allHistory.push({ sessionId, role: 'user',      content: message, ts: Date.now() });
    allHistory.push({ sessionId, role: 'assistant', content: reply,   ts: Date.now() });
    // Keep last 200 messages total
    if (allHistory.length > 200) allHistory.splice(0, allHistory.length - 200);
    saveHistory(allHistory);

    res.json({ reply, sessionId });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error. Is the API key set?' });
  }
});

// ── GET /api/chat/history ──
app.get('/api/chat/history', (req, res) => {
  const { sessionId = 'default' } = req.query;
  const history = loadHistory().filter(h => h.sessionId === sessionId);
  res.json(history);
});

// ── DELETE /api/chat/history ──
app.delete('/api/chat/history', (req, res) => {
  const { sessionId = 'default' } = req.query;
  const history = loadHistory().filter(h => h.sessionId !== sessionId);
  saveHistory(history);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`\n🤖  FinBot chatbot server → http://localhost:${PORT}`);
  console.log(`💬  Open http://localhost:${PORT}/chatbot.html\n`);
  if (ANTHROPIC_API_KEY === 'YOUR_ANTHROPIC_API_KEY') {
    console.warn('⚠️   Set your ANTHROPIC_API_KEY in chatbot-server.js or as an env variable!\n');
  }
});