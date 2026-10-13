# Project context
This is a GOV.UK service: "Check if you can get a Green Home Grant". All UI must follow the GOV.UK Design System.
Read `intent.md`, `spec.md` and `plan.md` before changing anything.

## Commands (run in ~/Documents/my-work/w03-hackathon)
- Dev server, as the lab proxy expects (the `app-` address always goes to port 5000, at the root path):
  `VITE_PORT=5000 VITE_PUBLIC_HOSTNAME=app-lab11126.labs.decoded.com npm run dev`
  then open https://app-lab11126.labs.decoded.com/ (not `/proxy/5002/`).
  `➜  Local:   http://localhost:5000/`
- `npm test`: Vitest, runs once
  `Tests  58 passed (58)`
- `npm run test:e2e`: Playwright end-to-end tests (builds and serves the app itself on port 4173). See `e2e/README.md`.
  `219 passed`
- `npm run build && npm run preview`: production build, used for Lighthouse
- Contrast and axe in real Chrome, after `npm test` and `npm run build`:
  `~/.claude/skills/new-project/scripts/lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css`
  `RESULT: PASS`

## Conventions
- Use GOV.UK Frontend classes (`govuk-frontend.min.css`, imported in `src/main.jsx`). No custom colours. No GOV.UK Frontend JavaScript.
  Fonts and images are copied into `public/assets/`.
- One question per page. Continue button, Back link to an explicit previous page (not browser history).
- Summary list is a <dl> with govuk-summary-list classes.
- Error summary: role="alert", heading "There is a problem", links to each field in error.
- Every input has a <label>. Do not add features we did not ask for.
- All answers live in one object in `App` (useState). The eligibility rules live only in `src/utils/eligibility.js`.
- Links between pages use React Router `Link`, so the in-memory answers aren't lost.
- No inline `style=`, no `<style>` or `<script>` blocks.
- Never change the `server` section of `vite.config.js`. Test settings are in `vitest.config.js`.
- Tests that render a page run axe (`tests/helpers.jsx`) and save the page to `tests/pages/` for the contrast check.
- Playwright tests: selectors only in `e2e/components/` and `e2e/pages/`; expected text in `e2e/data/`, from the spec, not imported from `src/`.
- Never run code from `readwrite-classroom/`: it is a network drive and npm cannot install there.

## Common mistakes
- In tests, text that appears in more than one place (e.g. in the accessibility statement) needs `getAllByText`, not `getByText`, which fails on more than one match.
