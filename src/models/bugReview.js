class BugReview {
  constructor({ id, userId, title, summary, stepsToReproduce, expectedResult, actualResult, environment, browser, operatingSystem, device, frequency, blocksEssentialFunction, hasAlternativeFlow, hasDataLoss, scope, hasFinancialRisk, hasSecurityRisk, evidence, severity, severityJustification, category, risksIdentified, missingInformation, complementaryQuestions, qualityScore, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.summary = summary;
    this.stepsToReproduce = stepsToReproduce;
    this.expectedResult = expectedResult;
    this.actualResult = actualResult;
    this.environment = environment;
    this.browser = browser;
    this.operatingSystem = operatingSystem;
    this.device = device;
    this.frequency = frequency;
    this.blocksEssentialFunction = blocksEssentialFunction;
    this.hasAlternativeFlow = hasAlternativeFlow;
    this.hasDataLoss = hasDataLoss;
    this.scope = scope;
    this.hasFinancialRisk = hasFinancialRisk;
    this.hasSecurityRisk = hasSecurityRisk;
    this.evidence = evidence;
    this.severity = severity;
    this.severityJustification = severityJustification;
    this.category = category;
    this.risksIdentified = risksIdentified;
    this.missingInformation = missingInformation;
    this.complementaryQuestions = complementaryQuestions;
    this.qualityScore = qualityScore;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = BugReview;
