import { forwardRef } from 'react';

// GOV.UK error summary. The page moves focus here when it appears.
// Each link moves focus to the field in error (as GOV.UK Frontend's own JavaScript does).
const ErrorSummary = forwardRef(function ErrorSummary({ errors }, ref) {
  function handleClick(event, href) {
    event.preventDefault();
    const field = document.getElementById(href.slice(1));
    if (!field) return;
    field.focus();
    field.closest('fieldset')?.querySelector('legend')?.scrollIntoView?.();
  }

  return (
    <div className="govuk-error-summary" tabIndex={-1} ref={ref}>
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map((error) => (
              <li key={error.href}>
                <a href={error.href} onClick={(event) => handleClick(event, error.href)}>
                  {error.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default ErrorSummary;
