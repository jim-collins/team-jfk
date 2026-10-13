import type { Page } from '@playwright/test';
import { serviceName, titleSuffix } from '../data/questions';
import { BasePage } from './BasePage';

export class AccessibilityStatementPage extends BasePage {
  constructor(page: Page) {
    super(page, '/accessibility-statement', `Accessibility statement for ${serviceName}`);
  }

  /** The tab title uses the short heading. */
  override get expectedTitle(): string {
    return `Accessibility statement - ${titleSuffix}`;
  }
}
