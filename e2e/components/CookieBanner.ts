import { expect, type Locator, type Page } from '@playwright/test';
import { serviceName } from '../data/questions';

/** GOV.UK cookie banner, essential cookies only: https://design-system.service.gov.uk/components/cookie-banner/ */
export class CookieBanner {
  readonly region: Locator;
  readonly message: Locator;
  readonly hideButton: Locator;

  constructor(page: Page) {
    this.region = page.getByRole('region', { name: `Cookies on ${serviceName}` });
    this.message = this.region.getByText('This service uses only essential cookies.');
    this.hideButton = this.region.getByRole('button', { name: 'Hide this message' });
  }

  async hide(): Promise<void> {
    await this.hideButton.click();
    await expect(this.region).toBeHidden();
  }
}
