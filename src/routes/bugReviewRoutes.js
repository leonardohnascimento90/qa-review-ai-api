const express = require('express');
const { createBugReview, listBugReviews, getBugReviewById } = require('../controllers/bugReviewController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, createBugReview);
router.get('/', authenticateToken, listBugReviews);
router.get('/:id', authenticateToken, getBugReviewById);

module.exports = router;
