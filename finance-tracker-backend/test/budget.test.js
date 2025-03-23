import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Budget from '../models/Budget.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let adminToken;
let userToken;
let budgetId;
let userId;

beforeAll(async () => {
  await User.deleteMany(); // Clear existing users
  await Budget.deleteMany(); // Clear existing budgets

  // Create an admin user
  const admin = new User({
    username: 'AdminUser',
    contactNumber: '1234567890',
    email: 'admin@example.com',
    password: 'AdminPass123',
    role: 'ADMIN'
  });
  await admin.save();
  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

describe('Budget Routes', () => {
  it('should create a new budget', async () => {
    const response = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        category: 'Utilities',
        amount: 300,
        endDate: new Date('2025-04-30')
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Budget created successfully');
    expect(response.body.budget.category).toBe('Utilities');
  });

  

  it('should update a budget', async () => {
    const response = await request(app)
      .put(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        spent: 200
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Budget updated successfully');
    expect(response.body.budget.spent).toBe(200);
  });

  it('should delete a budget', async () => {
    const response = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Budget deleted successfully');
  });

  // it('should check budget status for a category', async () => {
  //   const response = await request(app)
  //     .get('/api/budgets/status/Groceries')
  //     .set('Authorization', `Bearer ${userToken}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.status).toBe('Warning: Nearing budget limit');
  // });

  // it('should get a budget by ID', async () => {
  //   const response = await request(app)
  //     .get(`/api/budgets/${budgetId}`)
  //     .set('Authorization', `Bearer ${userToken}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body._id).toBe(budgetId);
  // });

  // it('should get current budget plan for today', async () => {
  //   const response = await request(app)
  //     .get('/api/budgets/date/current')
  //     .set('Authorization', `Bearer ${userToken}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.budgets).toBeInstanceOf(Array);
  //   expect(response.body.budgets.length).toBeGreaterThan(0);
  // });
});

afterAll(async () => {
  await mongoose.connection.close();
});
