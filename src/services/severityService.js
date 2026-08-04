function evaluateSeverity(payload = {}) {
  const hasCriticalImpact = payload.hasDataLoss || payload.hasFinancialRisk || payload.hasSecurityRisk;
  if (payload.blocksEssentialFunction && !payload.hasAlternativeFlow && (payload.hasDataLoss || payload.hasFinancialRisk || payload.hasSecurityRisk || payload.scope === 'all_users')) {
    return 'S1';
  }
  if (hasCriticalImpact) {
    return 'S1';
  }
  if (payload.blocksEssentialFunction && !payload.hasAlternativeFlow) {
    return 'S2';
  }
  if (payload.hasAlternativeFlow || payload.scope === 'some_users' || payload.scope === 'one_user') {
    return 'S3';
  }
  return 'S4';
}

function buildSeverityJustification(payload = {}) {
  const severity = evaluateSeverity(payload);
  const reasons = [];
  if (payload.blocksEssentialFunction) reasons.push('A função essencial está bloqueada.');
  if (!payload.hasAlternativeFlow) reasons.push('Não existe alternativa para o fluxo.');
  if (payload.hasDataLoss) reasons.push('Há perda de dados.');
  if (payload.hasFinancialRisk) reasons.push('Há risco financeiro.');
  if (payload.hasSecurityRisk) reasons.push('Há risco de segurança.');
  if (payload.scope === 'all_users') reasons.push('Impacta todos os usuários.');
  if (payload.scope === 'some_users') reasons.push('Impacta parte dos usuários.');
  if (payload.scope === 'one_user') reasons.push('Impacta um único usuário.');
  return {
    severity,
    justification: `Severity sugerida ${severity} com base em: ${reasons.join(' ')}. Esta é uma sugestão e deve ser revisada por QA.`,
  };
}

module.exports = { evaluateSeverity, buildSeverityJustification };
