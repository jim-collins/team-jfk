// Move focus to an element that isn't normally focusable, the way GOV.UK Frontend's
// skip link does: add tabindex="-1" for the moment, and hide the focus outline.
export function focusElement(element) {
  if (!element) return;
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
    element.classList.add('govuk-skip-link-focused-element');
    element.addEventListener(
      'blur',
      () => {
        element.removeAttribute('tabindex');
        element.classList.remove('govuk-skip-link-focused-element');
      },
      { once: true }
    );
  }
  element.focus();
}
