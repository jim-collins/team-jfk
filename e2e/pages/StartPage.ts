import type { Locator, Page } from '@playwright/test';
import { serviceName, titleSuffix } from '../data/questions';
import { BasePage } from './BasePage';

export class StartPage extends BasePage {
  readonly ownershipNotice: Locator;
  /** A link styled as a GOV.UK start button, with role="button". */
  readonly startButton: Locator;

  constructor(page: Page) {
    super(page, '/', serviceName);
    this.ownershipNotice = page.getByText('You must own your home to use this service.');
    this.startButton = page.getByRole('button', { name: 'Start now' });
  }

  /** The start page has no heading prefix: the title is just the service name. */
  override get expectedTitle(): string {
    return titleSuffix;
  }

  async start(): Promise<void> {
    await this.startButton.click();
  }
}
