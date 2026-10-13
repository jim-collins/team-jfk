import { expect, type Locator, type Page } from '@playwright/test';

/** GOV.UK summary list (a <dl>): https://design-system.service.gov.uk/components/summary-list/ */
export class SummaryList {
  readonly list: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    this.list = page.locator('dl.govuk-summary-list');
    this.rows = this.list.locator('.govuk-summary-list__row');
  }

  row(key: string): Locator {
    return this.rows.filter({ has: this.list.page().getByRole('term').filter({ hasText: key }) });
  }

  value(key: string): Locator {
    return this.row(key).locator('.govuk-summary-list__value');
  }

  /** Link text is "Change" plus a visually hidden key, e.g. "Change property type" (spec requirement 10). */
  changeLink(key: string): Locator {
    return this.row(key).getByRole('link', { name: `Change ${key.toLowerCase()}`, exact: true });
  }

  async expectRows(rows: ReadonlyArray<readonly [key: string, value: string]>): Promise<void> {
    await expect(this.rows).toHaveCount(rows.length);
    await expect(this.list.getByRole('term')).toHaveText(rows.map(([key]) => key));
    for (const [key, value] of rows) {
      await expect(this.value(key)).toHaveText(value);
    }
  }
}
