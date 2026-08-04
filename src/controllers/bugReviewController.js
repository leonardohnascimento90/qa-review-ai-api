const { getRepository, uuidv4 } = require('../repositories');
const { validateBugReviewPayload, normalizeBugReviewPayload } = require('../validators/bugReviewValidator');
const { analyzeBugWithAi } = require('../services/aiService');
const { calculateQualityScore } = require('../services/qualityScoreService');
const { evaluateSeverity, buildSeverityJustification } = require('../services/severityService');
const BugReview = require('../models/bugReview');

async function createBugReview(req, res, next) {
  try {
    const normalizedPayload = normalizeBugReviewPayload(req.body);
    const errors = validateBugReviewPayload(normalizedPayload);
    if (errors.length) {
      const error = new Error('Dados inválidos');
      error.code = 'VALIDATION_ERROR';
      error.details = errors;
      throw error;
    }

    const repository = getRepository();
    const aiResult = await analyzeBugWithAi(normalizedPayload);

    if (!aiResult || typeof aiResult !== 'object') {
      const error = new Error('Resposta da IA inválida.');
      error.code = 'AI_RESPONSE_INVALID';
      throw error;
    }

    const severity = aiResult.severity || evaluateSeverity(normalizedPayload);
    const severityJustification = aiResult.severityJustification || buildSeverityJustification(normalizedPayload).justification;
    const qualityScore = Number.isInteger(aiResult.qualityScore) ? aiResult.qualityScore : calculateQualityScore(normalizedPayload);

    const review = new BugReview({
      id: uuidv4(),
      userId: req.user.id,
      title: aiResult.title || normalizedPayload.title || 'Bug revisado',
      summary: aiResult.summary || normalizedPayload.description,
      stepsToReproduce: aiResult.stepsToReproduce || normalizedPayload.stepsToReproduce,
      expectedResult: aiResult.expectedResult || normalizedPayload.expectedResult,
      actualResult: aiResult.actualResult || normalizedPayload.actualResult,
      environment: normalizedPayload.environment,
      browser: normalizedPayload.browser,
      operatingSystem: normalizedPayload.operatingSystem,
      device: normalizedPayload.device,
      frequency: normalizedPayload.frequency,
      blocksEssentialFunction: normalizedPayload.blocksEssentialFunction,
      hasAlternativeFlow: normalizedPayload.hasAlternativeFlow,
      hasDataLoss: normalizedPayload.hasDataLoss,
      hasFinancialRisk: normalizedPayload.hasFinancialRisk,
      hasSecurityRisk: normalizedPayload.hasSecurityRisk,
      scope: normalizedPayload.scope,
      evidence: normalizedPayload.evidence,
      severity,
      severityJustification,
      category: aiResult.category || 'Bug funcional',
      risksIdentified: aiResult.risksIdentified || [],
      missingInformation: aiResult.missingInformation || [],
      complementaryQuestions: aiResult.complementaryQuestions || [],
      qualityScore,
    });

    repository.createBugReview(review);
    return res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}

function listBugReviews(req, res, next) {
  try {
    const repository = getRepository();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const { severity, category, userId, startDate, endDate } = req.query;
    let reviews = repository.listBugReviews();

    if (req.user.role !== 'admin') {
      reviews = reviews.filter((review) => review.userId === req.user.id);
    }

    if (severity) {
      reviews = reviews.filter((review) => review.severity === severity);
    }
    if (category) {
      reviews = reviews.filter((review) => review.category === category);
    }
    if (userId && req.user.role === 'admin') {
      reviews = reviews.filter((review) => review.userId === userId);
    }
    if (startDate) {
      reviews = reviews.filter((review) => review.createdAt >= startDate);
    }
    if (endDate) {
      reviews = reviews.filter((review) => review.createdAt <= endDate);
    }

    const total = reviews.length;
    const paginated = reviews.slice((page - 1) * limit, page * limit);
    return res.status(200).json({ page, limit, total, items: paginated });
  } catch (error) {
    next(error);
  }
}

function getBugReviewById(req, res, next) {
  try {
    const repository = getRepository();
    const review = repository.findBugReviewById(req.params.id);
    if (!review) {
      const error = new Error('Análise de bug não encontrada.');
      error.code = 'NOT_FOUND';
      throw error;
    }
    if (req.user.role !== 'admin' && review.userId !== req.user.id) {
      const error = new Error('Sem permissão para acessar esta análise.');
      error.code = 'FORBIDDEN';
      throw error;
    }
    return res.status(200).json(review);
  } catch (error) {
    next(error);
  }
}

module.exports = { createBugReview, listBugReviews, getBugReviewById };
