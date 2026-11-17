const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const URL = '/widgets/newsletter-signup-cta/preview.html';

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test('renders heading and a real link', async ({ page }) => {
  const widget = page.locator('.vpm-nlcta').first();
  await expect(widget.getByRole('heading', { level: 2 })).toBeVisible();
  await expect(widget.getByRole('link')).toHaveAttribute(
    'href',
    'https://www.vpm.org/stay-connected-to-what-matters'
  );
});

test('link is reachable by keyboard and shows a focus ring', async ({ page }) => {
  const link = page.locator('.vpm-nlcta__link').first();
  await link.focus();
  await expect(link).toBeFocused();
  const outline = await link.evaluate((el) => {
    const s = getComputedStyle(el);
    return { outline: s.outlineStyle, shadow: s.boxShadow };
  });
  const hasRing = outline.outline !== 'none' || outline.shadow !== 'none';
  expect(hasRing, `no focus indicator: ${JSON.stringify(outline)}`).toBe(true);
});

test('no horizontal overflow', async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('axe: no WCAG A/AA violations in the widget', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .include('.vpm-nlcta')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) - ${v.help}`
  );
  expect(summary, summary.join('\n')).toEqual([]);
});
