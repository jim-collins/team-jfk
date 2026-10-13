import { test as base } from '@playwright/test';
import type { Outcome } from '../data/outcomes';
import type { QuestionId } from '../data/questions';
import { AccessibilityStatementPage } from '../pages/AccessibilityStatementPage';
import { CheckAnswersPage } from '../pages/CheckAnswersPage';
import { CookiesPage } from '../pages/CookiesPage';
import { QuestionPage } from '../pages/QuestionPage';
import { ResultPage } from '../pages/ResultPage';
import { StartPage } from '../pages/StartPage';
import { Journey } from './journey';

interface PageFixtures {
  startPage: StartPage;
  questionPage: <Q extends QuestionId>(id: Q) => QuestionPage<Q>;
  checkAnswersPage: CheckAnswersPage;
  resultPage: (outcome: Outcome) => ResultPage;
  statementPage: AccessibilityStatementPage;
  cookiesPage: CookiesPage;
  journey: Journey;
}

/** Tests import `test` and `expect` from here, never from @playwright/test. */
export const test = base.extend<PageFixtures>({
  startPage: async ({ page }, use) => use(new StartPage(page)),
  questionPage: async ({ page }, use) => use((id) => new QuestionPage(page, id)),
  checkAnswersPage: async ({ page }, use) => use(new CheckAnswersPage(page)),
  resultPage: async ({ page }, use) => use((outcome) => new ResultPage(page, outcome)),
  statementPage: async ({ page }, use) => use(new AccessibilityStatementPage(page)),
  cookiesPage: async ({ page }, use) => use(new CookiesPage(page)),
  journey: async ({ page }, use) => use(new Journey(page)),
});

export { expect } from '@playwright/test';
