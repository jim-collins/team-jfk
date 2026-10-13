import { expect, type Locator, type Page } from '@playwright/test';
import { ErrorSummary } from '../components/ErrorSummary';
import { RadioGroup } from '../components/RadioGroup';
import { questions, titleSuffix, type OptionLabel, type QuestionId } from '../data/questions';
import { BasePage } from './BasePage';

/** One question page: a radio group, Continue, Back and the GOV.UK error pattern. Shared by all five questions. */
export class QuestionPage<Q extends QuestionId = QuestionId> extends BasePage {
  readonly question: (typeof questions)[Q];
  readonly backLink: Locator;
  readonly hint: Locator;
  readonly radios: RadioGroup<OptionLabel<Q>>;
  readonly continueButton: Locator;
  readonly errorSummary: ErrorSummary;

  constructor(page: Page, readonly id: Q) {
    const question = questions[id];
    super(page, question.path, question.heading);
    this.question = question;
    this.backLink = page.getByRole('link', { name: 'Back', exact: true });
    this.hint = page.locator('.govuk-hint');
    this.radios = new RadioGroup<OptionLabel<Q>>(page, question.heading);
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorSummary = new ErrorSummary(page);
  }

  /** Opens this question as if from a Change link on Check your answers. */
  async gotoChange(): Promise<void> {
    await this.page.goto(`${this.path}?change=1`);
  }

  async answer(label: OptionLabel<Q>): Promise<void> {
    await this.radios.choose(label);
    await this.continueButton.click();
  }

  /** Presses Continue with nothing chosen. */
  async continueWithoutAnswer(): Promise<void> {
    await this.continueButton.click();
  }

  async back(): Promise<void> {
    await this.backLink.click();
  }

  /** Spec requirements 20-22: summary, inline message, focus and "Error: " title, still on this page. */
  async expectValidationError(): Promise<void> {
    const message = this.question.error;
    await expect(this.page).toHaveURL(this.url);
    await this.errorSummary.expectShowing(message);
    await this.radios.expectError(message);
    await expect(this.page).toHaveTitle(`Error: ${this.headingText} - ${titleSuffix}`);
  }

  async expectNoValidationError(): Promise<void> {
    await this.errorSummary.expectHidden();
    await this.radios.expectNoError();
    await expect(this.page).toHaveTitle(this.expectedTitle);
  }
}
