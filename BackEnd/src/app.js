const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const globalErrorHandler = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies (essential for CRUD)
app.use(express.json());

// A simple "Health Check" route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "Server is running!" });
});

// Mount the router
app.use("/api/tasks", taskRoutes);

app.use("/api/users", userRoutes);

// Global Error Handling Middleware (must be after all routes)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});
