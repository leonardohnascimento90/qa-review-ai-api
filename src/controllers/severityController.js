const { getRepository, uuidv4 } = require('../repositories');
const SeverityCriterion = require('../models/severityCriterion');
const { validateSeverityPayload } = require('../validators/severityValidator');

function listSeverities(req, res, next) {
  try {
    const repository = getRepository();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const criteria = repository.listSeverityCriteria();
    const paginated = criteria.slice((page - 1) * limit, page * limit);
    return res.status(200).json({ page, limit, total: criteria.length, items: paginated });
  } catch (error) {
    next(error);
  }
}

function createSeverity(req, res, next) {
  try {
    const errors = validateSeverityPayload(req.body);
    if (errors.length) {
      const error = new Error('Dados inválidos');
      error.code = 'VALIDATION_ERROR';
      error.details = errors;
      throw error;
    }

    const repository = getRepository();
    const criterion = new SeverityCriterion({ id: uuidv4(), ...req.body });
    repository.createSeverityCriterion(criterion);
    return res.status(201).json(criterion);
  } catch (error) {
    next(error);
  }
}

function updateSeverity(req, res, next) {
  try {
    const repository = getRepository();
    const criterion = repository.findSeverityCriterionById(req.params.id);
    if (!criterion) {
      const error = new Error('Critério de severidade não encontrado.');
      error.code = 'NOT_FOUND';
      throw error;
    }
    const updated = repository.updateSeverityCriterion(req.params.id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = { listSeverities, createSeverity, updateSeverity };
