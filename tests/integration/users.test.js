const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Users integration', () => {
  it('creates a user as admin', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@qa-review.ai', password: 'Senha123!' });

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        name: 'Novo Analista',
        email: 'novo@qa-review.ai',
        password: 'Senha123!',
        role: 'analyst',
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
  });
});
