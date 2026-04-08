import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'npx nx run @teddy-open-finance/front-end:dev',
        production: 'npx nx run @teddy-open-finance/front-end:preview',
      },
      ciWebServerCommand: 'npx nx run @teddy-open-finance/front-end:preview',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
