import type { Locator, Page } from '@playwright/test';
import { SummaryList } from '../components/SummaryList';
import { questionOrder, questions, type Answers, type QuestionId } from '../data/questions';
import { BasePage } from './BasePage';

export class CheckAnswersPage extends BasePage {
  readonly summary: SummaryList;
  readonly checkEligibilityButton: Locator;

  constructor(page: Page) {
    super(page, '/check-answers', 'Check your answers');
    this.summary = new SummaryList(page);
    this.checkEligibilityButton = page.getByRole('button', { name: 'Check eligibility' });
  }

  async change(id: QuestionId): Promise<void> {
    await this.summary.changeLink(questions[id].summaryKey).click();
  }

  async expectAnswers(answers: Answers): Promise<void> {
    await this.summary.expectRows(questionOrder.map((id) => [questions[id].summaryKey, answers[id]] as const));
  }

  async checkEligibility(): Promise<void> {
    await this.checkEligibilityButton.click();
  }
}
