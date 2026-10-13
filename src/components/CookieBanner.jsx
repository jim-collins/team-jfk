import { useState } from 'react';
import { focusElement } from '../utils/focus';
import { SERVICE_NAME } from '../service';
import GovukButton from './GovukButton';

// Only essential cookies, so there is nothing to accept or reject.
// Hiding it lasts until the page is reloaded (spec: no browser storage).
export default function CookieBanner() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  function handleHide() {
    setHidden(true);
    focusElement(document.getElementById('main-content'));
  }

  return (
    <div
      className="govuk-cookie-banner"
      data-nosnippet
      role="region"
      aria-label={`Cookies on ${SERVICE_NAME}`}
    >
      <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-cookie-banner__heading govuk-heading-m">
              Cookies on {SERVICE_NAME}
            </h2>
            <div className="govuk-cookie-banner__content">
              <p className="govuk-body">This service uses only essential cookies.</p>
            </div>
          </div>
        </div>
        <div className="govuk-button-group">
          <GovukButton onClick={handleHide}>Hide this message</GovukButton>
        </div>
      </div>
    </div>
  );
}
