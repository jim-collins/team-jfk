// GOV.UK radios for one question: a fieldset with the question as its legend, an optional hint,
// and the error message when there is one. Presentational only; QuestionPage owns the state.
export default function GovukRadios({ question, selected, onChange, showError }) {
  const hintId = `${question.id}-hint`;
  const errorId = `${question.id}-error`;
  const describedBy = [question.hint && hintId, showError && errorId].filter(Boolean).join(' ') || undefined;

  return (
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
                  onChange={() => onChange(option.value)}
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
  );
}
