import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Currency from '../models/Currency.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let userToken;

beforeAll(async () => {
  await User.deleteMany(); // Clear users
  await Currency.deleteMany(); // Clear currency preferences

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

describe('Currency Routes', () => {
  // Test: Set user currency
  it('should set user currency preference', async () => {
    const response = await request(app)
      .post('/api/currency/set')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ baseCurrency: 'USD' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Currency preference updated');
    expect(response.body.baseCurrency).toBe('USD');
  });

  // Test: Get user currency preference
  it('should get user currency preference', async () => {
    const response = await request(app)
      .get('/api/currency/get')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.baseCurrency).toBe('USD');
  });

  // Test: Update user currency preference
  it('should update user currency preference', async () => {
    const response = await request(app)
      .post('/api/currency/set')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ baseCurrency: 'EUR' });

    expect(response.status).toBe(200);
    expect(response.body.baseCurrency).toBe('EUR');
  });

  // Test: Get updated user currency preference
  it('should get updated user currency preference', async () => {
    const response = await request(app)
      .get('/api/currency/get')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.baseCurrency).toBe('EUR');
  });
});
