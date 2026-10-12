import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { questions } from '../questions';
import { usePageTitle } from '../utils/usePageTitle';
import ErrorSummary from './ErrorSummary';
import GovukButton from './GovukButton';

// One question per page: a radio group, Continue, a Back link, and the GOV.UK error pattern.
export default function QuestionPage({ questionId, answers, onAnswer }) {
  const index = questions.findIndex((q) => q.id === questionId);
  const question = questions[index];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const changing = searchParams.get('change') === '1';

  const [selected, setSelected] = useState(answers[question.id]);
  const [showError, setShowError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const summaryRef = useRef(null);

  usePageTitle(question.heading, showError);

  // Move focus to the error summary each time Continue is pressed with no answer.
  useEffect(() => {
    if (errorCount > 0) summaryRef.current?.focus();
  }, [errorCount]);

  const backHref = index === 0 ? '/' : questions[index - 1].path;
  const nextHref = changing || index === questions.length - 1 ? '/check-answers' : questions[index + 1].path;

  function handleSubmit(event) {
    event.preventDefault();
    if (!selected) {
      setShowError(true);
      setErrorCount((count) => count + 1);
      return;
    }
    onAnswer(question.id, selected);
    navigate(nextHref);
  }

  const hintId = `${question.id}-hint`;
  const errorId = `${question.id}-error`;
  const describedBy = [question.hint && hintId, showError && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <>
      <Link to={backHref} className="govuk-back-link">Back</Link>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {showError && (
            <ErrorSummary ref={summaryRef} errors={[{ href: `#${question.id}`, text: question.error }]} />
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className={`govuk-form-group${showError ? ' govuk-form-group--error' : ''}`}>
              <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                  <h1 className="govuk-fieldset__heading">{question.heading}</h1>
                </legend>
                {question.hint && (
                  <div id={hintId} className="govuk-hint">{question.hint}</div>
                )}
                {showError && (
                  <p id={errorId} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span> {question.error}
                  </p>
                )}
                <div className="govuk-radios">
                  {question.options.map((option, i) => {
                    // GOV.UK convention: the first radio's id is the field name, so the error summary can link to it.
                    const id = i === 0 ? question.id : `${question.id}-${i + 1}`;
                    return (
                      <div className="govuk-radios__item" key={option.value}>
                        <input
                          className="govuk-radios__input"
                          id={id}
                          name={question.id}
                          type="radio"
                          value={option.value}
                          checked={selected === option.value}
                          onChange={() => setSelected(option.value)}
                        />
                        <label className="govuk-label govuk-radios__label" htmlFor={id}>
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>
            <GovukButton type="submit">Continue</GovukButton>
          </form>
        </div>
      </div>
    </>
  );
}
