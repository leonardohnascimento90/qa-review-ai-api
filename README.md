# QA Review AI

## Descrição
QA Review AI é uma API REST em Node.js e Express criada para auxiliar profissionais de QA na revisão, padronização e classificação de relatos de bugs antes de serem registrados em ferramentas como Jira ou Azure DevOps.

## Problema que a aplicação resolve
Relatos de bugs muitas vezes chegam incompletos, inconsistentes ou mal estruturados. A aplicação utiliza IA generativa para transformar esses relatos em um relatório estruturado, com severidade sugerida, categoria, riscos, perguntas complementares e score de qualidade.

## Objetivo
Fornecer uma API segura, autenticada e com permissões por perfil para revisar relatos de bugs e gerar análises estruturadas com base em critérios de severidade.

## Funcionalidades
- Autenticação com JWT
- Cadastro e consulta de usuários
- Criação e consulta de análises de bug
- Consulta de critérios de severidade
- Geração de análise com IA em modo mock ou real
- Documentação Swagger
- Paginação, filtros e tratamento de erros padronizado

## Perfis de usuário
- Administrador: pode gerenciar usuários, consultar todas as análises, gerenciar severidades e acessar todas as funcionalidades.
- Analista de QA: pode autenticar-se, criar análises, consultar suas próprias análises e consultar severidades.

## Tecnologias
- Node.js
- Express
- JWT
- bcrypt
- Swagger UI Express
- Mocha, Chai e Supertest
- NYC

## Arquitetura em camadas
- routes
- controllers
- services
- models
- middlewares
- repositories
- validators
- resources
- config

## Estrutura de pastas
```text
src/
  config/
  controllers/
  middlewares/
  models/
  repositories/
  resources/
  routes/
  services/
  validators/
  app.js
  server.js

tests/
  unit/
  integration/
  fixtures/
  mocks/
```

## Instalação
```bash
npm install
```

## Variáveis de ambiente
O arquivo .env.example contém as variáveis principais:
- PORT
- NODE_ENV
- JWT_SECRET
- AI_PROVIDER
- OPENAI_API_KEY
- OPENAI_MODEL
- OPENAI_TIMEOUT_MS

## Iniciar o projeto
```bash
npm run dev
```

## Scripts disponíveis
- npm start
- npm run dev
- npm test
- npm run test:unit
- npm run test:integration
- npm run coverage
- npm run validate

## Credenciais iniciais
- Administrador: admin@qa-review.ai / Senha123!
- Analista: analista@qa-review.ai / Senha123!

## Exemplos de utilização
### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qa-review.ai","password":"Senha123!"}'
```

### Criar análise de bug
```bash
curl -X POST http://localhost:3000/api/bug-reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"description":"O checkout não permite finalizar a compra após inserir o cartão.","affectedSystem":"Checkout","scope":"some_users","blocksEssentialFunction":true,"hasAlternativeFlow":false,"hasDataLoss":false,"hasFinancialRisk":false,"hasSecurityRisk":false}'
```

## Modos mock e real da IA
- mock: padrão, usa uma análise simulada previsível para testes e automações.
- openai: usa uma API externa quando a variável AI_PROVIDER=openai e OPENAI_API_KEY estiver configurada.

## Swagger
A documentação está disponível em:
```text
http://localhost:3000/api/docs
```

## Decisões técnicas
- Banco em memória com abstração de repositório para permitir substituição futura.
- Hash de senha com bcrypt.
- Middleware de autenticação e autorização por perfil.
- Validação de payloads e respostas padronizadas.
- IA em modo mock por padrão para não depender de API externa.

## Limitações conhecidas
- Os dados são armazenados em memória e serão perdidos ao reiniciar o processo.
- O modo real depende de uma chave válida da OpenAI.

## Possibilidades de evolução
- Substituir o repositório em memória por PostgreSQL ou MongoDB.
- Adicionar filas e processamento assíncrono para análise de bugs.
- Implementar integração com Jira/Azure DevOps.
- Expandir os critérios de severidade e categoria.
