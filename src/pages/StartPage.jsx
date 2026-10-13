import { Link } from 'react-router-dom';
import { usePageTitle } from '../utils/usePageTitle';
import { SERVICE_NAME } from '../service';

function StartPage() {
  usePageTitle();

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">{SERVICE_NAME}</h1>
        <p className="govuk-body">
          Use this service to find out if you can get a Green Home Grant towards insulation or a heat pump for your home.
        </p>
        <p className="govuk-body">You must own your home to use this service.</p>
        <Link
          to="/property-type"
          role="button"
          draggable="false"
          className="govuk-button govuk-button--start"
        >
          Start now
          <svg
            className="govuk-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default StartPage;
