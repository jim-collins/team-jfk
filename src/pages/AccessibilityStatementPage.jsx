import { usePageTitle } from '../utils/usePageTitle';
import { SERVICE_NAME } from '../service';

// Structure follows GOV.UK's accessibility statement (https://www.gov.uk/help/accessibility-statement).
// Only claim what has been tested: update this page when done.md changes.
export default function AccessibilityStatementPage() {
  usePageTitle('Accessibility statement');

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Accessibility statement for {SERVICE_NAME}</h1>
        <p className="govuk-body">
          This accessibility statement applies to the {SERVICE_NAME} service.
        </p>
        <p className="govuk-body">This service is run by [organisation to be confirmed].</p>

        <h2 className="govuk-heading-l">How you should be able to use this service</h2>
        <p className="govuk-body">
          We want as many people as possible to be able to use this service. You should be able to:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>change colours, contrast levels and fonts using browser or device settings</li>
          <li>zoom in up to 400% without the text spilling off the screen</li>
          <li>use the service on a screen 320 pixels wide without scrolling sideways</li>
          <li>get through the whole service using just a keyboard or speech recognition software</li>
          <li>listen to the whole service using a screen reader</li>
        </ul>
        <p className="govuk-body">We’ve also made the text in the service as simple as possible to understand.</p>

        <h2 className="govuk-heading-l">How accessible this service is</h2>
        <p className="govuk-body">We know some parts of this service have not been fully tested or finished:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>the service has not yet been tested with a screen reader</li>
          <li>
            we have not yet checked the contrast of radio button borders, the focus outline and the Start now arrow
            by hand
          </li>
          <li>the feedback link in the banner at the top of each page does not lead to a feedback form yet</li>
        </ul>

        <h2 className="govuk-heading-l">Feedback and contact information</h2>
        <p className="govuk-body">
          If you need information in this service in a different format, like large print, easy read, audio recording
          or braille, email [contact email to be confirmed].
        </p>
        <p className="govuk-body">
          We’ll consider your request and get back to you in [response time to be confirmed].
        </p>

        <h2 className="govuk-heading-l">Reporting accessibility problems with this service</h2>
        <p className="govuk-body">
          We’re always looking to improve the accessibility of this service. If you find any problems not listed on
          this page or think we’re not meeting accessibility requirements, email [contact email to be confirmed].
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
          because some parts have not yet been tested. They are listed below.
        </p>

        <h3 className="govuk-heading-m">Non-accessible content</h3>
        <p className="govuk-body">
          Our testing has not found any content that fails the WCAG 2.2 AA success criteria. These parts have not yet
          been tested, so we cannot say they are accessible:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>
            how the service works with a screen reader, including page titles, error messages and Change links (WCAG
            1.3.1, 4.1.2 and 4.1.3)
          </li>
          <li>
            the contrast of radio button borders, the focus outline and the Start now arrow against their background
            (WCAG 1.4.11)
          </li>
        </ul>

        <h2 className="govuk-heading-l">What we’re doing to improve accessibility</h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>test the service with a screen reader, and fix any problems we find</li>
          <li>check the contrast of radio button borders, the focus outline and the Start now arrow</li>
          <li>connect the feedback link to a feedback form</li>
        </ul>

        <h2 className="govuk-heading-l">Preparation of this accessibility statement</h2>
        <p className="govuk-body">
          This statement was prepared on 12 October 2026. It was last reviewed on 12 October 2026.
        </p>
        <p className="govuk-body">
          This service was last tested on 12 October 2026 against the WCAG 2.2 AA standard. The test was carried out
          by the service team.
        </p>
        <p className="govuk-body">
          We tested every page and every error message: the start page, the 5 question pages, Check your answers, the
          3 possible results and this statement. We used automated checks (axe-core, and Lighthouse in Google
          Chrome, including colour contrast), and tested by hand with a keyboard only, at 200% and 400% zoom, with
          increased text spacing, and against the WCAG 2.2 criteria for focus, target size and repeated entry.
        </p>
      </div>
    </div>
  );
}
