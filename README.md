
# Database Setup 🗄

This project uses MongoDB Atlas.

## Setup Steps:

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Create a `.env` file inside `/backend`

Example:

MONGO_URI=your_mongodb_connection_string

## Features Stored:
- User Balance
- Expenses
- Goals
- Investments

## API Endpoints:
- /api/dashboard
- /api/expense
- /api/invest
- /api/advice

## Seed Data:
Visit:
http://localhost:5000/api/seed

to create a dummy user.

## 🤖 Trained AI Model
As part of our AI Advisor feature, we trained a custom machine learning model to predict user financial risk levels. 
You can view and download our trained `.pkl` model file here:

https://drive.google.com/file/d/1G8EFyYQOZHNfGIdi7NQ6opnpK5N9FzxK/view?usp=sharing