// What the tests expect to see, written out from spec.md (requirements 4, 17-21 and intent.md's wording).
// It deliberately doesn't import src/questions.js: if the app's text drifts from the spec, these tests fail.

export const questions = {
  propertyType: {
    path: '/property-type',
    heading: 'What type of property do you live in?',
    summaryKey: 'Property type',
    error: 'Select the type of property you live in',
    options: ['House', 'Flat', 'Bungalow'],
  },
  ownership: {
    path: '/ownership',
    heading: 'Do you own your home outright or with a mortgage?',
    summaryKey: 'Ownership',
    error: 'Select whether you own your home outright or with a mortgage',
    options: ['Own outright', 'Own with a mortgage'],
  },
  income: {
    path: '/income',
    heading: 'What is your household income?',
    summaryKey: 'Household income',
    hint: 'Total yearly income of everyone in your home, before tax',
    error: 'Select your household income',
    options: ['Up to £30,000', '£30,001 to £50,000', 'Over £50,000'],
  },
  insulation: {
    path: '/insulation',
    heading: 'What insulation does your home already have?',
    summaryKey: 'Existing insulation',
    error: 'Select what insulation your home already has',
    options: ['None', 'Loft only', 'Walls only', 'Loft and walls'],
  },
  heating: {
    path: '/heating',
    heading: 'How is your home currently heated?',
    summaryKey: 'Current heating',
    error: 'Select how your home is currently heated',
    options: ['Gas boiler', 'Oil boiler', 'Electric heating', 'Heat pump'],
  },
} as const;

export type QuestionId = keyof typeof questions;
export type Question = (typeof questions)[QuestionId];
export type OptionLabel<Q extends QuestionId> = (typeof questions)[Q]['options'][number];

/** Journey order. */
export const questionOrder = ['propertyType', 'ownership', 'income', 'insulation', 'heating'] as const satisfies readonly QuestionId[];

/** One answer per question, type-checked against that question's options. */
export type Answers = { [Q in QuestionId]: OptionLabel<Q> };

export const serviceName = 'Check if you can get a Green Home Grant';
export const titleSuffix = `${serviceName} - GOV.UK`;
