# Plan: Green Home Grant eligibility checker

## Context

Build the Green Home Grant eligibility checker described in `intent.md` and `spec.md` (39 requirements). It's a React + Vite app styled with GOV.UK Frontend, built on the starter in the project folder (`team-JFK/starter`). The app files stay at the project root, as the spec decides, so the Files lines below point at `src/` rather than `app/`. Each step is checked by the user before the next one starts.

Two points were confirmed while planning, so the spec stays as written: the Check your answers button says **"Check eligibility"** (the starter's TODO said "Accept and continue"), and **all three outcomes use the green panel**.

## Provisional answers

| Open question | What the build uses until it's answered |
|---|---|
| 1. Can the app run from `readwrite-classroom/`? | **Settled in step 1:** no (`npm install` failed with ENOTSUP). The user chose to move the project to `~/Documents/my-work/w03-hackathon/`. |

## Pages and error states (each one is checked by axe)

| # | Page | States |
|---|---|---|
| 1 | Start `/` | cookie notice shown; cookie notice hidden |
| 2 | Property type `/property-type` | normal; error |
| 3 | Ownership `/ownership` | normal; error |
| 4 | Income `/income` | normal; error |
| 5 | Insulation `/insulation` | normal; error |
| 6 | Heating `/heating` | normal; error |
| 7 | Check your answers `/check-answers` | normal |
| 8 | Result `/result` | eligible; partial (one reason); not eligible (several reasons) |
| 9 | Accessibility statement `/accessibility-statement` | normal |

That's 17 states in all. The tests save each state's HTML to `tests/pages/<name>.html` (gitignored).

**How each check runs:**
- **axe in the tests:** Vitest + jsdom + axe-core, with `color-contrast` switched off, because jsdom can't compute colours.
- **Contrast:** after `npm run build`, run `~/.claude/skills/new-project/scripts/lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css`. "axe finds no violations" in a Check below means both of these pass, and the second one doesn't report INCOMPLETE.

## Steps

### Step 1: Set up GOV.UK Frontend, the test runner and the page shell

- **Files:**
  - `CLAUDE.md`, `.gitignore`, `package.json`, `vitest.config.js` (new), `index.html`
  - `src/main.jsx`, `src/App.jsx`, `src/App.css`
  - `src/components/GovukHeader.jsx`, `PhaseBanner.jsx`, `GovukFooter.jsx`, `SkipLink.jsx` (new), `CookieBanner.jsx` (new)
  - `public/assets/` (copied from govuk-frontend)
  - `tests/setup.js`, `tests/helpers.jsx` (render a route, run axe, save the page), `tests/layout.test.jsx`
  - `src/utils/focus.js` (new: moves focus the way GOV.UK Frontend's skip link does; used by the skip link and the cookie notice)
- **What will be done:**
  - `npm install` the existing dependencies first, to settle open question 1.
  - Install `govuk-frontend`, plus `vitest@1`, `jsdom`, `@testing-library/react`, `@testing-library/user-event` and `axe-core`.
  - Add `"test": "vitest run"` to `package.json`.
  - Put the test config in a separate `vitest.config.js`, so the server section of `vite.config.js` is never touched.
  - Import `govuk-frontend.min.css` in `main.jsx`, copy its fonts and images to `public/assets/`, and remove the hand-written GOV.UK styles from `App.css` (keep it, empty, for anything left over).
  - Add `govuk-template` and `govuk-template__body` to `index.html`. *(`govuk-frontend-supported` was removed in review: it means GOV.UK Frontend's JavaScript has run, and this app loads none.)*
  - In `App`: add the skip link, the GOV.UK Frontend header markup, the Alpha phase banner (feedback link `#`), the footer linking to the accessibility statement through a router `Link`, and the cookie notice ("This service uses only essential cookies" with a "Hide this message" button, held in React state).
  - Fix the starter's nested `<main>` in `AccessibilityStatementPage`.
  - Update the project `CLAUDE.md`:
    - Replace the App.css line with "Use GOV.UK Frontend classes".
    - Add the run and test commands with example output, and the conventions: answers live in one object in `App`, the rules live in `src/utils/eligibility.js`, links use router `Link`, there's no inline `style=`, and `vite.config.js` server section is not to be touched.
    - Add an empty "Common mistakes" list.
  - Add `node_modules/`, `dist/` and `tests/pages/` to `.gitignore`.
- **Risks:**
  - The app may not run from `readwrite-classroom/` at all.
  - GOV.UK Frontend's CSS points to `/assets/...` for fonts and images, so a wrong copy path means 404s and fallback fonts.
  - The dev server could break if `vite.config.js` is changed by mistake.
- **Check:**
  - `npm test` passes the layout tests: the skip link is the first focusable element, and the phase banner, footer link and cookie notice are present. Hiding the cookie notice removes it.
  - axe finds no violations on the start page with the cookie notice shown and hidden.
  - The skip link stays first and the cookie notice comes straight after it. GOV.UK guidance puts the cookie banner first, but spec requirement 26 says the skip link is the first thing reached. Hiding the notice moves focus to the main content.
  - `VITE_PORT=5000 VITE_PUBLIC_HOSTNAME=app-lab11126.labs.decoded.com npm run dev`: the user opens `https://app-lab11126.labs.decoded.com/` (found in step 1: the `app-` address always goes to port 5000; `/proxy/5002/` does not pick the port) and sees the GOV.UK header, banner, footer and cookie notice in the GDS font, with no 404s in the DevTools Network tab.

### Step 2: The eligibility rules, tests first

- **Files:** `src/utils/eligibility.test.js` (written first), then `src/utils/eligibility.js`
- **What will be done:**
  - The tests come first, with expected results taken straight from spec requirements 14 to 18 and the reason wording in `intent.md`:
    - an all-eligible case
    - a not-eligible case
    - a partial case
    - the £30,000 and £50,000 boundaries (as answer values for the band labels)
    - several reasons listed together, for example over £50,000 + heat pump + loft only gives not eligible with 3 reasons
    - "not eligible" beating "partial"
  - Run the tests and show them failing.
  - Then write `checkEligibility(answers)`, which returns `{ status: 'eligible' | 'partial' | 'not-eligible', reasons: string[] }`, and run the tests again to show them passing.
  - Answer values and labels for all five questions go in one `src/questions.js`, so the pages, the summary and the rules share them.
- **Risks:**
  - A reason's wording drifts from what was approved in `intent.md`.
  - The order of the reasons isn't defined. They'll be listed in question order.
- **Check:** `npm test` shows at least 7 tests passing in `eligibility.test.js`, and each expected result matches the spec. The user reads the test names and expected values.

### Step 3: Start page and the five question pages, with validation

- **Files:**
  - `src/App.jsx` (answers state, page titles, focus on page change)
  - `src/pages/StartPage.jsx`
  - `src/components/QuestionPage.jsx` (new, shared by all five questions)
  - ~~`src/pages/PropertyTypePage.jsx` … `HeatingPage.jsx` (thin wrappers)~~ *Removed in review: `App.jsx` now builds the five question routes from `src/questions.js`.*
  - `src/components/ErrorSummary.jsx` (new), `src/components/GovukButton.jsx` (reused for Continue), `src/utils/usePageTitle.js` (new)
  - `tests/questions.test.jsx`
- **What will be done:**
  - Start page: the heading, the description, "You must own your home to use this service", and a Start now button (a router `Link` styled as `govuk-button--start`).
  - Question pages: a fieldset with the question as an `h1` legend, radios with labels, the income hint, a Continue button, and a Back link to an explicit previous page.
  - Continue saves the answer to `App` state and moves on, or returns to `/check-answers` when the page was opened from Change (`?change=1`).
  - Validation:
    - an error summary with `role="alert"`, the heading "There is a problem", and a link to the first radio
    - an inline error with the same message
    - focus moves to the summary, and the title gets an "Error: " prefix
  - The spec's tab title for every page (`src/utils/usePageTitle.js`). After each page change, focus moves to the top of the page (`<body>`, so Tab reaches the skip link first) and a visually hidden `aria-live` region reads out the new title. *(Changed during the build: a focusable hidden title element failed axe's `region` rule, because it sat outside every landmark.)*
  - Redirect to the first unanswered question (requirement 13), as a guard in `App`.
- **Risks:**
  - Focus handling on page change and on errors can fight each other.
  - The error summary links are plain `#id` anchors, which React Router could intercept.
  - The guard could cause a redirect loop.
- **Check:**
  - `npm test` passes tests for requirements 1 to 8, 13 and 20 to 24, 31, 34 and 36. That covers:
    - the order of pages and their Back targets
    - an answer still selected after Back
    - each of the 5 error messages in both places
    - focus on the summary, the "Error: " title, and the summary link focusing the first radio
    - the error clearing
    - skipping ahead redirecting
  - axe finds no violations on pages 1 to 6 and all 5 error states.
  - The user tabs through Start → heating in `npm run dev`.

### Step 4: Check your answers and the result page

- **Files:** `src/pages/CheckAnswersPage.jsx`, `src/pages/ResultPage.jsx`, `tests/summary-result.test.jsx`
- **What will be done:**
  - Check your answers:
    - a `govuk-summary-list` `<dl>` with five rows
    - each row has a Change link with hidden text, for example "Change property type", going to `/<question>?change=1`
    - a Back link to `/heating`
    - a "Check eligibility" button
  - Result page:
    - calls `checkEligibility` and shows the outcome heading in a green `govuk-panel`
    - a "Why" list with every reason
    - "What to do next" in plain text (requirements 17 to 19)
- **Risks:**
  - Change could lose the other answers or fail to return to the summary.
  - The panel heading must be the page's only `h1`.
- **Check:**
  - `npm test` passes tests for requirements 9 to 12 and 17 to 19:
    - all five answers shown
    - Change returns to the summary with the other answers kept
    - each outcome's heading, reasons and next steps for the three cases
  - axe finds no violations on pages 7 and 8 (all three result states).

### Step 5: Accessibility statement, production checks and evidence

- **Files:** `src/pages/AccessibilityStatementPage.jsx`, `tests/statement.test.jsx`, `AI_LOG.md`
- **What will be done:**
  - Fill in the statement from the GOV.UK sample structure: the service name and scope, and the contact "[contact email to be confirmed]". The known gaps are the `#` feedback link, plus anything the checks below find. It also describes how the service was tested.
  - `npm run build`, then run Lighthouse on the saved pages for contrast.
  - Run Lighthouse on `npm run preview` (production build) for the addresses that can be opened directly: `/`, `/property-type` and `/accessibility-statement`. Every other page redirects without earlier answers, so the saved pages cover those.
  - Prepare `AI_LOG.md` for the team: the seeded example is replaced. Claude drafts the Task and What AI Generated fields from the commits; the team writes What You Changed + Why, because that has to be their own judgement.
- **Risks:**
  - The Lighthouse performance score on preview may dip below 90 because of the font files.
  - The statement could claim compliance that the manual checks haven't confirmed yet.
- **Check:**
  - axe finds no violations on page 9.
  - `lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css` reports accessibility 100 for all 17 states and no INCOMPLETE.
  - `lighthouse-pages.sh` on the 3 preview addresses reports accessibility 100 and performance at least 90.
  - The full `npm test` passes.

## Riskiest step

**Step 1.** Whether the project can run at all from `readwrite-classroom/` is unknown, and the pack says it can't. GOV.UK Frontend's absolute `/assets/` font paths also have to work in dev, in the built CSS and in the saved pages. If either fails, every later check is either blocked or INCOMPLETE.

## Final check (the user, in a browser, on `npm run build && npm run preview`)

1. **Walk every requirement:**
   - an eligible journey end to end (house, outright, up to £30,000, none, gas)
   - a not-eligible journey with several reasons
   - a partial journey
   - every error message
   - Change from the summary
   - reloading mid-journey (sent back to the first unanswered question)
   - the cookie notice, the banner, the footer and the statement
   - `npm test` passing
2. **Manual accessibility checklist, filled in for this app:**
   1. **Keyboard:**
      - Tab through Start → Property type → … → Heating → Check your answers → Result, and the statement.
      - Space selects a radio, and the arrow keys move between radios.
      - Each error summary link focuses its first radio.
      - Focus is visible throughout and starts at the top of each new page.
      - The cookie "Hide this message" button works from the keyboard.
   2. **Screen reader (Orca on Linux):**
      - Each page is announced by its title.
      - The error summary is read when it appears.
      - Each radio group is read with its question, and income with its hint.
      - Change links read as "Change property type" and so on.
   3. **Zoom and reflow:** 200% and 400% (320px) on all 9 pages and an error state, plus a text-spacing bookmarklet.
   4. **Contrast the tools don't measure:** radio borders, the yellow focus ring, the Start now arrow, and the green panel text.
   5. **WCAG 2.2:**
      - The cookie notice never hides the focused element.
      - Change and Back links are at least 24×24px.
      - No answer is asked for twice.
      - Authentication doesn't apply, because there's no login.
   6. **Content:** each tab title, each error message, link and button text, plain English.
3. The results go in `done.md`.

## Coverage against `spec.md`

| Requirements | Delivered in | Checked in |
|---|---|---|
| 1–8, 13, 20–24, 31, 34, 36 | Step 3 | Step 3 tests, final check |
| 9–12, 17–19 | Step 4 | Step 4 tests, final check |
| 14–16 | Step 2 | Step 2 tests |
| 25–28, 30 | Step 1 | Step 1 tests and browser check |
| 29 | Step 5 | Step 5 axe, final check |
| 32 | Steps 1, 3, 4, 5 | axe in each step, plus Lighthouse in step 5 |
| 33, 35 | Steps 3, 4 | manual checklist (keyboard, zoom) |
| 37 | Step 2 | `npm test` |
| 38 | Step 5 | Lighthouse on preview |
| 39 | Step 5 (draft) | Completed by the team, final check |

Every requirement is delivered by a step and covered by a check. Requirement 39 depends on the team writing the "What You Changed + Why" field themselves.
