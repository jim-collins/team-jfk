import type { Locator, Page } from '@playwright/test';
import { CookieBanner } from './CookieBanner';

/** The parts of the GOV.UK page template every page shares. */
export class PageLayout {
  readonly skipLink: Locator;
  readonly homeLink: Locator;
  readonly phaseBanner: Locator;
  readonly phaseTag: Locator;
  readonly feedbackLink: Locator;
  readonly main: Locator;
  readonly footer: Locator;
  readonly accessibilityStatementLink: Locator;
  readonly cookiesLink: Locator;
  readonly cookieBanner: CookieBanner;

  constructor(page: Page) {
    this.skipLink = page.getByRole('link', { name: 'Skip to main content' });
    this.homeLink = page.getByRole('banner').getByRole('link', { name: 'GOV.UK' });
    this.phaseBanner = page.locator('.govuk-phase-banner');
    this.phaseTag = this.phaseBanner.locator('.govuk-tag');
    this.feedbackLink = this.phaseBanner.getByRole('link', { name: 'feedback' });
    this.main = page.getByRole('main');
    this.footer = page.getByRole('contentinfo');
    this.accessibilityStatementLink = this.footer.getByRole('link', { name: 'Accessibility statement' });
    this.cookiesLink = this.footer.getByRole('link', { name: 'Cookies', exact: true });
    this.cookieBanner = new CookieBanner(page);
  }
}
