const { expect } = require('chai');
const { analyzeBugWithAi } = require('../../src/services/aiService');
const { evaluateSeverity, buildSeverityJustification } = require('../../src/services/severityService');
const { calculateQualityScore } = require('../../src/services/qualityScoreService');

describe('Analysis intelligence', () => {
  it('classifies S1 for critical data or security impact', async () => {
    const result = await analyzeBugWithAi({
      description: 'O sistema apagou os dados do cliente ao salvar a alteração e expôs informações sensíveis.',
      affectedSystem: 'Cadastro',
      scope: 'all_users',
      hasDataLoss: true,
      hasSecurityRisk: true,
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
    });

    expect(result.severity).to.equal('S1');
    expect(result.reasoning).to.include('Perda ou corrupção de dados');
    expect(result.category).to.equal('Dados');
  });

  it('classifies S2 when an essential function is blocked without alternative', async () => {
    const result = await analyzeBugWithAi({
      description: 'O usuário não consegue concluir o login porque a tela fica travada.',
      affectedSystem: 'Login',
      scope: 'some_users',
      blocksEssentialFunction: true,
      hasAlternativeFlow: false,
    });

    expect(result.severity).to.equal('S2');
    expect(result.reasoning).to.include('Função essencial bloqueada');
  });

  it('classifies S3 for recoverable validation issues with alternative flow', async () => {
    const result = await analyzeBugWithAi({
      description: 'A validação de e-mail está incorreta e o usuário pode tentar novamente.',
      affectedSystem: 'Cadastro',
      scope: 'one_user',
      blocksEssentialFunction: false,
      hasAlternativeFlow: true,
    });

    expect(result.severity).to.equal('S3');
    expect(result.category).to.equal('Validação');
  });

  it('classifies S4 for visual-only issues', async () => {
    const result = await analyzeBugWithAi({
      description: 'O ícone de salvar aparece desalinhado na tela de cadastro.',
      affectedSystem: 'Cadastro',
      scope: 'unknown',
      blocksEssentialFunction: false,
      hasAlternativeFlow: true,
    });

    expect(result.severity).to.equal('S4');
    expect(result.category).to.equal('Bug visual');
  });

  it('collects missing information and computes quality score consistently', async () => {
    const result = await analyzeBugWithAi({
      description: 'O checkout falha ao finalizar a compra.',
      affectedSystem: 'Checkout',
      scope: 'some_users',
    });

    expect(result.missingInformation).to.include('passos para reproduzir');
    expect(result.missingInformation).to.include('resultado esperado');
    expect(result.qualityScore).to.equal(25);
  });

  it('detects contradictions and preserves submitted values', async () => {
    const result = await analyzeBugWithAi({
      description: 'O usuário não consegue concluir o fluxo porque o sistema trava.',
      affectedSystem: 'Checkout',
      expectedResult: 'O sistema deve concluir a compra e criar o pedido.',
      actualResult: 'A compra não é concluída e o pedido não é criado.',
      stepsToReproduce: ['Acessar checkout', 'Finalizar compra'],
      hasAlternativeFlow: true,
    });

    expect(result.warnings).to.be.an('array');
    expect(result.warnings.length).to.be.greaterThan(0);
    expect(result.expectedResult).to.equal('O sistema deve concluir a compra e criar o pedido.');
    expect(result.actualResult).to.equal('A compra não é concluída e o pedido não é criado.');
    expect(result.stepsToReproduce).to.deep.equal(['Acessar checkout', 'Finalizar compra']);
  });

  it('returns confidence and reasoning for severity decisions', async () => {
    const result = await analyzeBugWithAi({
      description: 'A tela de login apresenta erro de validação e o usuário precisa tentar novamente.',
      affectedSystem: 'Login',
      hasAlternativeFlow: true,
      blocksEssentialFunction: false,
    });

    expect(result.confidence).to.be.a('number');
    expect(result.confidence).to.be.at.least(0);
    expect(result.confidence).to.be.at.most(100);
    expect(result.reasoning).to.be.an('array');
    expect(result.reasoning.length).to.be.greaterThan(0);
  });
});
