import { expect, type Locator, type Page } from '@playwright/test';
import { PageLayout } from '../components/PageLayout';
import { titleSuffix } from '../data/questions';

/** Every page has a path, one h1, and a title "<heading> - <service> - GOV.UK" (spec requirement 31). */
export abstract class BasePage {
  readonly layout: PageLayout;
  readonly heading: Locator;
  /** Matches this page's address, with or without a query string. */
  readonly url: RegExp;

  protected constructor(
    readonly page: Page,
    readonly path: string,
    readonly headingText: string,
  ) {
    this.layout = new PageLayout(page);
    this.url = new RegExp(`${escapeRegExp(path)}(\\?.*)?$`);
    this.heading = page.getByRole('heading', { level: 1, name: headingText, exact: true });
  }

  /** Opens the page by address. This reloads the app, so any answers are lost. */
  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  get expectedTitle(): string {
    return `${this.headingText} - ${titleSuffix}`;
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.heading).toBeVisible();
    await expect(this.page).toHaveTitle(this.expectedTitle);
  }
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
