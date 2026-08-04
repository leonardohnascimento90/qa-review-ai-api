function hasFunctionalImpact(description = '') {
  return /falha|falhou|erro|valida|mensagem|incorreta|incorreto|recuper|workaround|bloque|concluir|fluxo|operação|operacao|comportamento|trava|não consegue|nao consegue|não é possível|nao e possivel|não funciona|nao funciona|incorreto|inconsist/i.test(description);
}

function isExclusivelyVisualIssue(description = '') {
  const normalized = (description || '').toLowerCase();
  const hasVisualKeywords = /\b(desalinh|desalinhado|layout|espaç|espaço|espaçamento|ícone|icone|tipograf|ortograf|responsiv|visual|cosm|estilo|cor)\b/i.test(normalized);
  return hasVisualKeywords && !hasFunctionalImpact(normalized);
}

function evaluateSeverity(payload = {}) {
  const description = (payload.description || '').toLowerCase();
  const hasCriticalImpact = payload.hasDataLoss || payload.hasFinancialRisk || payload.hasSecurityRisk || /indisponível|indisponivel|crítico|critico|generalizado|grave/i.test(description);
  const blocksEssential = Boolean(payload.blocksEssentialFunction);
  const hasAlternative = Boolean(payload.hasAlternativeFlow);
  const isFunctionalIssue = hasFunctionalImpact(description);
  const isVisualOnly = isExclusivelyVisualIssue(description);

  if (hasCriticalImpact) {
    return 'S1';
  }

  if (blocksEssential && !hasAlternative) {
    return 'S2';
  }

  if (isFunctionalIssue) {
    return 'S3';
  }

  if (isVisualOnly) {
    return 'S4';
  }

  return 'S3';
}

function buildSeverityJustification(payload = {}) {
  const severity = evaluateSeverity(payload);
  const reasons = [];
  const description = (payload.description || '').toLowerCase();
  const isVisualOnly = isExclusivelyVisualIssue(description);

  if (payload.hasDataLoss) reasons.push('Perda ou corrupção de dados');
  if (payload.hasSecurityRisk) reasons.push('Risco de segurança');
  if (payload.hasFinancialRisk) reasons.push('Risco financeiro');
  if (payload.blocksEssentialFunction) reasons.push('Função essencial bloqueada');
  if (payload.blocksEssentialFunction && !payload.hasAlternativeFlow) reasons.push('Não existe alternativa');
  if (payload.hasAlternativeFlow) reasons.push('Existe alternativa para o fluxo');
  if (isVisualOnly) reasons.push('Problema visual ou cosmético');
  if (!payload.hasDataLoss && !payload.hasFinancialRisk && !payload.hasSecurityRisk && !payload.blocksEssentialFunction) reasons.push('Impacto funcional moderado');

  return {
    severity,
    justification: `Severity sugerida ${severity} com base em: ${reasons.join('; ')}. Esta é uma sugestão e deve ser revisada por QA.`,
  };
}

module.exports = { evaluateSeverity, buildSeverityJustification, hasFunctionalImpact, isExclusivelyVisualIssue };
