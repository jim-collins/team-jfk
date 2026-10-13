import { test, expect } from '../fixtures/test';
import { eligibleAnswers, scenarios } from '../data/outcomes';
import { questionOrder } from '../data/questions';

// Spec requirement 19a: Start again on the result page clears the answers and opens the start page.
const notEligible = scenarios.find((s) => s.outcome === 'not-eligible');
if (!notEligible) throw new Error('outcomes.ts needs a not-eligible scenario');

test.describe('Start again', () => {
  for (const scenario of scenarios) {
    test(`shows on the ${scenario.name} result and opens the start page`, async ({ journey, resultPage, startPage }) => {
      const checkAnswers = await journey.answerAll(scenario.answers);
      await checkAnswers.checkEligibility();
      const result = resultPage(scenario.outcome);
      await result.expectLoaded();

      await result.startAgain();

      await startPage.expectLoaded();
      await expect(startPage.startButton).toBeVisible();
    });
  }

  test('clears every answer, so each question starts with nothing chosen', async ({ journey, resultPage, startPage, questionPage }) => {
    const checkAnswers = await journey.answerAll(notEligible.answers);
    await checkAnswers.checkEligibility();
    await resultPage(notEligible.outcome).startAgain();
    await startPage.start();

    for (const id of questionOrder) {
      const question = questionPage(id);
      await question.expectLoaded();
      await question.radios.expectNothingChosen();
      await question.answer(eligibleAnswers[id]);
    }
  });

  test('a second check gives a result from the new answers only', async ({ journey, resultPage, startPage, questionPage, checkAnswersPage }) => {
    const firstCheck = await journey.answerAll(notEligible.answers);
    await firstCheck.checkEligibility();
    await resultPage(notEligible.outcome).startAgain();

    await startPage.start();
    for (const id of questionOrder) {
      await questionPage(id).answer(eligibleAnswers[id]);
    }
    await checkAnswersPage.expectAnswers(eligibleAnswers);
    await checkAnswersPage.checkEligibility();

    await resultPage('eligible').expectResult([]);
  });

  test('can be used with the keyboard', async ({ page, journey, resultPage, startPage }) => {
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.checkEligibility();
    const result = resultPage('eligible');
    await result.startAgainButton.focus();

    await page.keyboard.press('Enter');

    await startPage.expectLoaded();
  });
});
