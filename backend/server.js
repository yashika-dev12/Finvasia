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