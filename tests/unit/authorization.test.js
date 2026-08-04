const { expect } = require('chai');
const { authorizeRole } = require('../../src/middlewares/authorizationMiddleware');

describe('Authorization rules', () => {
  it('allows admins to access administrative routes', () => {
    expect(authorizeRole('admin', ['admin'])).to.equal(true);
  });

  it('denies analysts from administrative routes', () => {
    expect(authorizeRole('analyst', ['admin'])).to.equal(false);
  });
});
