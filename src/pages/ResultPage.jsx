import { checkEligibility } from '../utils/eligibility';
import { usePageTitle } from '../utils/usePageTitle';

const HEADINGS = {
  eligible: "You're likely to be eligible for the Green Home Grant",
  partial: 'You may be eligible for part of the Green Home Grant',
  'not-eligible': "You're not eligible for the Green Home Grant",
};

const APPLY = "Apply for the Green Home Grant. You'll need proof of your household income and of home ownership.";
const NEXT_STEPS = {
  eligible: APPLY,
  partial: APPLY,
  'not-eligible': 'You can find other help with energy costs and home improvements on GOV.UK.',
};

function ResultPage({ answers }) {
  const { status, reasons } = checkEligibility(answers);
  usePageTitle(HEADINGS[status]);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">{HEADINGS[status]}</h1>
        </div>
        {reasons.length > 0 && (
          <>
            <h2 className="govuk-heading-m">Why</h2>
            <ul className="govuk-list govuk-list--bullet">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </>
        )}
        <h2 className="govuk-heading-m">What to do next</h2>
        <p className="govuk-body">{NEXT_STEPS[status]}</p>
      </div>
    </div>
  );
}

export default ResultPage;
