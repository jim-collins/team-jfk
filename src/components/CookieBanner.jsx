import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { focusElement } from '../utils/focus';
import { useCookiesLinkState } from '../utils/useCookiesLinkState';
import { SERVICE_NAME } from '../service';
import GovukButton from './GovukButton';

// GOV.UK cookie banner: https://design-system.service.gov.uk/components/cookie-banner/
// It asks until the user chooses (here or on the cookies page), then confirms "Accept all cookies"
// until hidden. It isn't shown on the cookies page, which has the full settings.
export default function CookieBanner({ consent, onAcceptAll }) {
  const { pathname } = useLocation();
  const cookiesLinkState = useCookiesLinkState();
  const [acceptedHere, setAcceptedHere] = useState(false);
  const [hidden, setHidden] = useState(false);
  const confirmationRef = useRef(null);

  // GOV.UK moves focus to the confirmation message once the user has accepted.
  useEffect(() => {
    if (acceptedHere) focusElement(confirmationRef.current);
  }, [acceptedHere]);

  const showQuestion = !consent;
  const showConfirmation = acceptedHere && !hidden;
  if (pathname === '/cookies' || !(showQuestion || showConfirmation)) return null;

  function handleAccept() {
    onAcceptAll();
    setAcceptedHere(true);
  }

  function handleHide() {
    setHidden(true);
    focusElement(document.getElementById('main-content'));
  }

  return (
    <div className="govuk-cookie-banner" data-nosnippet role="region" aria-label={`Cookies on ${SERVICE_NAME}`}>
      {showQuestion ? (
        <div className="govuk-cookie-banner__message govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h2 className="govuk-cookie-banner__heading govuk-heading-m">Tell us whether you accept cookies</h2>
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">
                  We use cookies to collect information about how you use this website. This information is used to
                  make the website work as well as possible and improve our services.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <GovukButton onClick={handleAccept}>Accept all cookies</GovukButton>
            <Link to="/cookies" state={cookiesLinkState} role="button" draggable="false" className="govuk-button">
              Set cookie preferences
            </Link>
            <Link className="govuk-link" to="/cookies" state={cookiesLinkState}>View cookies</Link>
          </div>
        </div>
      ) : (
        <div className="govuk-cookie-banner__message govuk-width-container" role="alert" ref={confirmationRef}>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">
                  You’ve accepted additional cookies. You can{' '}
                  <Link className="govuk-link" to="/cookies" state={cookiesLinkState}>
                    change your cookie settings
                  </Link> at any time.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <GovukButton onClick={handleHide}>Hide cookie message</GovukButton>
          </div>
        </div>
      )}
    </div>
  );
}
