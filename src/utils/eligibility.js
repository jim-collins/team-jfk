// The Green Home Grant eligibility rules (spec.md requirements 14-18).
import { questions } from '../questions';

// A pure function: answers in, { status, reasons } out. Pages never decide eligibility.

// Answers that limit the grant, with the reason shown on the result page.
// Any answer not listed here is eligible.
const LIMITS = {
  incomeBand: {
    '30001-to-50000': {
      effect: 'partial',
      reason: 'Your household income is between £30,001 and £50,000, so you can get part of the grant.',
    },
    'over-50000': { effect: 'not-eligible', reason: 'Your household income is over £50,000.' },
  },
  insulation: {
    loft: { effect: 'partial', reason: 'Your home already has some insulation.' },
    walls: { effect: 'partial', reason: 'Your home already has some insulation.' },
    'loft-and-walls': { effect: 'not-eligible', reason: 'Your home already has loft and wall insulation.' },
  },
  heating: {
    electric: { effect: 'partial', reason: 'Your home is heated by electric heating.' },
    'heat-pump': { effect: 'not-eligible', reason: 'Your home already has a heat pump.' },
  },
};


export function checkEligibility(answers) {
  // Reasons are listed in question order.
  const limits = questions.map((q) => q.id).map((id) => LIMITS[id]?.[answers[id]]).filter(Boolean);
  const effects = limits.map((limit) => limit.effect);

  let status = 'eligible';
  if (effects.includes('not-eligible')) status = 'not-eligible';
  else if (effects.includes('partial')) status = 'partial';

  return { status, reasons: limits.map((limit) => limit.reason) };
}
