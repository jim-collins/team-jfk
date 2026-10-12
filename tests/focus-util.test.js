import { describe, it, expect } from 'vitest';
import { focusElement } from '../src/utils/focus';

describe('focusElement', () => {
  it('removes its tabindex and outline class on blur, even after focusing the same element twice', () => {
    const main = document.createElement('main');
    const button = document.createElement('button');
    document.body.append(main, button);

    focusElement(main);
    focusElement(main);
    expect(main.getAttribute('tabindex')).toBe('-1');
    button.focus();
    expect(main.hasAttribute('tabindex')).toBe(false);
    expect(main.classList.contains('govuk-skip-link-focused-element')).toBe(false);

    main.remove();
    button.remove();
  });
});
