const { expect } = require('chai');
const { evaluateSeverity } = require('../../src/services/severityService');

describe('Severity evaluation', () => {
  it('returns S1 for critical impact', () => {
    const severity = evaluateSeverity({
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
      hasDataLoss: true,
      hasFinancialRisk: true,
      hasSecurityRisk: true,
      scope: 'all_users',
    });

    expect(severity).to.equal('S1');
  });

  it('returns S2 for essential flow blocked without alternative', () => {
    const severity = evaluateSeverity({
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
      hasDataLoss: false,
      hasFinancialRisk: false,
      hasSecurityRisk: false,
      scope: 'some_users',
    });

    expect(severity).to.equal('S2');
  });
});
