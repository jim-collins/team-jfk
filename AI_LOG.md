# AI Assistance Log

Record every instance where you use AI to generate, refactor, or debug code. Four fields per entry: what you asked for, what the AI produced, what you changed, and why you changed it.

Document **3+ entries** in your AI_LOG covering **3-5 distinct patterns** from this list -- planning, multi-agent critique, plan-mode scaffolding, refactor, test generation. Aim for variety: an entry that just says "asked Claude to write X" three times doesn't demonstrate AI as a real engineering tool.

> **Draft.** Claude filled in Date, Task and What AI Generated from the session and the git history. **What You Changed + Why must be written by the team**: it is the evidence of your own judgement. The notes in *italics* are only reminders of what happened; replace them with your own words.

## Instance 1: Planning the service (intent and spec interview)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Asked Claude (new-project skill) to interview us one question at a time and write `intent.md`, then `spec.md` `plan.md` with requirements, decisions and open questions. Pattern: planning. |
| **What AI Generated** | A question-by-question interview, then `intent.md` and a `spec.md` and `plan.md` with 39 numbered requirements, a decisions table and 10 open questions. When asked, it proposed the income bands (up to £30,000 / £30,001 to £50,000 / over £50,000) and all the result-page wording. It marked its own assumptions with (A), e.g. error message wording and the "Check eligibility" button. |
| **What You Changed + Why** | *TO COMPLETE. Reminders: you changed the ownership answer from "renting not eligible" to "renting is not an option" and had the start page say you must own your home; you limited property types to House, Flat, Bungalow with no Other; you chose GOV.UK Frontend to replace the starter's App.css.* |

## Instance 2: Plan-mode build plan

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Asked Claude to draft the build plan in plan mode (read-only) from `intent.md` and `spec.md`. Pattern: plan-mode scaffolding. |
| **What AI Generated** | `plan.md`: five steps, each with files, risks and a measurable check; a list of all 9 pages and 17 page states to check with axe; the riskiest step; a coverage table mapping every spec requirement to a step. It spotted two conflicts with the starter and asked about them: the starter's "Accept and continue" button vs the spec's "Check eligibility", and the starter's grey "not eligible" panel vs CLAUDE.md's "no custom colours". |
| **What You Changed + Why** | *TO COMPLETE. Reminders: you chose "Check eligibility" and the green panel for every outcome. When step 1 showed npm cannot install on the readwrite-classroom share, you chose to move the project to ~/Documents/my-work.* |

## Instance 3: Test-first eligibility rules

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Asked Claude to write the eligibility unit tests before the code, with expected results taken from the spec, then the pure function `checkEligibility`. Pattern: test generation. |
| **What AI Generated** | 12 tests in `src/utils/eligibility.test.js` (eligible, partial, not eligible, the £30,000 and £50,000 boundaries, several reasons together, the answer list); shown failing, then `src/utils/eligibility.js` and `src/questions.js` to make them pass. It first added an insulation hint the spec didn't ask for, then removed it. |
| **What You Changed + Why** | *TO COMPLETE. Reminder: check each expected result in the test file yourself; you decide what "correct" means.* |

## Instance 4: Accessibility bug caught by the tests

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Asked Claude to build Check your answers with a GOV.UK summary list and Change links with hidden text. Pattern: test generation / review. |
| **What AI Generated** | Change links written as `Change<span class="govuk-visually-hidden"> property type</span>`. The test failed: the accessible name came out as "Changeproperty type". Claude moved the space outside the hidden span. Earlier, axe also rejected its first page-change focus approach (a hidden element outside any landmark), and it switched to an aria-live region. |
| **What You Changed + Why** | *TO COMPLETE. Reminder: check with a screen reader that the links read "Change property type" etc.* |

## Instance 5: Playwright end-to-end test framework

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | A series of requests to Claude: (1) the steps to push the project to a new git repo; (2) a pasted "senior QA automation engineer" prompt asking for a Playwright framework in TypeScript with the Page Object Model, strong typing, no duplicated selectors, `data-testid` where available, GOV.UK conventions, local/test/production environments, HTML reports, screenshots and traces on failure, and every workflow including wrong or missing input; (3) commit and push if all tests passed; (4) add `npm install`, `npx playwright install chromium firefox` and run instructions to the README; (5) commit, push and update this log. Pattern: test generation. |
| **What AI Generated** | (1) Two ways to push (GitHub website, or `gh repo create`). (2) It read `intent.md`, `spec.md` and the source first, and flagged three mismatches with the prompt: Playwright was out of scope in `intent.md`, the app is JavaScript not TypeScript, and it has no `data-testid` attributes. It built `playwright.config.ts` and `e2e/` (environments, test data written from the spec, GOV.UK components, page objects, fixtures, a click-through `Journey` helper, 4 spec files). The 64 tests run in Chromium, Firefox and a 320px viewport (192 runs, all passing). It used role and label selectors rather than adding test ids, broke one expected sentence on purpose to show a failure saves a screenshot and trace, then restored it. It moved Playwright into scope in `intent.md`, added the command to `CLAUDE.md`, and wrote `e2e/README.md`. (3) It followed `GIT-WORKFLOW.md` (pull, commit to `main`, push) and left the untracked `GIT-WORKFLOW.md` out of the commit. (4) It admitted the README did not mention `npm install`, then added a "Running the tests" section to `README.md` and a Setup section to `e2e/README.md`. |
| **What You Changed + Why** | *TO COMPLETE. Reminders: decide whether role/label selectors are acceptable or the team wants `data-testid` attributes added to the app; check the expected text in `e2e/data/` against the spec yourself; you asked for the README setup steps after the first push, because teammates pulling the repo would not know to install the browsers.* |

## Instance 6: "Start again" button on the result page

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Asked Claude to add a "Start again" button to the result page that takes the user back to the start page with the Start now button, with unit tests and Playwright tests, and to update this log. Pattern: test generation (feature with tests). |
| **What AI Generated** | It pointed out that only going back to the start page would leave the old answers selected on every question, so the button also clears the answers (written into `spec.md` as requirement 19a, marked as Claude's assumption). `App` passes a `clearAnswers` function to `ResultPage`, which navigates to `/` and clears the answers in the same update so the result page never redirects to the first question. It added 2 Vitest tests and `e2e/tests/start-again.spec.ts` (Start again on all 6 result scenarios, answers cleared on every question, a second check using only the new answers, keyboard use), plus `startAgainButton` in the `ResultPage` page object. To prove the tests work, it commented out the clearing: one Vitest and one Playwright test failed, then it restored the code. Final run: 58 Vitest tests, 219 Playwright runs and the contrast check all passed. |
| **What You Changed + Why** | *TO COMPLETE. Reminders: decide whether clearing the answers is what you want (spec 19a is marked (A)); check whether "Start again" should be a green primary button or a grey secondary one in GOV.UK terms; note that the "second check" test passes even without clearing, so the "nothing chosen" tests are the ones that guard it.* |
