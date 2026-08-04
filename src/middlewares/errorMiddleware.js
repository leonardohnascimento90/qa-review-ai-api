function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err && err.code === 'VALIDATION_ERROR') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Existem dados inválidos na requisição.', details: err.details || [] } });
  }

  if (err && err.code === 'AI_SERVICE_UNAVAILABLE') {
    return res.status(503).json({ error: { code: 'AI_SERVICE_UNAVAILABLE', message: 'O serviço de IA está indisponível.', details: [] } });
  }

  if (err && err.code === 'AI_RESPONSE_INVALID') {
    return res.status(422).json({ error: { code: 'AI_RESPONSE_INVALID', message: 'A resposta da IA é inválida.', details: [] } });
  }

  if (err && err.code === 'CONFLICT') {
    return res.status(409).json({ error: { code: 'CONFLICT', message: err.message, details: [] } });
  }

  if (err && err.code === 'FORBIDDEN') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: err.message, details: [] } });
  }

  if (err && err.code === 'NOT_FOUND') {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: err.message, details: [] } });
  }

  return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro interno do servidor.', details: [] } });
}

module.exports = { errorHandler };
