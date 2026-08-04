function calculateQualityScore(payload = {}) {
  const fields = [
    { key: 'description', weight: 20 },
    { key: 'stepsToReproduce', weight: 15 },
    { key: 'expectedResult', weight: 10 },
    { key: 'actualResult', weight: 10 },
    { key: 'environment', weight: 8 },
    { key: 'browser', weight: 7 },
    { key: 'operatingSystem', weight: 7 },
    { key: 'frequency', weight: 8 },
    { key: 'evidence', weight: 10 },
    { key: 'impactInfo', weight: 5 },
  ];

  let score = 0;
  for (const field of fields) {
    const value = payload[field.key];
    if (field.key === 'impactInfo') {
      const hasImpactInfo = payload.blocksEssentialFunction !== undefined || payload.hasAlternativeFlow !== undefined || payload.hasDataLoss !== undefined || payload.hasFinancialRisk !== undefined || payload.hasSecurityRisk !== undefined;
      if (hasImpactInfo) score += field.weight;
    } else if (field.key === 'stepsToReproduce') {
      if (Array.isArray(value) && value.filter(Boolean).length > 0) score += field.weight;
    } else if (field.key === 'evidence') {
      if (Array.isArray(value) && value.filter(Boolean).length > 0) score += field.weight;
    } else if (typeof value === 'string' && value.trim().length > 0) {
      score += field.weight;
    }
  }

  return Math.min(100, Math.max(0, score));
}

module.exports = { calculateQualityScore };
