import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let adminToken;
let userToken;

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    process.env.NODE_ENV = 'test';
  }

  // Connect to test database
  const dbURL = process.env.MONGO_URI_TEST;
  await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

  await User.deleteMany(); // Clear existing users

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
  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe('Auth Routes', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'NewUser',
        contactNumber: '1122334455',
        email: 'newuser@example.com',
        password: 'NewPass123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'UserPass123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'WrongPass'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should get all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should not allow non-admins to get users', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Access denied, admin only');
  });

  it('should fetch user enrollment stats (admin only)', async () => {
    const res = await request(app)
      .get('/api/auth/enrollment-stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
