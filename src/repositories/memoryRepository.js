class MemoryRepository {
  constructor(initialData = {}) {
    this.users = new Map();
    this.severityCriteria = new Map();
    this.bugReviews = new Map();
    this.seed(initialData);
  }

  seed(initialData) {
    if (initialData.users) {
      for (const user of initialData.users) {
        this.users.set(user.id, user);
      }
    }
    if (initialData.severityCriteria) {
      for (const criterion of initialData.severityCriteria) {
        this.severityCriteria.set(criterion.id, criterion);
      }
    }
    if (initialData.bugReviews) {
      for (const review of initialData.bugReviews) {
        this.bugReviews.set(review.id, review);
      }
    }
  }

  createUser(user) {
    this.users.set(user.id, user);
    return user;
  }

  listUsers() {
    return Array.from(this.users.values());
  }

  findUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email) || null;
  }

  findUserById(id) {
    return this.users.get(id) || null;
  }

  createSeverityCriterion(criterion) {
    this.severityCriteria.set(criterion.id, criterion);
    return criterion;
  }

  listSeverityCriteria() {
    return Array.from(this.severityCriteria.values());
  }

  findSeverityCriterionById(id) {
    return this.severityCriteria.get(id) || null;
  }

  updateSeverityCriterion(id, updates) {
    const existing = this.severityCriteria.get(id);
    if (!existing) {
      return null;
    }
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.severityCriteria.set(id, updated);
    return updated;
  }

  createBugReview(review) {
    this.bugReviews.set(review.id, review);
    return review;
  }

  listBugReviews() {
    return Array.from(this.bugReviews.values());
  }

  findBugReviewById(id) {
    return this.bugReviews.get(id) || null;
  }
}

module.exports = MemoryRepository;
