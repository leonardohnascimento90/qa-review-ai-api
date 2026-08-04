const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

let adminToken;
let analystToken;

describe('Bug review integration', () => {
  before(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@qa-review.ai', password: 'Senha123!' });
    adminToken = adminLogin.body.token;

    const analystLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'analista@qa-review.ai', password: 'Senha123!' });
    analystToken = analystLogin.body.token;
  });

  it('creates a bug review for an authenticated analyst', async () => {
    const response = await request(app)
      .post('/api/bug-reviews')
      .set('Authorization', `Bearer ${analystToken}`)
      .send({
        title: 'Erro no checkout',
        description: 'O checkout não permite finalizar a compra após inserir o cartão.',
        affectedSystem: 'Checkout',
        stepsToReproduce: ['Acessar a tela de checkout', 'Inserir dados válidos'],
        expectedResult: 'A compra deve ser finalizada.',
        actualResult: 'A tela permanece travada.',
        environment: 'Homologação',
        browser: 'Chrome',
        operatingSystem: 'Windows 11',
        device: 'Notebook',
        frequency: 'Sempre',
        blocksEssentialFunction: true,
        hasAlternativeFlow: false,
        hasDataLoss: false,
        hasFinancialRisk: false,
        hasSecurityRisk: false,
        scope: 'some_users',
        evidence: ['Print do erro'],
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    expect(response.body).to.have.property('severity');
  });

  it('lists own analyses for analyst', async () => {
    const response = await request(app)
      .get('/api/bug-reviews')
      .set('Authorization', `Bearer ${analystToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.items).to.be.an('array');
  });

  it('allows admin to list all analyses', async () => {
    const response = await request(app)
      .get('/api/bug-reviews')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.items).to.be.an('array');
  });
});
