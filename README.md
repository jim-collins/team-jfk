# Check if you can get a Green Home Grant

A GOV.UK-style service that tells homeowners whether they are likely to get a Green Home Grant towards insulation or a heat pump. It replaces a phone call that used to take an average of 35 minutes.

The service is an **Alpha** prototype. It has no backend, so answers are kept only in the browser's memory and are lost on reload.

## How it works

The user answers five questions, one per page, checks their answers, and gets a result.

| Question | Answers | Effect |
|---|---|---|
| What type of property do you live in? | House, Flat, Bungalow | All eligible |
| Do you own your home outright or with a mortgage? | Own outright, Own with a mortgage | Both eligible |
| What is your household income? | Up to £30,000 · £30,001 to £50,000 · Over £50,000 | Eligible · partial · not eligible |
| What insulation does your home already have? | None · Loft only · Walls only · Loft and walls | Eligible · partial · partial · not eligible |
| How is your home currently heated? | Gas boiler, Oil boiler · Electric heating · Heat pump | Eligible · partial · not eligible |

Any "not eligible" answer makes the result **not eligible**. Otherwise, any "partial" answer makes it **partially eligible**. Otherwise the result is **eligible**. The result page lists the reason for every answer that lowered the result, says what to do next, and has a **Close** button that clears the answers and returns to the start page.

Pages:

| Page | Address |
|---|---|
| Start | `/` |
| The five questions | `/property-type`, `/ownership`, `/income`, `/insulation`, `/heating` |
| Check your answers (with Change links) | `/check-answers` |
| Result | `/result` |
| Cookies | `/cookies` |
| Accessibility statement | `/accessibility-statement` |

Opening a later page directly, or reloading, sends the user to the first unanswered question.

It follows the GOV.UK Design System (GOV.UK Frontend styles, no GOV.UK Frontend JavaScript) and aims to meet WCAG 2.2 AA. Every page has an error pattern where needed, a skip link, an Alpha phase banner, a cookie banner and a footer.

## Built with

- React 18 and React Router 6, built with Vite 5
- [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) for styles, fonts and images
- Vitest 1, Testing Library and axe-core for unit and page tests
- Playwright (TypeScript) for end-to-end tests

## Running the app

You need Node.js 18 or later and npm.

```bash
npm install
npm run dev
```

The dev server listens on port 5002: open http://localhost:5002/.

In the lab, the proxy expects port 5000 and the lab hostname:

```bash
VITE_PORT=5000 VITE_PUBLIC_HOSTNAME=app-lab11126.labs.decoded.com npm run dev
```

Then open https://app-lab11126.labs.decoded.com/.

For a production build:

```bash
npm run build      # writes dist/
npm run preview    # serves dist/ on http://localhost:4173/
```

## Running the tests

After cloning or pulling (run these again whenever `package.json` changes):

```bash
npm install                              # project dependencies, including Playwright
npx playwright install chromium firefox  # browsers for the end-to-end tests (once per machine)
```

| Command | What it runs |
|---|---|
| `npm test` | Vitest: eligibility rules, and every page and error state rendered and checked with axe |
| `npm run test:e2e` | Playwright end-to-end tests in Chromium, Firefox and at 320px wide. Builds and serves the app itself on port 4173, so no dev server is needed |
| `npm run test:e2e -- --project=chromium` | End-to-end tests in one browser only |
| `npm run test:e2e:report` | Opens the HTML report from the last end-to-end run (screenshots and traces of any failures) |
| `npm run typecheck:e2e` | Type-checks the TypeScript end-to-end tests |

To run the end-to-end tests against the lab dev server instead, start it (above) and run `TEST_ENV=test npm run test:e2e`. See [`e2e/README.md`](e2e/README.md) for environments, debugging failures and how the tests are organised.

## Project layout

```
src/
  App.jsx             answers state, routes, page shell
  questions.js        the five questions, answers and error messages
  service.js          the service name
  utils/eligibility.js  the eligibility rules (the only place they live)
  pages/              start, check answers, result, cookies, accessibility statement
  components/         GOV.UK components: question page, radios, error summary, header, footer, banners
tests/                Vitest tests
e2e/                  Playwright tests (page objects, fixtures, specs)
```

## Project documents

- [`intent.md`](intent.md): the problem, who it is for and what is in scope
- [`spec.md`](spec.md): numbered requirements and decisions
- [`plan.md`](plan.md): the build plan
- [`done.md`](done.md): automated results and manual checks
- [`AI_LOG.md`](AI_LOG.md): how AI was used to build it
- [`CLAUDE.md`](CLAUDE.md): conventions for working on the code with Claude Code
- [`ONBOARDING.md`](ONBOARDING.md): onboarding guide for new teammates using Claude Code
