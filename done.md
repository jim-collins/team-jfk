# Done: checks and results

## Automated checks (run by Claude, 12 October 2026, commit f1a6c87)

| Check | Result |
|---|---|
| `npm test`, 7 files, 54 tests (rules, layout, questions, errors, summary, result, statement, focus) | Pass |
| axe in the tests, every page and error state (18 states; colour contrast off in jsdom) | Pass, no violations |
| `lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css`, 18 states in Chrome, including colour contrast | Pass, accessibility 100 on all 18 |
| Lighthouse on the production build (`vite preview`): `/`, `/property-type`, `/accessibility-statement` | Pass, performance 99, accessibility 100 on all 3 |
| `/code-review` (medium) | 9 findings. Fixed 7, each with a test where one made sense. #8 (focus.js clean-up) was a false positive, shown by a test. #9 (green panel for "not eligible") was kept by the user's choice. |

## Manual checks (by the user, in a browser, on the production build)

Status is one of: not yet checked, pass, or fail. Only the person who did a check can mark it as passed.

| # | Check | Status | Checked by | Date |
|---|---|---|---|---|
| 1 | Eligible journey end to end (House, Own outright, Up to £30,000, None, Gas boiler) | not yet checked | | |
| 2 | Partial journey, with its reason | not yet checked | | |
| 3 | Not-eligible journey, with several reasons | not yet checked | | |
| 4 | Every error message, with the summary link focusing the first radio | not yet checked | | |
| 5 | Change from Check your answers (including Back while changing) | not yet checked | | |
| 6 | Reload mid-journey sends you to the first unanswered question | not yet checked | | |
| 7 | Cookie notice, phase banner, footer and accessibility statement | not yet checked | | |
| 8 | Keyboard only (WCAG 2.1.1, 2.4.3, 2.4.7): the whole journey and the statement with Tab, Shift+Tab, Enter, Space and the arrow keys. Focus is always visible. After each page change Tab reaches the skip link first. Error summary links focus their radio. "Hide this message" works. Nothing traps focus. | not yet checked | | |
| 9 | Screen reader (Orca on Linux, or NVDA or VoiceOver): page titles announced, error summary read when it appears, radio groups read with their question (income with its hint), Change links read as "Change property type" and so on | not yet checked | | |
| 10 | Zoom and reflow: 200% and 400% (about 320px) on all 9 pages and one error state, plus a text-spacing bookmarklet. Nothing cut off, no sideways scrolling | not yet checked | | |
| 11 | Contrast the tools don't measure (WCAG 1.4.11): radio borders, the yellow focus ring, the Start now arrow, the panel text. At least 3:1 | not yet checked | | |
| 12 | WCAG 2.2: the cookie notice never hides the focused element (2.4.11); Back and Change links are at least 24×24px or well spaced (2.5.8); no answer asked twice (3.3.7). Accessible Authentication (3.3.8) doesn't apply: there's no login. | not yet checked | | |
| 13 | Content: each tab title, every error message says how to fix it, link and button text, plain English | not yet checked | | |
