import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'npx vite --config apps/front-end/vite.config.mts --host localhost --port 4300',
        production: 'npx vite --config apps/front-end/vite.config.mts --host localhost --port 4300',
      },
      ciWebServerCommand: 'npx vite --config apps/front-end/vite.config.mts --host localhost --port 4300',
      ciBaseUrl: 'http://localhost:4300',
    }),
    baseUrl: 'http://localhost:4300',
  },
});
