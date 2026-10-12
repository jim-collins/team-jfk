import { Link, useNavigate } from 'react-router-dom';
import { questions } from '../questions';
import { usePageTitle } from '../utils/usePageTitle';
import GovukButton from '../components/GovukButton';

function CheckAnswersPage({ answers }) {
  const navigate = useNavigate();
  usePageTitle('Check your answers');

  return (
    <>
      <Link to="/heating" className="govuk-back-link">Back</Link>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">Check your answers</h1>
          <dl className="govuk-summary-list">
            {questions.map((q) => (
              <div className="govuk-summary-list__row" key={q.id}>
                <dt className="govuk-summary-list__key">{q.summaryKey}</dt>
                <dd className="govuk-summary-list__value">
                  {q.options.find((o) => o.value === answers[q.id])?.label}
                </dd>
                <dd className="govuk-summary-list__actions">
                  <Link className="govuk-link" to={`${q.path}?change=1`}>
                    Change{' '}
                    <span className="govuk-visually-hidden">{q.summaryKey.toLowerCase()}</span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
          <GovukButton onClick={() => navigate('/result')}>Check eligibility</GovukButton>
        </div>
      </div>
    </>
  );
}

export default CheckAnswersPage;
