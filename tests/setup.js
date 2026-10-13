import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// index.html sets these in the browser; jsdom starts with a blank document.
document.documentElement.lang = 'en';
document.documentElement.className = 'govuk-template';
document.body.className = 'govuk-template__body';

afterEach(() => {
  cleanup();
  // Each test starts as a first visit, with no cookie choice saved.
  document.cookie = 'cookies_policy=; max-age=0; path=/';
});
