# Spec: Green Home Grant eligibility checker

Sources: `intent.md`, `W3 - Hackathon 1 Pack.pdf`, `M1 W3 - Learner Handbook.pdf`, `README.md`, `CLAUDE.md`

Requirements marked **(A)** are Claude's assumptions, not the user's words. They stand until the user changes them.

## 1. Requirements

### Journey and pages

1. The start page shows the heading "Check if you can get a Green Home Grant", a short description of the service, the sentence "You must own your home to use this service", and a green "Start now" button.
2. "Start now" opens the first question. The questions come in this order, one per page: property type, ownership, household income, existing insulation, current heating.
3. Each question page has the question as its heading, one set of radio buttons, a "Continue" button and a "Back" link near the top.
4. The answers offered are exactly these, in this order (the income question has the hint "Total yearly income of everyone in your home, before tax", and "Walls only" covers cavity or solid walls):
   - Property type: House, Flat, Bungalow
   - Ownership: Own outright, Own with a mortgage
   - Household income: Up to £30,000; £30,001 to £50,000; Over £50,000
   - Existing insulation: None; Loft only; Walls only; Loft and walls
   - Current heating: Gas boiler; Oil boiler; Electric heating; Heat pump
5. Clicking an answer's label selects that answer.
6. "Continue" saves the answer and opens the next question. After the last question it opens "Check your answers".
7. "Back" opens the previous page: the first question goes back to the start page, and "Check your answers" goes back to the heating question. **(A)**
8. An answer is still selected when the user returns to its question, by Back or by Change.
9. "Check your answers" shows all five questions and answers as a GOV.UK summary list.
10. Each answer has a "Change" link. A screen reader announces it with the question, for example "Change property type".
11. After changing an answer and pressing Continue, the user returns to "Check your answers", not to the next question.
12. "Check your answers" has a button, "Check eligibility" **(A)**, that opens the result page.
13. If the user opens any question after the first, "Check your answers" or the result page without having answered the earlier questions (for example by typing the address or reloading), they are sent to the first unanswered question.

### Eligibility rules

14. Each answer has an effect:

    | Answer | Effect |
    |---|---|
    | House, Flat, Bungalow | eligible |
    | Own outright, Own with a mortgage | eligible |
    | Up to £30,000 | eligible |
    | £30,001 to £50,000 | partial |
    | Over £50,000 | not eligible |
    | None (insulation) | eligible |
    | Loft only, Walls only | partial |
    | Loft and walls | not eligible |
    | Gas boiler, Oil boiler | eligible |
    | Electric heating | partial |
    | Heat pump | not eligible |

15. Overall result: if any answer is "not eligible", the result is not eligible. Otherwise, if any answer is "partial", the result is partially eligible. Otherwise it is eligible.
16. Income of £30,000 exactly is eligible, and £50,000 exactly is partially eligible. Both follow from the band labels.

### Result page

17. The result page shows the outcome in a GOV.UK panel with these headings:
    - Eligible: "You're likely to be eligible for the Green Home Grant"
    - Partially eligible: "You may be eligible for part of the Green Home Grant"
    - Not eligible: "You're not eligible for the Green Home Grant"
18. Below the panel, the page lists one reason for **every** answer that made the result partial or not eligible, using the wording in `intent.md`. An eligible result shows no reasons.
19. Below the reasons is a "What to do next" section, shown as plain text with no links:
    - Eligible or partial: "Apply for the Green Home Grant. You'll need proof of your household income and of home ownership."
    - Not eligible: "You can find other help with energy costs and home improvements on GOV.UK."

### Validation and errors

20. Pressing Continue with no answer selected keeps the user on the page and shows:
    - an error summary at the top of the main content, with the heading "There is a problem" and a link to the question
    - the same message next to the radio buttons
21. These are the error messages, the same in both places: **(A)**
    - Property type: "Select the type of property you live in"
    - Ownership: "Select whether you own your home outright or with a mortgage"
    - Household income: "Select your household income"
    - Insulation: "Select what insulation your home already has"
    - Heating: "Select how your home is currently heated"
22. When the error appears, focus moves to the error summary, and the page title starts with "Error: ".
23. Clicking the link in the error summary moves focus to the first radio button of that question.
24. Choosing an answer and pressing Continue clears the error.

### GOV.UK look and service signals

25. Every page uses GOV.UK Frontend styles: GOV.UK header, typography, spacing, buttons, radios, summary list, panel and error components.
26. A "Skip to main content" link is the first thing the keyboard reaches on every page. **(A)** (it's part of the GOV.UK page template)
27. An "Alpha" phase banner with a feedback link (to `#` for now) sits under the header on every page.
28. A GOV.UK footer on every page links to the accessibility statement.
29. The accessibility statement page is filled in using the GOV.UK sample structure, with what this service's testing found. The contact details read "[contact email to be confirmed]", and the `#` feedback link is listed as a known gap.
30. A cookie notice appears on first visit, saying the service uses only essential cookies, with a "Hide this message" button. The notice says "This service uses only essential cookies". Once hidden, it stays hidden until the page is reloaded, and there is no cookies page.
31. Each page has its own tab title, in the form "<Page heading> - Check if you can get a Green Home Grant - GOV.UK". **(A)**

### Accessibility

32. Every page, including every error state, meets WCAG 2.2 AA. axe finds no violations in the tests or in Lighthouse in Chrome (including colour contrast).
33. The whole journey can be done with the keyboard only (Tab, Shift+Tab, Enter, Space, arrow keys in radios), with focus always visible.
34. After each page change, focus starts at the top of the new page and the new page's title is announced. **(A)**
35. Every page reflows at 320px wide with no sideways scrolling.
36. Each radio group is a fieldset, with the question as its legend.

### Evidence

37. `npm test` runs at least 5 passing unit tests of the eligibility rules, covering an eligible case, a not-eligible case, a partial case, both income boundaries (£30,000 and £50,000), and multiple reasons listed together.
38. Lighthouse on the production build scores accessibility 100 and performance at least 90 on the start page.
39. `AI_LOG.md` has at least 3 completed entries of the team's own, four fields each, covering at least 3 different patterns. The seeded example entry (married couple's allowance) is replaced.

