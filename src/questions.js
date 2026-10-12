// The five questions, in journey order. Pages, the summary list and the
// eligibility rules all use these values, so a label is only written once.
export const questions = [
  {
    id: 'propertyType',
    path: '/property-type',
    heading: 'What type of property do you live in?',
    summaryKey: 'Property type',
    error: 'Select the type of property you live in',
    options: [
      { value: 'house', label: 'House' },
      { value: 'flat', label: 'Flat' },
      { value: 'bungalow', label: 'Bungalow' },
    ],
  },
  {
    id: 'ownership',
    path: '/ownership',
    heading: 'Do you own your home outright or with a mortgage?',
    summaryKey: 'Ownership',
    error: 'Select whether you own your home outright or with a mortgage',
    options: [
      { value: 'outright', label: 'Own outright' },
      { value: 'mortgage', label: 'Own with a mortgage' },
    ],
  },
  {
    id: 'incomeBand',
    path: '/income',
    heading: 'What is your household income?',
    summaryKey: 'Household income',
    hint: 'Total yearly income of everyone in your home, before tax',
    error: 'Select your household income',
    options: [
      { value: 'up-to-30000', label: 'Up to £30,000' },
      { value: '30001-to-50000', label: '£30,001 to £50,000' },
      { value: 'over-50000', label: 'Over £50,000' },
    ],
  },
  {
    id: 'insulation',
    path: '/insulation',
    heading: 'What insulation does your home already have?',
    summaryKey: 'Existing insulation',
    error: 'Select what insulation your home already has',
    options: [
      { value: 'none', label: 'None' },
      { value: 'loft', label: 'Loft only' },
      { value: 'walls', label: 'Walls only' },
      { value: 'loft-and-walls', label: 'Loft and walls' },
    ],
  },
  {
    id: 'heating',
    path: '/heating',
    heading: 'How is your home currently heated?',
    summaryKey: 'Current heating',
    error: 'Select how your home is currently heated',
    options: [
      { value: 'gas', label: 'Gas boiler' },
      { value: 'oil', label: 'Oil boiler' },
      { value: 'electric', label: 'Electric heating' },
      { value: 'heat-pump', label: 'Heat pump' },
    ],
  },
];
