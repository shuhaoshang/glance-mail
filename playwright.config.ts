import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:6195',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'light',
      use: { colorScheme: 'light', reducedMotion: 'no-preference' },
    },
    {
      name: 'dark',
      use: { colorScheme: 'dark', reducedMotion: 'no-preference' },
    },
    {
      name: 'light-reduced',
      use: { colorScheme: 'light', reducedMotion: 'reduce' },
    },
    {
      name: 'dark-reduced',
      use: { colorScheme: 'dark', reducedMotion: 'reduce' },
    },
  ],
  webServer: [
    {
      command: 'npm run preview -- --host 127.0.0.1 --port 6195 --strictPort',
      url: 'http://127.0.0.1:6195/glance-mail/',
      reuseExistingServer: false,
    },
    {
      command:
        'npm run preview -- --outDir storybook-static --base / --host 127.0.0.1 --port 6196 --strictPort',
      url: 'http://127.0.0.1:6196/iframe.html',
      reuseExistingServer: false,
    },
  ],
});
