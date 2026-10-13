import { expect, type Locator, type Page } from '@playwright/test';
import { nextSteps, outcomeHeadings, type Outcome } from '../data/outcomes';
import { titleSuffix } from '../data/questions';
import { BasePage } from './BasePage';

/** The result page's heading depends on the outcome, so it is created for one expected outcome. */
export class ResultPage extends BasePage {
  readonly panel: Locator;
  readonly whyHeading: Locator;
  readonly reasons: Locator;
  readonly nextStepsHeading: Locator;
  readonly nextSteps: Locator;
  readonly startAgainButton: Locator;

  constructor(page: Page, readonly outcome: Outcome) {
    super(page, '/result', outcomeHeadings[outcome]);
    this.panel = page.locator('.govuk-panel');
    this.whyHeading = page.getByRole('heading', { level: 2, name: 'Why' });
    this.reasons = this.whyHeading.locator('xpath=following-sibling::ul[1]').getByRole('listitem');
    this.nextStepsHeading = page.getByRole('heading', { level: 2, name: 'What to do next' });
    this.nextSteps = this.nextStepsHeading.locator('xpath=following-sibling::p[1]');
    this.startAgainButton = page.getByRole('button', { name: 'Start again' });
  }

  override get expectedTitle(): string {
    return `${outcomeHeadings[this.outcome]} - ${titleSuffix}`;
  }

  async expectResult(reasons: readonly string[]): Promise<void> {
    await this.expectLoaded();
    await expect(this.panel).toContainText(this.headingText);
    if (reasons.length === 0) {
      await expect(this.whyHeading).toHaveCount(0);
    } else {
      await expect(this.whyHeading).toBeVisible();
    }
    await expect(this.reasons).toHaveText([...reasons]);
    await expect(this.nextSteps).toHaveText(nextSteps[this.outcome]);
    // Spec requirement 19: plain text, no links.
    await expect(this.nextSteps.getByRole('link')).toHaveCount(0);
    await expect(this.startAgainButton).toBeVisible();
  }

  /** Clears every answer and opens the start page (spec requirement 19a). */
  async startAgain(): Promise<void> {
    await this.startAgainButton.click();
  }
}
