# Intent: Green Home Grant eligibility checker

Sources: `W3 - Hackathon 1 Pack.pdf`, `M1 W3 - Learner Handbook.pdf` (both in `readonly-courseware/swe-v1-ukds-c2/Week 3 - Hackathon 1/`), `README.md`, `CLAUDE.md`

## Problem

Homeowners checking if they qualify for the Green Home Grant. Today citizens phone a call centre and wait an average of 35 minutes to find out; this service replaces that call.

## Who it is for

Homeowners only. The start page says you must own your home.

## What success looks like

Ship the six MVS items and the full checklist ("Before you finish" in the Hackathon Pack).

The service asks five questions, one per page, and gives a result:

| Question | Answers offered | Effect on eligibility |
|---|---|---|
| Property type | House, flat, bungalow (no Other option) | All eligible |
| Ownership | Own outright, own with a mortgage (renting is not an option) | Both eligible |
| Household income | Up to £30,000; £30,001 to £50,000; over £50,000 | Eligible; partial; not eligible |
| Existing insulation | None; loft only; walls only; loft and walls | Eligible; partial; partial; not eligible |
| Current heating | Gas boiler, oil boiler; electric; heat pump | Eligible; partial; not eligible |

£30,000 exactly is eligible; £50,000 exactly is partial.

Combining: any "not eligible" answer means not eligible; otherwise any "partial" answer means partially eligible; otherwise eligible.

The result page lists every reason. Wording (suggested by Claude, approved):

- Eligible: "You're likely to be eligible for the Green Home Grant"
- Partially eligible: "You may be eligible for part of the Green Home Grant"
- Not eligible: "You're not eligible for the Green Home Grant"
- Reasons:
  - Income £30,001 to £50,000: "Your household income is between £30,001 and £50,000, so you can get part of the grant."
  - Income over £50,000: "Your household income is over £50,000."
  - Loft only or walls only: "Your home already has some insulation."
  - Loft and walls: "Your home already has loft and wall insulation."
  - Electric: "Your home is heated by electric heating."
  - Heat pump: "Your home already has a heat pump."
- Next steps:
  - Eligible or partial: "Apply for the Green Home Grant. You'll need proof of your household income and of home ownership."
  - Not eligible: "You can find other help with energy costs and home improvements on GOV.UK."

## Constraints

- Use GOV.UK Frontend: replace the starter's styles with it, drop the GOV.UK styles from `App.css`, and update `CLAUDE.md` to say so.
- Use the existing React + Vite starter.
- The app runs at `https://<hostname>:5002`; do not change the server section of `vite.config.js`.
- WCAG 2.2 AA.
- Tests use Vitest version 1.
- Final submission: Day 2, 16:00.
- The project stays in `readwrite-classroom/` (the pack says to work in `~/Documents/my-work/` and that programs cannot be run from `readwrite-classroom/`).
- In scope: phase banner, footer, accessibility statement and cookie notice.

## Out of scope

- Save and return (localStorage)
- Playwright end-to-end tests
- A real application form, a backend or data storage
- The monetary value of the grant
- Welsh language
