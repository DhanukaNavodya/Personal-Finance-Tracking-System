import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let userToken;
let budgetId;
let expenseId;
let userId;

beforeAll(async () => {
  await User.deleteMany(); 
  await Budget.deleteMany(); 
  await Expense.deleteMany(); 

  // Create a normal user
  const user = new User({
    username: 'TestUser',
    contactNumber: '0987654321',
    email: 'user@example.com',
    password: 'UserPass123',
    role: 'USER'
  });
  await user.save();
  userId = user._id.toString(); // Store the user ID
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Create a budget for the user
  const budget = new Budget({
    userId,
    category: 'Groceries',
    amount: 500,
    spent: 100,
    endDate: new Date('2025-03-31')
  });
  await budget.save();
  budgetId = budget._id.toString(); // Store the budget ID
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Expense Routes', () => {
  it('should create a new expense', async () => {
    const response = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        budgetId,
        category: 'Groceries',
        amount: 50,
        description: 'Bought fruits',
        tags: ['food', 'fruit'],
        isRecurring: false
      });

    expect(response.status).toBe(201);  // Expecting a created status
    expect(response.body.message).toBe('Expense added successfully');
    expect(response.body.expense.category).toBe('Groceries');
    expect(response.body.expense.amount).toBe(50); // Check if the expense is saved correctly
    expenseId = response.body.expense._id.toString(); // Store expense ID
  });

  it('should get all expenses for the logged-in user', async () => {
    const response = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a single expense by ID', async () => {
    const response = await request(app)
      .get(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(expenseId);
  });

  it('should update an expense', async () => {
    const response = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        amount: 75,
        description: 'Updated expense description'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Expense updated successfully');
    expect(response.body.expense.amount).toBe(75);
  });

  it('should delete an expense', async () => {
    const response = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Expense deleted successfully');
  });
});
