import { expect, type Locator, type Page } from '@playwright/test';

/** GOV.UK error summary: https://design-system.service.gov.uk/components/error-summary/ */
export class ErrorSummary {
  /** The focusable wrapper (tabindex="-1"). No role of its own, so the GOV.UK class is the stable hook. */
  readonly container: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.container = page.locator('.govuk-error-summary');
    this.title = this.container.getByRole('heading', { name: 'There is a problem' });
  }

  link(message: string): Locator {
    return this.container.getByRole('link', { name: message, exact: true });
  }

  /** Visible, focused, and links to each message given. */
  async expectShowing(...messages: string[]): Promise<void> {
    await expect(this.title).toBeVisible();
    await expect(this.container).toBeFocused();
    await expect(this.container.getByRole('link')).toHaveCount(messages.length);
    for (const message of messages) {
      await expect(this.link(message)).toBeVisible();
    }
  }

  async expectHidden(): Promise<void> {
    await expect(this.container).toHaveCount(0);
  }
}
