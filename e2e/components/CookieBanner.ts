import { expect, type Locator, type Page } from '@playwright/test';
import { serviceName } from '../data/questions';

/** GOV.UK cookie banner: https://design-system.service.gov.uk/components/cookie-banner/ */
export class CookieBanner {
  readonly region: Locator;
  readonly heading: Locator;
  readonly message: Locator;
  readonly acceptButton: Locator;
  /** A link styled as a button (role="button"), so it is found as a button. */
  readonly preferencesButton: Locator;
  readonly viewCookiesLink: Locator;
  readonly confirmation: Locator;
  readonly changeSettingsLink: Locator;
  readonly hideButton: Locator;

  constructor(page: Page) {
    this.region = page.getByRole('region', { name: `Cookies on ${serviceName}` });
    this.heading = this.region.getByRole('heading', { level: 2, name: 'Tell us whether you accept cookies' });
    this.message = this.region.getByText(
      'We use cookies to collect information about how you use this website. This information is used to make the website work as well as possible and improve our services.',
    );
    this.acceptButton = this.region.getByRole('button', { name: 'Accept all cookies' });
    this.preferencesButton = this.region.getByRole('button', { name: 'Set cookie preferences' });
    this.viewCookiesLink = this.region.getByRole('link', { name: 'View cookies' });
    this.confirmation = this.region.getByRole('alert');
    this.changeSettingsLink = this.confirmation.getByRole('link', { name: 'change your cookie settings' });
    this.hideButton = this.region.getByRole('button', { name: 'Hide cookie message' });
  }

  async acceptAll(): Promise<void> {
    await this.acceptButton.click();
    await expect(this.confirmation).toContainText('You’ve accepted additional cookies.');
  }

  async hide(): Promise<void> {
    await this.hideButton.click();
    await expect(this.region).toBeHidden();
  }
}
