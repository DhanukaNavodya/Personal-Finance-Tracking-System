import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

let adminToken;
let userToken;
let categoryId;

beforeAll(async () => {
  await User.deleteMany(); // Clear existing users
  await Category.deleteMany(); // Clear existing categories

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

  // Create a category for the admin to delete later
  const category = new Category({
    name: 'Groceries',
    createdBy: admin._id
  });
  await category.save();
  categoryId = category._id.toString(); // Store category ID for later use
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Category Routes', () => {
  // Test: Create a new category - Admin only
  it('should create a new category (Admin only)', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Utilities' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Category added successfully');
    expect(response.body.category.name).toBe('Utilities');
  });

  // Test: Create category as normal user - should fail
  it('should not allow a normal user to create a category', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Transportation' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied, admin only');
  });

  // Test: Get all categories - Admin or User
  it('should get all categories', async () => {
    const response = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${userToken}`); // Normal user can also view categories

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test: Delete a category - Admin only
  it('should delete a category (Admin only)', async () => {
    const response = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Category deleted successfully');
  });

  // Test: Delete category as normal user - should fail
  it('should not allow a normal user to delete a category', async () => {
    const response = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied, admin only');
  });
});

