=======
Fintrack: A smart finance app for Gen Z in India to track expenses, simulate credit scores, explore investments, and get financial advice.

Built by Yashika, Tanishqa, Tanvee & Shagun.

🚀 Features
💸 Expense Tracker
💳 Credit Score Simulator
📈 Investment Simulation
🧠 Smart Advisory
🎯 Goal-Based Savings

🛠 Tech Stack: 
HTML CSS JavaScript Node.js Express MongoDB

# ⚙️ Backend Setup

### 🔄 How it Works

1. **Data Capture**
   The API captures transaction amounts instantly when the user clicks **"Add"**.

2. **Classification**
   Transactions are categorized as:

   * ➕ Positive → Income / Savings
   * ➖ Negative → Expenses

3. **Balance Update**
   The system retrieves `current_balance` from the database, applies the transaction, and updates it in real time.

4. **Live Monitoring**
   AI continuously scans transaction patterns to detect unusual spending or saving trends.

5. **AI Insights**
   Users can ask questions like *"How can I save money?"* and receive personalized financial advice based on their data.

---

# 🗄 Database Setup

This project uses **MongoDB Atlas**.

## 🚀 Setup Steps

1. Create a MongoDB Atlas cluster
2. Copy your connection string
3. Navigate to `/backend` folder
4. Create a `.env` file
5. Add your credentials:

```
MONGO_URI=your_mongodb_connection_string
API_KEY=your_api_key_here
PORT=5000
```

## 📦 Features Stored in Database

* User Balance
* Expenses
* Financial Goals
* Investments

---

## 🔗 API Endpoints

* `/api/dashboard`
* `/api/expense`
* `/api/invest`
* `/api/advice`

---

## 🌱 Seed Data

To generate dummy data, visit:

```
http://localhost:5000/api/seed
```

---

# 🤖 AI Model

As part of the AI Advisor feature, we trained a custom machine learning model to predict financial risk levels.

📥 **Download Model:**
https://drive.google.com/file/d/1G8EFyYQOZHNfGIdi7NQ6opnpK5N9FzxK/view?usp=sharing

### 📌 Instructions

1. Download the `.pkl` file
2. Create a folder named `/models` inside backend
3. Place the file inside `/models`

---

## 🤖 Chatbot API Setup (Groq)

This project uses Groq API for AI chatbot responses.

### Steps:
1. Go to https://console.groq.com/
2. Create an account
3. Generate an API key
4. Add it to your .env file:

GROQ_API_KEY=your_api_key_here
---

## ▶️ Run the Chatbot Server

Navigate to backend folder and run:

```
node chatbot-server.js
```

---

# 🛠 Full Project Setup (Quick Start)

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```
3. Create `.env` file using `.env.example`
4. Add your MongoDB + API credentials
5. Start backend:

   ```
   node server.js
   ```
6. Run chatbot (optional):

   ```
   node chatbot-server.js
   ```
7. Open frontend in browser 🎉

---
# ✨ Future Improvements

* Advanced AI financial forecasting
* Credit score tracking
* Gamified savings challenges
* Investment portfolio optimization
