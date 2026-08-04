const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

function buildSeedData() {
  const passwordHash = bcrypt.hashSync('Senha123!', 10);
  const adminUser = {
    id: uuidv4(),
    name: 'Administrador QA',
    email: 'admin@qa-review.ai',
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const analystUser = {
    id: uuidv4(),
    name: 'Analista QA',
    email: 'analista@qa-review.ai',
    passwordHash,
    role: 'analyst',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    users: [adminUser, analystUser],
    severityCriteria: [
      {
        id: uuidv4(),
        code: 'S1',
        title: 'Crítica',
        description: 'Impacto crítico, indisponibilidade total, perda grave de dados, risco de segurança ou financeiro crítico.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        code: 'S2',
        title: 'Alta',
        description: 'Funcionalidade essencial indisponível, fluxo principal bloqueado ou sem alternativa.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        code: 'S3',
        title: 'Média',
        description: 'Impacto funcional moderado, existe alternativa de fluxo ou parte dos usuários é afetada.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        code: 'S4',
        title: 'Baixa',
        description: 'Problema visual, cosmético ou sem impacto operacional relevante.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    bugReviews: [
      {
        id: uuidv4(),
        userId: analystUser.id,
        title: 'Exemplo de bug',
        summary: 'Exemplo de relato revisado automaticamente.',
        stepsToReproduce: ['Acessar a tela de login', 'Informar credenciais válidas'],
        expectedResult: 'O sistema deve autenticar o usuário.',
        actualResult: 'A tela permanece travada.',
        environment: 'Homologação',
        browser: 'Chrome',
        operatingSystem: 'Windows 11',
        device: 'Notebook',
        frequency: 'Sempre',
        blocksEssentialFunction: true,
        hasAlternativeFlow: false,
        hasDataLoss: false,
        scope: 'some_users',
        hasFinancialRisk: false,
        hasSecurityRisk: false,
        evidence: ['Print da tela com erro'],
        severity: 'S2',
        severityJustification: 'Fluxo principal bloqueado e não existe alternativa.',
        category: 'Bug de autenticação',
        risksIdentified: ['Bloqueio de acesso'],
        missingInformation: [],
        complementaryQuestions: [],
        qualityScore: 82,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

module.exports = { buildSeedData };
