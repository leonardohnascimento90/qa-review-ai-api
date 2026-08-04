const MemoryRepository = require('./memoryRepository');
const { buildSeedData } = require('../services/seedData');
const { v4: uuidv4 } = require('uuid');

let repositoryInstance;

function initializeRepository() {
  if (!repositoryInstance) {
    const seedData = buildSeedData();
    repositoryInstance = new MemoryRepository(seedData);
  }
  return repositoryInstance;
}

function getRepository() {
  return initializeRepository();
}

function resetRepository() {
  repositoryInstance = new MemoryRepository(buildSeedData());
  return repositoryInstance;
}

module.exports = { initializeRepository, getRepository, resetRepository, uuidv4 };
