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
