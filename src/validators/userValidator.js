function validateUserPayload(payload = {}) {
  const errors = [];

  if (typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'O nome é obrigatório.' });
  }

  if (typeof payload.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push({ field: 'email', message: 'O e-mail é inválido.' });
  }

  if (typeof payload.password !== 'string' || payload.password.length < 8) {
    errors.push({ field: 'password', message: 'A senha deve ter pelo menos 8 caracteres.' });
  }

  if (!['admin', 'analyst'].includes(payload.role)) {
    errors.push({ field: 'role', message: 'A função deve ser admin ou analyst.' });
  }

  return errors;
}

module.exports = { validateUserPayload };
