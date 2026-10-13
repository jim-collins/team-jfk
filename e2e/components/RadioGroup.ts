import { expect, type Locator, type Page } from '@playwright/test';

/** GOV.UK radios in a fieldset whose legend is the question: https://design-system.service.gov.uk/components/radios/ */
export class RadioGroup<Label extends string = string> {
  readonly fieldset: Locator;
  readonly radios: Locator;
  readonly errorMessage: Locator;
  /** The wrapper that gets govuk-form-group--error. */
  readonly formGroup: Locator;

  constructor(page: Page, legend: string) {
    this.fieldset = page.getByRole('group', { name: legend });
    this.radios = this.fieldset.getByRole('radio');
    this.errorMessage = this.fieldset.locator('.govuk-error-message');
    this.formGroup = page.locator('.govuk-form-group').filter({ has: this.fieldset });
  }

  option(label: Label): Locator {
    return this.fieldset.getByRole('radio', { name: label, exact: true });
  }

  /** Clicks the label text, as a user would (spec requirement 5). */
  async choose(label: Label): Promise<void> {
    await this.fieldset.getByText(label, { exact: true }).click();
  }

  async expectOptions(labels: readonly Label[]): Promise<void> {
    await expect(this.fieldset.locator('label')).toHaveText([...labels]);
  }

  async expectNothingChosen(): Promise<void> {
    for (const radio of await this.radios.all()) {
      await expect(radio).not.toBeChecked();
    }
  }

  async expectError(message: string): Promise<void> {
    // GOV.UK puts a visually hidden "Error:" before the message.
    await expect(this.errorMessage).toHaveText(`Error: ${message}`);
    await expect(this.formGroup).toHaveClass(/govuk-form-group--error/);
    // The fieldset is described by the error, so screen readers hear it with the question.
    await expect(this.fieldset).toHaveAccessibleDescription(new RegExp(message));
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).toHaveCount(0);
    await expect(this.formGroup).not.toHaveClass(/govuk-form-group--error/);
  }
}
