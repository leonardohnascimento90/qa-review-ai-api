const env = require('../config/env');
const { buildSeverityJustification } = require('./severityService');
const { calculateQualityScore } = require('./qualityScoreService');

async function analyzeBugWithAi(payload) {
  if (env.aiProvider !== 'openai') {
    const { severity, justification } = buildSeverityJustification(payload);
    return {
      title: payload.title || 'Bug revisado automaticamente',
      summary: payload.description || 'Resumo gerado pelo modo mock.',
      stepsToReproduce: payload.stepsToReproduce || [],
      expectedResult: payload.expectedResult || 'O comportamento esperado deve ser preservado.',
      actualResult: payload.actualResult || 'O comportamento observado diverge do esperado.',
      severity,
      severityJustification: justification,
      category: 'Bug funcional',
      risksIdentified: [
        payload.hasSecurityRisk ? 'Risco de segurança' : null,
        payload.hasFinancialRisk ? 'Risco financeiro' : null,
        payload.hasDataLoss ? 'Perda ou corrupção de dados' : null,
      ].filter(Boolean),
      missingInformation: [],
      complementaryQuestions: [],
      qualityScore: calculateQualityScore(payload),
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
