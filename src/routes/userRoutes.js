const express = require('express');
const { createUser, listUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/authorizationMiddleware');
const router = express.Router();

router.post('/', authenticateToken, requireRole(['admin']), createUser);
router.get('/', authenticateToken, requireRole(['admin']), listUsers);
router.get('/' , authenticateToken, requireRole(['admin']), listUsers);

module.exports = router;
