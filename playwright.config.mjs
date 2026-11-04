import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: 'list',
  timeout: 30000,
  use: {
    baseURL:
      process.env.SITE_URL || 'http://127.0.0.1:4173/learning-research-ko/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1050 }
      }
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' }
    }
  ],
  webServer: process.env.SITE_URL
    ? undefined
    : {
        command:
          'node node_modules/vitepress/bin/vitepress.js preview site --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173/learning-research-ko/',
        reuseExistingServer: !process.env.CI
      }
})
