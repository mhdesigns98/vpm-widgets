# Widget tests

Playwright + axe checks. Currently covers `newsletter-signup-cta` only; copy
`specs/newsletter-signup-cta.spec.js` and change `URL` and the selectors to add a widget.

```
cd tests
npm install
npx playwright install chromium   # first time only
npm test
```

Each spec runs at desktop and mobile (Pixel 7) and checks: content renders, keyboard focus
ring, no horizontal overflow, and axe WCAG A/AA violations. This supplements `/ship`; it
does not replace the CMS harness checks.
