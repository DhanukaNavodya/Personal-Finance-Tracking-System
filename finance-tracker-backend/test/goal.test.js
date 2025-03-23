import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let userToken;
let goalId;

beforeAll(async () => {
  await User.deleteMany(); // Clear users
  await Goal.deleteMany(); // Clear goals

  // Create a test user
  const user = new User({
    username: 'TestUser',
    contactNumber: '0987654321',
    email: 'user@example.com',
    password: 'UserPass123',
    role: 'USER'
  });
  await user.save();
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Goal Routes', () => {
  // Test: Create a new goal
  it('should create a new goal', async () => {
    const response = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Buy a Car',
        description: 'Save money for a new car',
        targetAmount: 10000,
        currentAmount: 1000,
        deadline: '2025-12-31',
        savingsAllocationPercentage: 20
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Buy a Car');
    goalId = response.body._id; // Store goal ID for later tests
  });

  // Test: Get all goals for the user
  it('should get all user goals', async () => {
    const response = await request(app)
      .get('/api/goals')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test: Get goal by ID
  it('should get a specific goal by ID', async () => {
    const response = await request(app)
      .get(`/api/goals/${goalId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(goalId);
  });

  // Test: Update goal
  it('should update a goal', async () => {
    const response = await request(app)
      .put(`/api/goals/${goalId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Buy an Electric Car' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Buy an Electric Car');
  });

  // Test: Delete goal
  it('should delete a goal', async () => {
    const response = await request(app)
      .delete(`/api/goals/${goalId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Goal removed');
  });
});
