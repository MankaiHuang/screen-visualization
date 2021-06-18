module.exports = {
  testURL: 'http://localhost:8000',
  preset: 'jest-puppeteer',
  extraSetupFiles: ['./tests/setupTests.js'],
  globals: {
    localStorage: null,
  },
};
