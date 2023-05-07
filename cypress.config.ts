import { defineConfig } from "cypress";

export default defineConfig({
    viewportHeight: 1080,
    viewportWidth: 1920,
    retries: {
        runMode: 2,
        openMode: 0
    },
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
        configFile: 'reporter-config.json',
    },
    env: {
        email: '',
        password: '',
        apiBaseUrl: 'https://api.realworld.io'
    },
    e2e: {
        baseUrl: 'http://localhost:4200',
        specPattern: 'cypress/e2e/**/*.spec.{ts,tsx}',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
