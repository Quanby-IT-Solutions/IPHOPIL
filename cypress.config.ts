// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Load environment variables
      config.env = {
        ...config.env,
        USER_EMAIL: process.env["CYPRESS_USER_EMAIL"] || 'test@example.com',
        USER_PASSWORD: process.env["CYPRESS_USER_PASSWORD"] || 'password123'
      };
      return config;
    },
  },
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});
