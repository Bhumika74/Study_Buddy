/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['controllers/**/*.js', 'middleware/**/*.js'],
  setupFiles: ['dotenv/config'],
  resetModules: true,
  forceExit: true,
};
