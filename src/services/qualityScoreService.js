function calculateQualityScore(payload = {}) {
  const description = typeof payload.description === 'string' ? payload.description.trim() : '';
  const steps = Array.isArray(payload.stepsToReproduce) ? payload.stepsToReproduce.filter(Boolean) : [];
  const expectedResult = typeof payload.expectedResult === 'string' ? payload.expectedResult.trim() : '';
  const actualResult = typeof payload.actualResult === 'string' ? payload.actualResult.trim() : '';
  const environment = typeof payload.environment === 'string' ? payload.environment.trim() : '';
  const browser = typeof payload.browser === 'string' ? payload.browser.trim() : '';
  const operatingSystem = typeof payload.operatingSystem === 'string' ? payload.operatingSystem.trim() : '';
  const device = typeof payload.device === 'string' ? payload.device.trim() : '';
  const frequency = typeof payload.frequency === 'string' ? payload.frequency.trim() : '';
  const evidence = Array.isArray(payload.evidence) ? payload.evidence.filter(Boolean) : [];
  const hasImpactInfo = payload.blocksEssentialFunction !== undefined || payload.hasAlternativeFlow !== undefined || payload.hasDataLoss !== undefined || payload.hasFinancialRisk !== undefined || payload.hasSecurityRisk !== undefined;

  let score = 0;
  if (description.length >= 20) score += 25;
  if (steps.length >= 1) score += 20;
  if (expectedResult.length > 0) score += 15;
  if (actualResult.length > 0) score += 15;
  if (environment) score += 5;
  if (browser) score += 5;
  if (operatingSystem) score += 5;
  if (device) score += 3;
  if (frequency) score += 3;
  if (evidence.length > 0) score += 4;
  if (hasImpactInfo) score += 5;

  return Math.min(100, Math.max(0, score));
}

module.exports = { calculateQualityScore };
