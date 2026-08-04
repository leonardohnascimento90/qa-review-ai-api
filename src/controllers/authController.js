const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('../config/env');
const { getRepository } = require('../repositories');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const repository = getRepository();
    const user = repository.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Credenciais inválidas.', details: [] } });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Credenciais inválidas.', details: [] } });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, env.jwtSecret, { expiresIn: '8h' });

    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
