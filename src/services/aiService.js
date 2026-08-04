const env = require('../config/env');
const { buildSeverityJustification, hasFunctionalImpact, isExclusivelyVisualIssue } = require('./severityService');
const { calculateQualityScore } = require('./qualityScoreService');

function inferCategory(payload = {}) {
  const description = (payload.description || '').toLowerCase();
  if (isExclusivelyVisualIssue(description)) {
    return 'Bug visual';
  }
  if (/valida|erro de valida|campos|campo|formul|senha|e-mail|email/i.test(description)) {
    return 'Validação';
  }
  if (/seguran|autentic|token|perm|acesso|priv|cript/i.test(description)) {
    return 'Segurança';
  }
  if (/desempenh|lent|tempo|timeout|performance|carreg|latenc/i.test(description)) {
    return 'Performance';
  }
  if (/dados|grav|salvar|persist|base|banco|arquivo/i.test(description)) {
    return 'Dados';
  }
  if (/integra|api|serviço|servico|webhook|gateway|comunica/i.test(description)) {
    return 'Integração';
  }
  if (/experi|usabili|fluxo|naveg|clique|botão|botao/i.test(description)) {
    return 'Usabilidade';
  }
  return 'Bug funcional';
}

function inferExpectedResult(payload = {}) {
  const description = (payload.description || '').trim();
  const affectedSystem = (payload.affectedSystem || '').trim();
  const provided = typeof payload.expectedResult === 'string' ? payload.expectedResult.trim() : '';
  if (provided) return provided;
  if (affectedSystem) {
    return `O sistema deve processar corretamente a operação em ${affectedSystem} e preservar o fluxo esperado.`;
  }
  if (description) {
    const normalized = description.replace(/\s+/g, ' ').slice(0, 120);
    return `O sistema deve concluir a ação descrita em "${normalized}" sem interrupções.`;
  }
  return 'O sistema deve executar a operação de forma correta e consistente.';
}

function inferActualResult(payload = {}) {
  const description = (payload.description || '').trim();
  const provided = typeof payload.actualResult === 'string' ? payload.actualResult.trim() : '';
  if (provided) return provided;
  if (description) {
    return `O comportamento observado não atende ao esperado: ${description}`;
  }
  return 'O comportamento observado diverge do esperado.';
}

function inferMissingInformation(payload = {}) {
  const missing = [];
  const steps = Array.isArray(payload.stepsToReproduce) ? payload.stepsToReproduce.filter(Boolean) : [];
  const expected = typeof payload.expectedResult === 'string' && payload.expectedResult.trim();
  const actual = typeof payload.actualResult === 'string' && payload.actualResult.trim();
  const environment = typeof payload.environment === 'string' && payload.environment.trim();
  const browser = typeof payload.browser === 'string' && payload.browser.trim();
  const operatingSystem = typeof payload.operatingSystem === 'string' && payload.operatingSystem.trim();
  const device = typeof payload.device === 'string' && payload.device.trim();
  const frequency = typeof payload.frequency === 'string' && payload.frequency.trim();
  const evidence = Array.isArray(payload.evidence) ? payload.evidence.filter(Boolean) : [];

  if (steps.length === 0) missing.push('passos para reproduzir');
  if (!expected) missing.push('resultado esperado');
  if (!actual) missing.push('resultado obtido');
  if (!environment) missing.push('ambiente');
  if (!browser) missing.push('navegador');
  if (!operatingSystem) missing.push('sistema operacional');
  if (!device) missing.push('dispositivo');
  if (!frequency) missing.push('frequência');
  if (evidence.length === 0) missing.push('evidências');
  return missing;
}

function inferComplementaryQuestions(missing = []) {
  const questions = [];
  if (missing.includes('passos para reproduzir')) questions.push('Quais passos reproduzem o problema?');
  if (missing.includes('resultado esperado')) questions.push('Qual era o comportamento esperado?');
  if (missing.includes('resultado obtido')) questions.push('O que aconteceu de fato?');
  if (missing.includes('navegador')) questions.push('Qual navegador foi utilizado?');
  if (missing.includes('ambiente')) questions.push('Em qual ambiente o problema ocorreu?');
  if (missing.includes('sistema operacional')) questions.push('Qual sistema operacional foi utilizado?');
  if (missing.includes('dispositivo')) questions.push('Qual dispositivo foi utilizado?');
  if (missing.includes('frequência')) questions.push('O problema ocorre sempre ou em algumas ocasiões?');
  if (missing.includes('evidências')) questions.push('Existe evidência disponível para anexar?');
  return questions;
}

