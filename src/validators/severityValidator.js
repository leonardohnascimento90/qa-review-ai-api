function validateSeverityPayload(payload = {}) {
  const errors = [];

  if (typeof payload.code !== 'string' || !/^S[1-4]$/.test(payload.code)) {
    errors.push({ field: 'code', message: 'O código deve ser S1, S2, S3 ou S4.' });
  }

  if (typeof payload.title !== 'string' || payload.title.trim().length < 2) {
    errors.push({ field: 'title', message: 'O título é obrigatório.' });
  }

  if (typeof payload.description !== 'string' || payload.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'A descrição é obrigatória.' });
  }

  return errors;
}

module.exports = { validateSeverityPayload };
