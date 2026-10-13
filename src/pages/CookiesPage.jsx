import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePageTitle } from '../utils/usePageTitle';
import { CONSENT_COOKIE } from '../utils/cookieConsent';
import GovukButton from '../components/GovukButton';

// GOV.UK cookies page pattern: https://design-system.service.gov.uk/patterns/cookies-page/
// Reached from "Set cookie preferences", "View cookies" and the footer.
export default function CookiesPage({ consent, onSave }) {
  usePageTitle('Cookies');
  // Where the user opened this page from (see useCookiesLinkState); the start page if they came straight here.
  const returnTo = useLocation().state?.from ?? '/';
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [saveCount, setSaveCount] = useState(0);
  const successRef = useRef(null);

  // Each save moves focus to the success banner, as GOV.UK Frontend's notification banner does.
  useEffect(() => {
    if (saveCount > 0) successRef.current?.focus();
  }, [saveCount]);

  function handleSubmit(event) {
    event.preventDefault();
    onSave(analytics);
    setSaveCount((count) => count + 1);
  }

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        {saveCount > 0 && (
          <div
            className="govuk-notification-banner govuk-notification-banner--success"
            role="alert"
            aria-labelledby="cookies-saved-title"
            tabIndex={-1}
            ref={successRef}
          >
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="cookies-saved-title">Success</h2>
            </div>
            <div className="govuk-notification-banner__content">
              <p className="govuk-notification-banner__heading">You’ve set your cookie preferences.</p>
              <p className="govuk-body">
                <Link className="govuk-notification-banner__link" to={returnTo}>
                  Go back to the page you were looking at
                </Link>
              </p>
            </div>
          </div>
        )}

        <h1 className="govuk-heading-l">Cookies</h1>
        <p className="govuk-body">Cookies are small files saved on your phone, tablet or computer when you visit a website.</p>
        <p className="govuk-body">We use cookies to make this service work and to remember your cookie settings.</p>

        <h2 className="govuk-heading-m">Essential cookies</h2>
        <p className="govuk-body">
          Essential cookies make this service work. We do not need to ask permission to use them.
        </p>
        <table className="govuk-table">
          <caption className="govuk-table__caption govuk-table__caption--s">Essential cookies we use</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">Name</th>
              <th scope="col" className="govuk-table__header">Purpose</th>
              <th scope="col" className="govuk-table__header">Expires</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">{CONSENT_COOKIE}</td>
              <td className="govuk-table__cell">Saves your cookie settings</td>
              <td className="govuk-table__cell">1 year</td>
            </tr>
          </tbody>
        </table>

        <h2 className="govuk-heading-m">Analytics cookies (optional)</h2>
        <p className="govuk-body">
          With your permission, we would use analytics cookies to collect information about how you use this service.
          This information helps us to improve our service.
        </p>
        <p className="govuk-body">
          This service does not set any analytics cookies yet. If we add them, we will only use them if you have said
          yes below.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                Do you want to accept analytics cookies?
              </legend>
              <div className="govuk-radios govuk-radios--inline">
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="cookies-analytics"
                    name="cookies-analytics"
                    type="radio"
                    value="yes"
                    checked={analytics}
                    onChange={() => setAnalytics(true)}
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor="cookies-analytics">Yes</label>
                </div>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="cookies-analytics-2"
                    name="cookies-analytics"
                    type="radio"
                    value="no"
                    checked={!analytics}
                    onChange={() => setAnalytics(false)}
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor="cookies-analytics-2">No</label>
                </div>
              </div>
            </fieldset>
          </div>
          <GovukButton type="submit">Save cookie settings</GovukButton>
        </form>
      </div>
    </div>
  );
}
