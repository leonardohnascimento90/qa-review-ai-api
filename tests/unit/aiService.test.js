const { expect } = require('chai');
const { analyzeBugWithAi } = require('../../src/services/aiService');

describe('AI service mock mode', () => {
  it('returns a predictable analysis in mock mode', async () => {
    const analysis = await analyzeBugWithAi({
      description: 'O checkout não permite finalizar a compra após inserir o cartão.',
      affectedSystem: 'Checkout',
      scope: 'some_users',
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
      hasDataLoss: false,
      hasFinancialRisk: false,
      hasSecurityRisk: false,
    });

    expect(analysis).to.have.property('severity');
    expect(analysis.severity).to.be.oneOf(['S1', 'S2', 'S3', 'S4']);
    expect(analysis).to.have.property('qualityScore');
  });
});
