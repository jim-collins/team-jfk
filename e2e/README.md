# End-to-end tests (Playwright)

Browser tests for the whole service, in TypeScript, using the Page Object Model.
Vitest (in `tests/`) still covers the eligibility rules and renders pages with axe; Playwright covers what only a real browser shows: navigation, focus, page titles, reloads and layout at 320px.

## Setup

From the project root, after cloning or pulling:

```bash
npm install                              # installs @playwright/test and TypeScript
npx playwright install chromium firefox  # downloads the browsers (once per machine)
```

## Running

| Command | What it does |
|---|---|
| `npm run test:e2e` | Builds the app, serves it on port 4173 and runs every test in Chromium, Firefox and a 320px-wide Chromium |
| `npm run test:e2e -- --project=chromium` | One browser only |
| `npm run test:e2e -- -g "validation"` | Tests whose name matches |
| `npm run test:e2e -- --ui` | Watch tests run, step by step |
| `npm run test:e2e:report` | Opens the HTML report from the last run |
| `npm run typecheck:e2e` | Type-checks the tests (Playwright itself doesn't) |

### Environments

Set `TEST_ENV` (default `local`). `BASE_URL` overrides the address for any of them.

| `TEST_ENV` | Address | Starts the app? |
|---|---|---|
| `local` | `http://localhost:4173` (production build via `vite preview`) | Yes |
| `test` | `https://app-lab11126.labs.decoded.com` (start the dev server first, see `CLAUDE.md`) | No |
| `production` | none yet: `BASE_URL` is required | No |

```bash
TEST_ENV=test npm run test:e2e
TEST_ENV=production BASE_URL=https://example.service.gov.uk npm run test:e2e
```

### When a test fails

`test-results/<test>/` holds a screenshot (`test-failed-1.png`) and a trace (`trace.zip`).
Open the trace with `npx playwright show-trace test-results/<test>/trace.zip`, or from the HTML report, to step through every action with the DOM, network and console.

## Layout

```
playwright.config.ts      browsers, reporters, screenshots/traces, local web server
e2e/
  config/environments.ts  local / test / production addresses
  data/                   expected text from spec.md: questions, answers, outcomes, reasons
  components/             parts used on several pages (error summary, radios, summary list, cookie banner, page template)
  pages/                  one class per page, all extending BasePage
  fixtures/               test.ts (page objects as fixtures) and journey.ts (click through the service)
  tests/                  *.spec.ts, grouped by behaviour
```

## Rules

1. **Selectors live only in `components/` and `pages/`.** Specs never call `page.locator` or `page.getByRole`; they use page objects. If a spec needs a new element, add it to the page object.
2. **Selector order:** `data-testid` (via `getByTestId`) if the app has one → role and accessible name (`getByRole('button', { name: 'Continue' })`) → label or text → a GOV.UK Frontend class (`.govuk-error-summary`) only when nothing has a role. The app has no `data-testid` attributes today: GOV.UK markup is fully labelled, so roles are stable and also check that a screen reader gets the right name. Add a `data-testid` only for something with no accessible name.
3. **Expected text comes from `e2e/data/`, written from `spec.md`, not imported from `src/`.** If the app's wording drifts from the spec, the tests should fail.
4. **Import `test` and `expect` from `fixtures/test.ts`**, not `@playwright/test`, so every test gets the page objects.
5. **Answers live only in memory.** `page.goto` reloads the app and clears them, so use `journey.answerUntil()` / `journey.answerAll()` to reach a page with answers, and `goto` only to test what happens without them.
6. **Use web-first assertions** (`await expect(locator).toBeVisible()`), never fixed waits. Playwright retries them until they pass or time out.
7. **Assertions that describe a GOV.UK pattern belong to the component** (`ErrorSummary.expectShowing`, `RadioGroup.expectError`), so the pattern is defined once and every page checks it the same way.
8. **Keep types tight:** `Answers` only accepts real option labels for each question, so a typo is a compile error. Run `npm run typecheck:e2e` before pushing.
9. **One behaviour per test**, named for what the user sees. Loop over `questionOrder` or `scenarios` rather than copying tests.
