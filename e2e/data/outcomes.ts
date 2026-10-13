import type { Answers } from './questions';

// Result wording from intent.md / spec.md requirements 17-19.

export type Outcome = 'eligible' | 'partial' | 'not-eligible';

export const outcomeHeadings: Record<Outcome, string> = {
  eligible: "You're likely to be eligible for the Green Home Grant",
  partial: 'You may be eligible for part of the Green Home Grant',
  'not-eligible': "You're not eligible for the Green Home Grant",
};

const apply = "Apply for the Green Home Grant. You'll need proof of your household income and of home ownership.";
export const nextSteps: Record<Outcome, string> = {
  eligible: apply,
  partial: apply,
  'not-eligible': 'You can find other help with energy costs and home improvements on GOV.UK.',
};

export const reasons = {
  incomeMiddle: 'Your household income is between £30,001 and £50,000, so you can get part of the grant.',
  incomeHigh: 'Your household income is over £50,000.',
  someInsulation: 'Your home already has some insulation.',
  fullInsulation: 'Your home already has loft and wall insulation.',
  electric: 'Your home is heated by electric heating.',
  heatPump: 'Your home already has a heat pump.',
} as const;

export interface Scenario {
  readonly name: string;
  readonly answers: Answers;
  readonly outcome: Outcome;
  readonly reasons: readonly string[];
}

export const eligibleAnswers: Answers = {
  propertyType: 'House',
  ownership: 'Own outright',
  income: 'Up to £30,000',
  insulation: 'None',
  heating: 'Gas boiler',
};

export const scenarios: readonly Scenario[] = [
  { name: 'everything eligible', answers: eligibleAnswers, outcome: 'eligible', reasons: [] },
  {
    name: 'flat with a mortgage and an oil boiler',
    answers: { ...eligibleAnswers, propertyType: 'Flat', ownership: 'Own with a mortgage', heating: 'Oil boiler' },
    outcome: 'eligible',
    reasons: [],
  },
  {
    name: 'middle income band',
    answers: { ...eligibleAnswers, income: '£30,001 to £50,000' },
    outcome: 'partial',
    reasons: [reasons.incomeMiddle],
  },
  {
    name: 'walls only and electric heating each give partial',
    answers: { ...eligibleAnswers, propertyType: 'Bungalow', insulation: 'Walls only', heating: 'Electric heating' },
    outcome: 'partial',
    reasons: [reasons.someInsulation, reasons.electric],
  },
  {
    name: 'not eligible beats partial and lists every reason',
    answers: { ...eligibleAnswers, income: 'Over £50,000', insulation: 'Loft only', heating: 'Heat pump' },
    outcome: 'not-eligible',
    reasons: [reasons.incomeHigh, reasons.someInsulation, reasons.heatPump],
  },
  {
    name: 'loft and walls insulation',
    answers: { ...eligibleAnswers, insulation: 'Loft and walls' },
    outcome: 'not-eligible',
    reasons: [reasons.fullInsulation],
  },
];
