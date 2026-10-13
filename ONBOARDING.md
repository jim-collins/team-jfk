# Welcome to Team JFK

## How We Use Claude

Based on James Collins's usage over the last 30 days:

Work Type Breakdown:
  Build Feature  ████████████████████  100%

Top Skills & Commands:
  /model  ████████████████████  2x/month

Top MCP Servers:
  _None used yet_

## Your Setup Checklist

### Codebases
- [ ] team-jfk — https://github.com/jim-collins/team-jfk

### MCP Servers to Activate
_None yet._

### Skills to Know About
- /model — switches the Claude model for the session (and saves it as your default). The team has switched between Opus and Fable.
- /code-review — reviews the whole project or a diff for bugs, duplication and clarity. The team used it to find duplication and state issues, then had Claude fix them.

## Team Tips

- After every `git pull`, run `npm install`, and on a new machine also `npx playwright install chromium firefox`, or the end-to-end tests won't run.
- Follow `GIT-WORKFLOW.md`: pull before you start, commit to `main`, pull again, then push. Pull and push often.
- Ask Claude to run the tests before it commits: `npm test` (Vitest) and `npm run test:e2e` (Playwright). Only commit when both pass.

## Get Started

No starter task yet. Ask a teammate for one.

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
