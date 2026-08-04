const bcrypt = require('bcrypt');
const { getRepository, uuidv4 } = require('../repositories');
const { validateUserPayload } = require('../validators/userValidator');
const User = require('../models/user');

async function createUser(req, res, next) {
  try {
    const errors = validateUserPayload(req.body);
    if (errors.length) {
      const error = new Error('Dados inválidos');
      error.code = 'VALIDATION_ERROR';
      error.details = errors;
      throw error;
    }

    const repository = getRepository();
    const existing = repository.findUserByEmail(req.body.email);
    if (existing) {
      const error = new Error('Usuário já existe.');
      error.code = 'CONFLICT';
      throw error;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      role: req.body.role,
    });

    repository.createUser(user);
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (error) {
    next(error);
  }
}

function listUsers(req, res, next) {
  try {
    const repository = getRepository();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const users = repository.listUsers();
    const paginated = users.slice((page - 1) * limit, page * limit);
    return res.status(200).json({ page, limit, total: users.length, items: paginated });
  } catch (error) {
    next(error);
  }
}

module.exports = { createUser, listUsers };
