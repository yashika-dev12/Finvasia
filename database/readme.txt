# 💰 Fintrack — Smart Personal Finance Dashboard

> A full-stack personal finance web app built for the hackathon. Track expenses, monitor investments, manage group budgets, and get AI-powered financial advice — all in one sleek dark-themed dashboard.

---

## 📸 Pages

| Page | Description |
|------|-------------|
| **Dashboard** (`index.html`) | Balance, credit score, goal progress, investment growth chart, expense tracker, AI advisor |
| **Reports** (`reports.html`) | Monthly spending trends, category donut chart, transaction log with search & CSV export |
| **Groups** (`groups.html`) | Family/roommate budget manager with member roles, activity feed, and invite system |
| **About** (`about.html`) | Team info, features, tech stack, and company timeline |
| **Login** (`login.html`) | Sign up / log in with password strength meter and form validation |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A terminal (Command Prompt, PowerShell, or Mac/Linux terminal)

### 1. Clone / unzip the project

```bash
unzip Finvasia-main.zip
cd Finvasia-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root folder (or edit the existing one):

```env
OPENAI_API_KEY=your_openai_key_here
MONGO_URI=your_mongodb_uri_here
PORT=5000
```

> **Note:** The app works without these — it falls back to local JSON files for the database and keyword-based responses for the AI advisor.

### 4. Run the server

```bash
node server.js
```

### 5. Open the app

Go to **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## 🗂️ Project Structure

```
Finvasia-main/
├── frontend/               # All HTML pages
│   ├── index.html          # Main dashboard
│   ├── reports.html        # Reports & analytics
│   ├── groups.html         # Group budget manager
│   ├── about.html          # About page
│   ├── login.html          # Auth page
│   └── responsive.css      # Shared mobile styles
│
├── db/                     # JSON file database (auto-created)
│   ├── users.json
│   ├── expenses.json
│   ├── transactions.json
│   ├── goals.json
│   ├── alerts.json
│   └── group_members.json
│
├── backend/                # Alternative backend with MongoDB + OpenAI
│   ├── server.js
│   ├── routes/ai.js        # OpenAI GPT-4o-mini route
│   ├── controllers/
│   ├── models/
│   └── config/db.js
│
├── public/                 # Static files served by Express
├── server.js               # Main backend entry point ← run this
├── package.json
└── .env                    # API keys (do not commit this!)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | User balance, credit score, goal %, alerts |
| `GET` | `/api/expenses` | Get expenses (filter by month/year) |
| `POST` | `/api/expense` | Add a new expense |
| `GET` | `/api/transactions` | Transaction log (filter by category) |
| `POST` | `/api/transaction` | Add a new transaction |
| `GET` | `/api/alerts` | Unread smart alerts |
| `PATCH` | `/api/alerts/:id/read` | Mark alert as read |
| `GET` | `/api/goals` | Savings goals |
| `PATCH` | `/api/goals/:id` | Update goal progress |
| `GET` | `/api/group/members` | Group budget members |
| `POST` | `/api/group/members` | Add a member to group |
| `DELETE` | `/api/group/members/:id` | Remove a member |
| `POST` | `/api/auth/login` | Login with email + password |
| `POST` | `/api/auth/register` | Register new account |
| `POST` | `/api/ai-advisor` | AI financial advice (keyword-based) |
| `POST` | `/api/ai-response` | AI response via OpenAI (if key set) |
| `GET` | `/api/reports/monthly` | 6-month spending trend data |

---

## 🗄️ Database

The app uses **plain JSON files** stored in the `db/` folder — no database setup required. Data persists across server restarts automatically.

Default login credentials (seeded on first run):
```
Email:    tanishqa@example.com
Password: pass123
```
---

## 🤖 AI Advisor

The AI advisor on the dashboard answers financial questions in two modes:

- **Without OpenAI key** — keyword-based responses covering topics like investing, saving, SIPs, FDs, and gold
- **With OpenAI key** — full GPT-4o-mini responses via `POST /api/ai-response`

To enable real AI, add `OPENAI_API_KEY=your_key` to `.env`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Charts | [Chart.js 4.4](https://www.chartjs.org/) |
| Fonts | Syne + DM Sans (Google Fonts) |
| Backend | Node.js + Express 5 |
| Database | JSON files (default) / MongoDB + Mongoose (optional) |
| AI | OpenAI GPT-4o-mini (optional) |
| Responsive | Custom CSS with mobile bottom nav |

---

## 📱 Responsive Design

The app is fully mobile-responsive:
- Sidebar collapses into a **bottom navigation bar** on mobile
- All grid layouts stack to single column on screens under 600px
- Charts, tables, and cards all adapt to smaller screens

---

## 👥 Team

Built at the hackathon by **Tanishqa, Yashika, Tanvee & Shagun**.

---

## 📄 License

Built for hackathon purposes. All rights reserved by the Finvasia team.
