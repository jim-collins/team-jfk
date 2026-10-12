import { usePageTitle } from '../utils/usePageTitle';

// Structure follows the GOV.UK sample accessibility statement.
// Only claim what has been tested: update this page when the manual checks in done.md are complete.
export default function AccessibilityStatementPage() {
  usePageTitle('Accessibility statement');

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Accessibility statement for Check if you can get a Green Home Grant</h1>
        <p className="govuk-body">
          This accessibility statement applies to the Check if you can get a Green Home Grant service.
        </p>
        <p className="govuk-body">
          We want as many people as possible to be able to use this service. You should be able to:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>use the whole service with just a keyboard</li>
          <li>zoom in up to 400% without the text spilling off the screen</li>
          <li>use the service on a screen 320 pixels wide without scrolling sideways</li>
          <li>listen to the whole service using a screen reader</li>
        </ul>

        <h2 className="govuk-heading-l">How accessible this service is</h2>
        <p className="govuk-body">We know some parts of this service are not yet complete:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>the feedback link in the banner at the top of each page does not lead to a feedback form yet</li>
          <li>we have not yet finished testing the service by hand with a keyboard, a screen reader and zoom</li>
        </ul>

        <h2 className="govuk-heading-l">Feedback and contact information</h2>
        <p className="govuk-body">
          If you find a problem with the accessibility of this service, or need information in a different format,
          email [contact email to be confirmed].
        </p>

        <h2 className="govuk-heading-l">Enforcement procedure</h2>
        <p className="govuk-body">
          The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies
          (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’).
          If you’re not happy with how we respond to your complaint,{' '}
          <a className="govuk-link" href="https://www.equalityadvisoryservice.com/">
            contact the Equality Advisory and Support Service (EASS)
          </a>
          .
        </p>

        <h2 className="govuk-heading-l">Technical information about this service’s accessibility</h2>
        <p className="govuk-body">
          We are committed to making this service accessible, in accordance with the Public Sector Bodies (Websites and
          Mobile Applications) (No. 2) Accessibility Regulations 2018.
        </p>

        <h3 className="govuk-heading-m">Compliance status</h3>
        <p className="govuk-body">
          This service is partially compliant with the Web Content Accessibility Guidelines version 2.2 AA standard,
          because testing by hand is not finished.
        </p>

        <h2 className="govuk-heading-l">What we’re doing to improve accessibility</h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>finish testing by hand with a keyboard, a screen reader and zoom, and fix what we find</li>
          <li>connect the feedback link to a feedback form</li>
        </ul>

        <h2 className="govuk-heading-l">Preparation of this accessibility statement</h2>
        <p className="govuk-body">This statement was prepared on 12 October 2026.</p>
        <p className="govuk-body">
          Every page and every error message was tested on 12 October 2026 with automated checks: axe-core, and
          Lighthouse in Google Chrome, including colour contrast. Every page scored 100 for accessibility.
        </p>
      </div>
    </div>
  );
}
