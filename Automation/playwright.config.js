const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({

  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',

  use: {

    baseURL: 'http://localhost:3000',

    headless: false,

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    trace: 'on-first-retry',

  },

  projects: [

    {
      name: 'setup',

      testMatch:
        /.*\.setup\.js/,
    },

    // login tests
    {
      name: 'chromium',

      testMatch:
        /.*login\.spec\.js/,

      use: {

        ...devices['Desktop Chrome'],

      },
    },
    // authenticated feature tests
    {
      name: 'chromium',

      testIgnore:
        /.*login\.spec\.js/,

      use: {

        ...devices['Desktop Chrome'],

        storageState:
          'playwright/.auth/user.json',

      },

      dependencies: ['setup'],
    },

  ],

});