class SeverityCriterion {
  constructor({ id, code, title, description, createdAt, updatedAt }) {
    this.id = id;
    this.code = code;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = SeverityCriterion;
