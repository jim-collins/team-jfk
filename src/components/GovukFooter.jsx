import { Link } from 'react-router-dom';
import { useCookiesLinkState } from '../utils/useCookiesLinkState';

export default function GovukFooter() {
  const cookiesLinkState = useCookiesLinkState();
  return (
    <footer className="govuk-footer">
      <div className="govuk-width-container">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">
                <Link className="govuk-footer__link" to="/accessibility-statement">Accessibility statement</Link>
              </li>
              <li className="govuk-footer__inline-list-item">
                <Link className="govuk-footer__link" to="/cookies" state={cookiesLinkState}>Cookies</Link>
              </li>
            </ul>
            <span className="govuk-footer__licence-description">
              All content is available under the{' '}
              <a
                className="govuk-footer__link"
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                rel="license"
              >
                Open Government Licence v3.0
              </a>
              , except where otherwise stated
            </span>
          </div>
          <div className="govuk-footer__meta-item">
            <a
              className="govuk-footer__link govuk-footer__copyright-logo"
              href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
            >
              © Crown copyright
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
