const { expect } = require('chai');
const { calculateQualityScore } = require('../../src/services/qualityScoreService');

describe('Quality score calculation', () => {
  it('returns 100 when all required information is present', () => {
    const score = calculateQualityScore({
      description: 'Descrição detalhada do problema',
      stepsToReproduce: ['Passo 1', 'Passo 2'],
      expectedResult: 'Resultado esperado',
      actualResult: 'Resultado obtido',
      environment: 'Homologação',
      browser: 'Chrome',
      operatingSystem: 'Windows 11',
      frequency: 'Sempre',
      evidence: ['Print do erro'],
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
      hasDataLoss: false,
      hasFinancialRisk: false,
      hasSecurityRisk: false,
    });

    expect(score).to.equal(100);
  });

  it('penalizes missing fields', () => {
    const score = calculateQualityScore({
      description: 'Descrição curta',
      expectedResult: 'Resultado esperado',
      actualResult: 'Resultado obtido',
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
      hasDataLoss: false,
      hasFinancialRisk: false,
      hasSecurityRisk: false,
    });

    expect(score).to.be.lessThan(100);
    expect(score).to.be.at.least(0);
  });
});
