const ALLOWED_SCOPES = ['one_user', 'some_users', 'all_users', 'unknown'];
const VALID_BOOLEAN_LIKE = ['true', 'false', 'unknown'];

function validateBugReviewPayload(payload = {}) {
  const errors = [];

  if (typeof payload.description !== 'string' || payload.description.trim().length < 20 || payload.description.trim().length > 5000) {
    errors.push({ field: 'description', message: 'A descrição deve ter entre 20 e 5000 caracteres.' });
  }

  if (typeof payload.affectedSystem !== 'string' || payload.affectedSystem.trim().length < 1) {
    errors.push({ field: 'affectedSystem', message: 'O sistema ou funcionalidade afetada é obrigatório.' });
  }

  if (payload.scope && !ALLOWED_SCOPES.includes(payload.scope)) {
    errors.push({ field: 'scope', message: 'O escopo deve ser one_user, some_users, all_users ou unknown.' });
  }

  const booleanFields = ['blocksEssentialFunction', 'hasAlternativeFlow', 'hasDataLoss', 'hasFinancialRisk', 'hasSecurityRisk'];
  for (const field of booleanFields) {
    const value = payload[field];
    if (value !== undefined && value !== null && typeof value !== 'boolean' && !VALID_BOOLEAN_LIKE.includes(String(value).toLowerCase())) {
      errors.push({ field, message: 'O valor deve ser true, false ou unknown.' });
    }
  }

  if (payload.title !== undefined && payload.title !== null && typeof payload.title !== 'string') {
    errors.push({ field: 'title', message: 'O título deve ser uma string.' });
  }

  return errors;
}

function normalizeBugReviewPayload(payload) {
  return {
    ...payload,
    description: payload.description?.trim(),
    affectedSystem: payload.affectedSystem?.trim(),
    title: payload.title?.trim() || undefined,
    stepsToReproduce: Array.isArray(payload.stepsToReproduce) ? payload.stepsToReproduce : [],
    expectedResult: payload.expectedResult?.trim() || undefined,
    actualResult: payload.actualResult?.trim() || undefined,
    environment: payload.environment?.trim() || undefined,
    browser: payload.browser?.trim() || undefined,
    operatingSystem: payload.operatingSystem?.trim() || undefined,
    device: payload.device?.trim() || undefined,
    frequency: payload.frequency?.trim() || undefined,
    evidence: Array.isArray(payload.evidence) ? payload.evidence : [],
    scope: payload.scope || 'unknown',
    blocksEssentialFunction: normalizeBooleanLike(payload.blocksEssentialFunction),
    hasAlternativeFlow: normalizeBooleanLike(payload.hasAlternativeFlow),
    hasDataLoss: normalizeBooleanLike(payload.hasDataLoss),
    hasFinancialRisk: normalizeBooleanLike(payload.hasFinancialRisk),
    hasSecurityRisk: normalizeBooleanLike(payload.hasSecurityRisk),
  };
}

function normalizeBooleanLike(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    if (normalized === 'unknown') return null;
  }
  return null;
}

module.exports = { validateBugReviewPayload, normalizeBugReviewPayload };
