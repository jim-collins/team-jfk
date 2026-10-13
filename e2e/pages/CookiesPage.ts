import { expect, type BrowserContext, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const consentCookieName = 'cookies_policy';
export interface SavedConsent {
  readonly essential: true;
  readonly analytics: boolean;
}

/** GOV.UK cookies page pattern: https://design-system.service.gov.uk/patterns/cookies-page/ */
export class CookiesPage extends BasePage {
  readonly essentialCookiesTable: Locator;
  readonly noAnalyticsYet: Locator;
  readonly analyticsQuestion: Locator;
  readonly yes: Locator;
  readonly no: Locator;
  readonly saveButton: Locator;
  readonly successBanner: Locator;
  readonly goBackLink: Locator;

  constructor(page: Page) {
    super(page, '/cookies', 'Cookies');
    this.essentialCookiesTable = page.getByRole('table', { name: 'Essential cookies we use' });
    this.noAnalyticsYet = page.getByText(/This service does not set any analytics cookies yet/);
    this.analyticsQuestion = page.getByRole('group', { name: 'Do you want to accept analytics cookies?' });
    this.yes = this.analyticsQuestion.getByRole('radio', { name: 'Yes', exact: true });
    this.no = this.analyticsQuestion.getByRole('radio', { name: 'No', exact: true });
    this.saveButton = page.getByRole('button', { name: 'Save cookie settings' });
    this.successBanner = page.getByRole('alert').filter({ hasText: 'You’ve set your cookie preferences.' });
    this.goBackLink = this.successBanner.getByRole('link', { name: 'Go back to the page you were looking at' });
  }

  async save(analytics: boolean): Promise<void> {
    await (analytics ? this.yes : this.no).check();
    await this.saveButton.click();
    await expect(this.successBanner).toBeFocused();
  }

  /** "Go back to the page you were looking at", in the success banner after saving. */
  async goBack(): Promise<void> {
    await this.goBackLink.click();
  }

  /** The consent the app saved in the browser, or null if none. */
  static async savedConsent(context: BrowserContext): Promise<SavedConsent | null> {
    const cookie = (await context.cookies()).find((c) => c.name === consentCookieName);
    return cookie ? (JSON.parse(decodeURIComponent(cookie.value)) as SavedConsent) : null;
  }
}
