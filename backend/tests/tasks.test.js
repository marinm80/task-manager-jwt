const request = require('supertest');
const app = require('../server');
const prisma = require('../src/config/db');

let token;

beforeAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  await request(app).post('/api/auth/register').send({
    name: 'Task Tester',
    email: 'tasks@example.com',
    password: 'Password123',
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'tasks@example.com',
    password: 'Password123',
  });
  token = res.body.accessToken;
});

afterAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/tasks', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/tasks', () => {
  it('creates a task successfully', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', priority: 'HIGH' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });
});

describe('DELETE /api/tasks/:id', () => {
  it("returns 403 when user tries to delete another user's task", async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Other User',
      email: 'other@example.com',
      password: 'Password123',
    });
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'other@example.com',
      password: 'Password123',
    });
    const otherToken = loginRes.body.accessToken;
    const taskRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: "Other User's Task" });

    const res = await request(app)
      .delete(`/api/tasks/${taskRes.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
