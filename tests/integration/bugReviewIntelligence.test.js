const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Bug review intelligence integration', () => {
  it('preserves user supplied steps and expected/actual results', async () => {
    const login = await request(app).post('/api/auth/login').send({ email: 'analista@qa-review.ai', password: 'Senha123!' });
    const response = await request(app)
      .post('/api/bug-reviews')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        title: 'Erro no checkout',
        description: 'O usuário não consegue concluir o fluxo porque o sistema trava.',
        affectedSystem: 'Checkout',
        stepsToReproduce: ['Acessar checkout', 'Finalizar compra'],
        expectedResult: 'O sistema deve concluir a compra e criar o pedido.',
        actualResult: 'A compra não é concluída e o pedido não é criado.',
        environment: 'Homologação',
        browser: 'Chrome',
        operatingSystem: 'Windows 11',
        device: 'Notebook',
        frequency: 'Sempre',
        blocksEssentialFunction: true,
        hasAlternativeFlow: true,
        hasDataLoss: false,
        hasFinancialRisk: false,
        hasSecurityRisk: false,
        scope: 'some_users',
        evidence: ['Print do erro'],
      });

    expect(response.status).to.equal(201);
    expect(response.body.expectedResult).to.equal('O sistema deve concluir a compra e criar o pedido.');
    expect(response.body.actualResult).to.equal('A compra não é concluída e o pedido não é criado.');
    expect(response.body.stepsToReproduce).to.deep.equal(['Acessar checkout', 'Finalizar compra']);
    expect(response.body.qualityScore).to.be.a('number');
    expect(response.body.confidence).to.be.a('number');
    expect(response.body.reasoning).to.be.an('array');
  });
});
