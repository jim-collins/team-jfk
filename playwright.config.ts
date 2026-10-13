import { defineConfig, devices } from '@playwright/test';
import { localServer, resolveEnvironment } from './e2e/config/environments';

const environment = resolveEnvironment();
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI && { workers: 1 }),
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  outputDir: 'test-results',

  use: {
    baseURL: environment.baseURL,
    testIdAttribute: 'data-testid',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // Spec requirement 35: pages reflow at 320px wide.
    { name: 'mobile-320', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } } },
  ],

  // Only "local" starts the app; "test" and "production" are already running.
  ...(environment.startsLocalServer && {
    webServer: { command: localServer.command, url: localServer.url, reuseExistingServer: !isCI, timeout: 120_000 },
  }),
});
