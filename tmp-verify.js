const { analyzeBugWithAi } = require('./src/services/aiService');
(async () => {
  const result = await analyzeBugWithAi({
    description: 'O usuário não consegue concluir o fluxo porque o sistema trava.',
    affectedSystem: 'Checkout',
    expectedResult: 'O sistema deve concluir a compra e criar o pedido.',
    actualResult: 'A compra não é concluída e o pedido não é criado.',
    stepsToReproduce: ['Acessar checkout', 'Finalizar compra'],
    hasAlternativeFlow: true,
  });
  console.log(JSON.stringify(result, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
