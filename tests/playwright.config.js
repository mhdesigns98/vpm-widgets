// Widget checks: render in Chromium at desktop + mobile, then run axe.
// Serves the repo root so widget previews load by relative path.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './specs',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'python3 -m http.server 4173 --directory ..',
    url: 'http://localhost:4173/widgets/newsletter-signup-cta/preview.html',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
