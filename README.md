# QA Review AI

## Descrição

QA Review AI é uma API REST em Node.js e Express criada para auxiliar profissionais de QA na revisão, padronização e classificação de relatos de bugs antes de serem registrados em ferramentas como Jira ou Azure DevOps.

## Problema que a aplicação resolve

Relatos de bugs muitas vezes chegam incompletos, inconsistentes ou mal estruturados. A aplicação utiliza IA generativa para transformar esses relatos em um relatório estruturado, com severidade sugerida, categoria, riscos, perguntas complementares e score de qualidade.

## Objetivo

Fornecer uma API autenticada e com permissões por perfil para revisar relatos de bugs e gerar análises estruturadas com base em critérios de severidade.

## Funcionalidades

- autenticação com JWT;
- cadastro e consulta de usuários;
- criação e consulta de análises de bug;
- consulta de critérios de severidade;
- geração de análise com IA em modo mock ou real;
- documentação Swagger;
- paginação, filtros e tratamento de erros padronizado.

## Perfis de usuário

- **Administrador:** pode gerenciar usuários, consultar todas as análises, gerenciar severidades e acessar as funcionalidades administrativas.
- **Analista de QA:** pode autenticar-se, criar análises, consultar suas próprias análises e consultar severidades.

## Tecnologias

- Node.js;
- Express;
- JWT;
- bcrypt;
- Swagger UI Express;
- Mocha;
- Chai;
- Supertest;
- NYC;
- Grafana K6.

## Arquitetura em camadas

- routes;
- controllers;
- services;
- models;
- middlewares;
- repositories;
- validators;
- resources;
- config.

## Estrutura de pastas

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

    performance/
      health-smoke.js

## Instalação

    npm install

## Variáveis de ambiente

O arquivo `.env.example` contém as principais variáveis utilizadas pela aplicação:

- `PORT`;
- `NODE_ENV`;
- `JWT_SECRET`;
- `AI_PROVIDER`;
- `OPENAI_API_KEY`;
- `OPENAI_MODEL`;
- `OPENAI_TIMEOUT_MS`.

## Iniciar o projeto

    npm run dev

A API será iniciada localmente na porta configurada, normalmente:

    http://localhost:3000

## Scripts disponíveis

- `npm start`
- `npm run dev`
- `npm test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run coverage`
- `npm run validate`

## Credenciais iniciais

As credenciais de teste são utilizadas somente no ambiente local e não devem ser expostas no repositório.

Consulte a configuração local da aplicação para utilizar os usuários de teste.

## Exemplo de login

    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"<email-local>","password":"<senha-local>"}'

## Exemplo de criação de análise de bug

    curl -X POST http://localhost:3000/api/bug-reviews \
      -H "Authorization: Bearer <token>" \
      -H "Content-Type: application/json" \
      -d '{"description":"O checkout não permite finalizar a compra após inserir o cartão.","affectedSystem":"Checkout","scope":"some_users","blocksEssentialFunction":true,"hasAlternativeFlow":false,"hasDataLoss":false,"hasFinancialRisk":false,"hasSecurityRisk":false}'

## Modos mock e real da IA

- `mock`: modo padrão, utiliza uma análise simulada e previsível para testes e automações;
- `openai`: utiliza uma API externa quando `AI_PROVIDER=openai` e `OPENAI_API_KEY` estiver configurada.

## Swagger

A documentação interativa da API está disponível em:

    http://localhost:3000/api/docs

A especificação observada utiliza OpenAPI 3.0.

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/users`
- `GET /api/users`
- `POST /api/bug-reviews`
- `GET /api/bug-reviews`
- `GET /api/bug-reviews/{id}`
- `GET /api/severities`
- `POST /api/severities`
- `PUT /api/severities/{id}`
- `GET /api/health`
- `GET /api/docs`

## Decisões técnicas

- armazenamento em memória com abstração de repositório para permitir substituição futura;
- hash de senha com bcrypt;
- middleware de autenticação;
- autorização por perfil;
- validação de payloads;
- respostas padronizadas;
- IA em modo mock por padrão para não depender de API externa.

## Testes automatizados

Comando executado:

    npm test

Resultado real:

- 23 testes aprovados;
- 0 testes reprovados;
- tempo total: 698 ms.

Cobertura registrada:

- Statements: 74,11%;
- Branches: 67,35%;
- Functions: 66,12%;
- Lines: 73,16%.

## Teste de performance

Foi executado um teste de smoke com Grafana K6 para o endpoint:

    GET /api/health

Resultado:

- 5 requisições;
- 0% de falhas HTTP;
- 10 checks executados;
- 10 checks aprovados;
- p95: 10,26 ms;
- threshold de falhas aprovado;
- threshold de duração aprovado.

Script utilizado:

    performance/health-smoke.js

Comando de execução:

    k6 run performance/health-smoke.js

## Acompanhamento de QA

O acompanhamento dos casos de teste, execuções, itens em debug e defeitos está disponível no GitHub Project:

[QA Review AI — Plano de Testes](https://github.com/users/leonardohnascimento90/projects/5/views/1)

### Evidências

- [Evidência — cadastro de usuário via Postman](https://github.com/leonardohnascimento90/qa-review-ai-api/blob/main/qa/evidence/evidence-postman-user-created.png.png)

## Defeitos documentados

Foi identificado e documentado o seguinte defeito:

- **BUG-001:** exposição do campo sensível `passwordHash` no retorno do endpoint `GET /api/users`;
- **Severidade:** S2 — Alta;
- **Status:** aberto.

O detalhamento está disponível na [Wiki de Reporte de Defeitos](https://github.com/leonardohnascimento90/qa-review-ai-api/wiki/7-Reporte-de-Defeitos).

## Limitações conhecidas

- os dados são armazenados em memória e são perdidos quando o processo é reiniciado;
- o modo real da IA depende de uma chave válida do provedor configurado;
- o teste de carga ainda não foi executado;
- o teste de estresse ainda não foi executado;
- nem todos os endpoints foram exercitados manualmente pelo Swagger;
- o defeito BUG-001 permanece aberto.

## Possibilidades de evolução

- substituir o repositório em memória por PostgreSQL ou MongoDB;
- adicionar filas e processamento assíncrono para análise de bugs;
- implementar integração com Jira ou Azure DevOps;
- expandir os critérios de severidade e categoria;
- adicionar testes K6 autenticados;
- ampliar os cenários de carga e estresse.

As evoluções futuras somente serão consideradas concluídas após serem implementadas e validadas.
