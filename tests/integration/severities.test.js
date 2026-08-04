const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Severities integration', () => {
  it('lists severity criteria', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'analista@qa-review.ai', password: 'Senha123!' });

    const response = await request(app)
      .get('/api/severities')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.status).to.equal(200);
    expect(response.body.items).to.be.an('array');
  });
});
