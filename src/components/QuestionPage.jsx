import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { questions } from '../questions';
import { usePageTitle } from '../utils/usePageTitle';
import ErrorSummary from './ErrorSummary';
import GovukButton from './GovukButton';
import GovukRadios from './GovukRadios';

// One question per page: a radio group, Continue, a Back link, and the GOV.UK error pattern.
// `index` is the question's place in the journey, so Back and Continue know their neighbours.
export default function QuestionPage({ question, index, answers, onAnswer }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const changing = searchParams.get('change') === '1';

  const [selected, setSelected] = useState(answers[question.id]);
  // How many times Continue was pressed with no answer. The error shows once it is above 0,
  // and each press moves focus to the error summary again.
  const [errorCount, setErrorCount] = useState(0);
  const showError = errorCount > 0;
  const summaryRef = useRef(null);

  usePageTitle(question.heading, showError);

  useEffect(() => {
    if (showError) summaryRef.current?.focus();
  }, [errorCount, showError]);

  // While changing an answer, Back returns to Check your answers, where the user came from.
  const backHref = changing ? '/check-answers' : index === 0 ? '/' : questions[index - 1].path;
  const nextHref = changing || index === questions.length - 1 ? '/check-answers' : questions[index + 1].path;

  function handleSubmit(event) {
    event.preventDefault();
    if (!selected) {
      setErrorCount((count) => count + 1);
      return;
    }
    onAnswer(question.id, selected);
    navigate(nextHref);
  }

  return (
    <>
      <Link to={backHref} className="govuk-back-link">Back</Link>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {showError && (
            <ErrorSummary ref={summaryRef} errors={[{ href: `#${question.id}`, text: question.error }]} />
          )}
          <form onSubmit={handleSubmit} noValidate>
            <GovukRadios question={question} selected={selected} onChange={setSelected} showError={showError} />
            <GovukButton type="submit">Continue</GovukButton>
          </form>
        </div>
      </div>
    </>
  );
}