## 2. Decisions

| Decision | Reason |
|---|---|
| React 18 + Vite 5 starter, kept as provided | User's choice (intent: "Use the existing React + Vite starter"). It replaces the lab's Python default. |
| GOV.UK Frontend replaces the GOV.UK styles in `App.css` | User's choice ("Replace"). `CLAUDE.md` will be updated to say so. |
| Use GOV.UK Frontend's pre-built CSS and assets (fonts, images), with no Sass build | No extra build tooling is needed. |
| No GOV.UK Frontend JavaScript; React handles behaviour such as error focus and the cookie banner | None of the components used need it, and it avoids two systems controlling the same markup. |
| One answers object held in `App` with `useState` | Answers survive Back and Change (handbook, "One state object"). |
| Eligibility rules in one pure function, `src/utils/eligibility.js`, returning `{ status, reasons }` | Testable without rendering (handbook, chapter 5). |
| Vitest 1, plus jsdom, Testing Library and axe-core for the page tests | Vitest 1 matches Vite 5 (pack). jsdom and axe let the tests render every page and error state. |
| Contrast checked by `lighthouse-pages.sh` on pages saved by the tests, with the built CSS | jsdom can't compute colours. |
| Back links go to an explicit previous page, not browser history | After a Change, browser history would go to the wrong page. |
| After a Change, Continue returns to Check your answers | Handbook, "Check your answers". |
| Answers are kept only in memory, and are lost on reload | Save and return is out of scope (intent). |
| Routes stay as in the starter's `App.jsx` (`/property-type`, `/ownership`, `/income`, `/insulation`, `/heating`, `/check-answers`, `/result`, `/accessibility-statement`) | Already scaffolded. In the lab the app is opened at `https://app-lab11126.labs.decoded.com/`, which goes to port 5000 at the root path, so there is no path prefix. The dev server is started with `VITE_PORT=5000` (the pack's `:5002` address does not reach this lab). |
| Links between pages use React Router `Link`, not plain `href` | Avoids full page reloads, which would lose the in-memory answers. |
| File split: JSX components in `src/`, all CSS from GOV.UK Frontend plus `App.css` for anything left over, no inline `style=` | Each language stays in its own file. In React, markup in JSX is the norm. |
| The nested `<main>` in the starter's `AccessibilityStatementPage` is removed | `App` already provides `<main>`, and two `<main>` elements fail axe. |
| Starter's property-type TODO (Detached / Semi-detached / Terraced / Flat / Bungalow) not followed | The user chose House, Flat, Bungalow (intent). |
| The pack's example test "council tenants are not eligible" not used | Renting isn't an option (intent). |
| Project lives in `~/Documents/my-work/w03-hackathon/` | npm can't create symlinks on the `readwrite-classroom/` network drive (ENOTSUP), so the user chose to move it in build step 1. |
| Skipping ahead or reloading sends the user to the first unanswered question | Provisional answer accepted by the user. It stops a result being shown for blank answers. |
| Cookie notice: "This service uses only essential cookies", a "Hide this message" button, hidden for the visit only, no cookies page | Provisional answer accepted by the user. Remembering it after a reload would need browser storage. |
| "Household income" means the total yearly income of everyone in the home, before tax, shown as hint text | Provisional answer accepted by the user. The intent doesn't define it. |
| "Walls" insulation covers cavity or solid walls | Provisional answer accepted by the user. |
| The seeded `AI_LOG.md` example is replaced by the team's own entries | Provisional answer accepted by the user. It's about a different service. A facilitator could still confirm this. |
| "What to do next" on the result page is plain text with no links | User's choice. There's no application form or real destination, so links would be dead. |
| The feedback link stays `#` and is listed as a known gap in the accessibility statement | User's choice. There's no real feedback address yet. |
| The accessibility statement uses the placeholder "[contact email to be confirmed]" | User's choice. There are no real contact details yet. |
| App files stay at the project root in the starter's React layout (`src/`, `package.json`), with no `app/` folder | User's choice. It's the layout the starter, README and facilitators expect. |

## 3. Open questions

None. (The last one, whether the app can run from `readwrite-classroom/`, was settled in build step 1: it can't, so the project moved.)

## Gaps already settled

- **Eligibility rules** (not given by the pack, handbook or README): settled in the interview (intent).
- **Renters** (the pack's example test treats council tenants as not eligible): settled, because renting isn't an option and the start page says you must own your home.
- **Property types** (the starter suggests five): settled, with three types and no Other.
- **"Partially eligible"** (never defined in the sources): settled by the approved result wording. Its value in money is out of scope.
- **Change link destination** (the pack calls returning to Check your answers a stretch goal; the handbook calls it the pattern): following the handbook.
