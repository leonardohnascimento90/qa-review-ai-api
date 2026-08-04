const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Authentication integration', () => {
  it('logs in with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@qa-review.ai', password: 'Senha123!' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });
});
