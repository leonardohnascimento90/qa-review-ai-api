const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { getRepository } = require('../repositories');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado.', details: [] } });
  }

  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token inválido.', details: [] } });
    }
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  });
}

function getAuthenticatedUser(req) {
  const repository = getRepository();
  return repository.findUserById(req.user.id);
}

module.exports = { authenticateToken, getAuthenticatedUser };
