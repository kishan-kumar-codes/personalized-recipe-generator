import request from 'supertest';
import app from '../src/app'; // Adjust the path to your app
import mongoose from 'mongoose';

describe('API Tests', () => {
  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/testdb'; // Use your test database URI
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 200 for GET /api/items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new item with POST /api/items', async () => {
    const newItem = { name: 'Test Item', description: 'This is a test item' };
    const response = await request(app).post('/api/items').send(newItem);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItem.name);
  });

  it('should return 404 for non-existing route', async () => {
    const response = await request(app).get('/api/non-existing-route');
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid item creation', async () => {
    const invalidItem = { name: '' }; // Missing description
    const response = await request(app).post('/api/items').send(invalidItem);
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});