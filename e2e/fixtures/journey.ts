import { questionOrder, type Answers, type QuestionId } from '../data/questions';
import { CheckAnswersPage } from '../pages/CheckAnswersPage';
import { QuestionPage } from '../pages/QuestionPage';
import { StartPage } from '../pages/StartPage';
import type { Page } from '@playwright/test';

/**
 * Moves through the service by clicking, as a user would.
 * Answers live only in the app's memory, so after the first page.goto every step must be a click, not a goto.
 */
export class Journey {
  readonly start: StartPage;
  readonly checkAnswers: CheckAnswersPage;

  constructor(private readonly page: Page) {
    this.start = new StartPage(page);
    this.checkAnswers = new CheckAnswersPage(page);
  }

  question<Q extends QuestionId>(id: Q): QuestionPage<Q> {
    return new QuestionPage(this.page, id);
  }

  /** From the start page, answer every question before `stopAt`, leaving the browser on `stopAt`. */
  async answerUntil(stopAt: QuestionId, answers: Answers): Promise<QuestionPage> {
    await this.start.goto();
    await this.start.start();
    for (const id of questionOrder) {
      const question = this.question(id);
      await question.expectLoaded();
      if (id === stopAt) return question;
      await question.answer(answers[id]);
    }
    throw new Error(`Unknown question ${stopAt}`);
  }

  /** From the start page, answer all five questions, ending on Check your answers. */
  async answerAll(answers: Answers): Promise<CheckAnswersPage> {
    await this.answerUntil('heating', answers);
    await this.question('heating').answer(answers.heating);
    await this.checkAnswers.expectLoaded();
    return this.checkAnswers;
  }
}
