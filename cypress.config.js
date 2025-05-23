import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Ruta para los tests
    viewportWidth: 1440,
    viewportHeight: 1200,
  },
});
