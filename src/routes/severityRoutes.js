const express = require('express');
const { listSeverities, createSeverity, updateSeverity } = require('../controllers/severityController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/authorizationMiddleware');
const router = express.Router();

router.get('/', authenticateToken, listSeverities);
router.post('/', authenticateToken, requireRole(['admin']), createSeverity);
router.put('/:id', authenticateToken, requireRole(['admin']), updateSeverity);

module.exports = router;
