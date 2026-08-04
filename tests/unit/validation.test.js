const { expect } = require('chai');
const { validateBugReviewPayload } = require('../../src/validators/bugReviewValidator');

describe('Bug review validation', () => {
  it('rejects short descriptions and invalid scope', () => {
    const errors = validateBugReviewPayload({
      description: 'curta',
      affectedSystem: 'Checkout',
      scope: 'invalid',
      blocksEssentialFunction: 'yes',
    });

    expect(errors).to.be.an('array');
    expect(errors.some((item) => item.field === 'description')).to.equal(true);
    expect(errors.some((item) => item.field === 'scope')).to.equal(true);
    expect(errors.some((item) => item.field === 'blocksEssentialFunction')).to.equal(true);
  });

  it('accepts valid payload', () => {
    const errors = validateBugReviewPayload({
      description: 'O checkout não permite finalizar a compra após inserir o cartão.',
      affectedSystem: 'Checkout',
      scope: 'some_users',
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
      hasDataLoss: false,
      hasFinancialRisk: false,
      hasSecurityRisk: false,
    });

    expect(errors).to.deep.equal([]);
  });
});
