const { defineConfig } = require('cypress')

module.exports = defineConfig({
  allowCypressEnv: false,

  expose: {
    apiUrl: process.env.CYPRESS_API_URL || 'https://serverest.dev',
  },

  e2e: {
    baseUrl: process.env.CYPRESS_FRONTEND_URL || 'https://front.serverest.dev',

    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',

    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,

    viewportWidth: 1366,
    viewportHeight: 768,

    defaultCommandTimeout: 12000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    retries: {
      runMode: 1,
      openMode: 0,
    },
  },
})
