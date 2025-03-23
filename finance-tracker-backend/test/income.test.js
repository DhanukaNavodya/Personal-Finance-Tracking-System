import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Income from '../models/Income.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let adminToken;
let userToken;
let incomeId; // This will hold the ID of a created income
let userId;

beforeAll(async () => {
  await User.deleteMany(); // Clear existing users
  await Income.deleteMany(); // Clear existing incomes

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

  // Create an income entry for the user
  const income = new Income({
    userId: user._id, // Store the user ID
    source: 'Salary',
    amount: 5000,
    date: new Date('2025-03-10')
  });
  await income.save();
  incomeId = income._id.toString(); // Store the income ID for the update and delete tests
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Income Routes', () => {
  it('should create a new income entry (user only)', async () => {
    const res = await request(app)
      .post('/api/incomes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        source: 'Salary',
        amount: 5000,
        date: '2025-03-10'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Income created successfully');
    expect(res.body.income).toHaveProperty('_id'); // Ensure that the income has been created
    incomeId = res.body.income._id; // Store the ID for further tests
  });

  it('should update income entry by income ID (user only)', async () => {
    const res = await request(app)
      .put(`/api/incomes/${incomeId}`) // Use the stored income ID
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        source: 'Salary',
        amount: 10000,
        date: '2025-03-10'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Income updated successfully');
    expect(res.body.income.amount).toBe(10000); // Check if the amount has been updated
  });

  it('should not create income without authorization', async () => {
    const res = await request(app)
      .post('/api/incomes')
      .send({
        source: 'Salary',
        amount: 5000,
        date: '2025-03-10'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('No token, authorization denied');
  });

  it('should get all incomes', async () => {
    const res = await request(app)
      .get('/api/incomes')
      .set('Authorization', `Bearer ${userToken || adminToken}`); // Allow both user or admin
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should delete income entry by income ID (user only)', async () => {
    const res = await request(app)
      .delete(`/api/incomes/${incomeId}`) // Use the stored income ID
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Income deleted successfully');
  });

  it('should get total income by user ID', async () => {
    const res = await request(app)
      .get(`/api/incomes/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(typeof res.body.totalIncome).toBe('number');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
