import { focusElement } from '../utils/focus';

export default function SkipLink() {
  function handleClick(event) {
    event.preventDefault();
    focusElement(document.getElementById('main-content'));
  }

  return (
    <a href="#main-content" className="govuk-skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  );
}
