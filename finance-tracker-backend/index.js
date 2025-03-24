// index.js
import express from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import categoryRoutes from "./routes/categoryRoutes.js";
import goalRoutes from "./routes/goalRoute.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import sendEmail from './routes/emailRoutes.js'
import smsRoutes from './routes/smsRoutes.js'
// Create an instance of the Express application
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Simple welcome route
app.get('/', (req, res) => {
  return res.status(234).send("Welcome");
});

// Check if we're in the test environment
const dbURL = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

// Connecting to the MongoDB database
mongoose.connect(dbURL)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      startServer();
    }
  })
  .catch((error) => {
    console.log(error);
  });

// Function to start the server
const startServer = () => {
  app.listen(PORT, () => {
    console.log('App connected to database');
    console.log(`App is listening on port: ${PORT}`);
  });
};



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/currency", currencyRoutes);
app.use("/api/email", currencyRoutes);

app.use('/api/SMS', smsRoutes);

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found. Please check the API endpoint." });
});


export default app;