function detectContradictions(payload = {}) {
  const warnings = [];
  const description = (payload.description || '').toLowerCase();
  const hasAlternative = Boolean(payload.hasAlternativeFlow);
  if (description.includes('não consegue') || description.includes('não é possível') || description.includes('não consegue concluir') || description.includes('trava') || description.includes('bloqueia')) {
    if (hasAlternative) {
      warnings.push('O relato informa que existe uma alternativa para o fluxo, porém a descrição afirma que o usuário não consegue concluir a operação.');
    }
  }
  return warnings;
}

function calculateConfidence(payload = {}, missingInformation = [], warnings = []) {
  let confidence = 60;
  if (typeof payload.description === 'string' && payload.description.trim().length >= 20) confidence += 15;
  if (Array.isArray(payload.stepsToReproduce) && payload.stepsToReproduce.filter(Boolean).length > 0) confidence += 10;
  if (typeof payload.expectedResult === 'string' && payload.expectedResult.trim()) confidence += 5;
  if (typeof payload.actualResult === 'string' && payload.actualResult.trim()) confidence += 5;
  if (payload.environment || payload.browser || payload.operatingSystem || payload.device || payload.frequency) confidence += 5;
  confidence -= missingInformation.length * 3;
  confidence -= warnings.length * 8;
  return Math.min(100, Math.max(0, confidence));
}

async function analyzeBugWithAi(payload) {
  if (env.aiProvider !== 'openai') {
    const { severity, justification } = buildSeverityJustification(payload);
    const missingInformation = inferMissingInformation(payload);
    const warnings = detectContradictions(payload);
    const confidence = calculateConfidence(payload, missingInformation, warnings);
    const category = inferCategory(payload);
    const expectedResult = inferExpectedResult(payload);
    const actualResult = inferActualResult(payload);
    const reasoning = [];
    if (payload.blocksEssentialFunction) reasoning.push('Função essencial bloqueada');
    if (payload.blocksEssentialFunction && !payload.hasAlternativeFlow) reasoning.push('Não existe alternativa');
    if (payload.hasDataLoss) reasoning.push('Perda ou corrupção de dados');
    if (payload.hasSecurityRisk) reasoning.push('Risco de segurança');
    if (payload.hasFinancialRisk) reasoning.push('Risco financeiro');
    if (payload.hasAlternativeFlow) reasoning.push('Existe alternativa para o fluxo');
    if (!payload.hasDataLoss && !payload.hasFinancialRisk && !payload.hasSecurityRisk && !payload.blocksEssentialFunction) reasoning.push('Impacto funcional moderado');

    return {
      title: payload.title || 'Bug revisado automaticamente',
      summary: payload.description || 'Resumo gerado pelo modo mock.',
      stepsToReproduce: Array.isArray(payload.stepsToReproduce) ? payload.stepsToReproduce.filter(Boolean) : [],
      expectedResult: payload.expectedResult || expectedResult,
      actualResult: payload.actualResult || actualResult,
      severity,
      severityJustification: justification,
      category,
      risksIdentified: [
        payload.hasSecurityRisk ? 'Risco de segurança' : null,
        payload.hasFinancialRisk ? 'Risco financeiro' : null,
        payload.hasDataLoss ? 'Perda ou corrupção de dados' : null,
      ].filter(Boolean),
      missingInformation,
      complementaryQuestions: inferComplementaryQuestions(missingInformation),
      qualityScore: calculateQualityScore(payload),
      warnings,
      confidence,
      reasoning,
    };
  }

  if (!env.openaiApiKey) {
    const error = new Error('Chave da OpenAI não configurada.');
    error.code = 'AI_SERVICE_UNAVAILABLE';
    throw error;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openaiModel,
      messages: [{ role: 'system', content: 'Você é um assistente de QA.' }, { role: 'user', content: JSON.stringify(payload) }],
      timeout: env.openaiTimeoutMs,
    }),
  });

  if (!response.ok) {
    const error = new Error('Erro na comunicação com a IA.');
    error.code = 'AI_SERVICE_UNAVAILABLE';
    throw error;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);
  return parsed;
}

module.exports = { analyzeBugWithAi };
