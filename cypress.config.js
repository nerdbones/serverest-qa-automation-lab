const { defineConfig } = require('cypress')
const fs = require('fs')

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

    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      on('after:spec', (_spec, results) => {
        if (
          results &&
          results.video &&
          results.stats.failures === 0 &&
          fs.existsSync(results.video)
        ) {
          fs.unlinkSync(results.video)
        }
      })

      return config
    },
  },
})
