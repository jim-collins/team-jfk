import { test, expect } from '../fixtures/test';
import { eligibleAnswers, scenarios } from '../data/outcomes';
import { questionOrder, questions } from '../data/questions';

test.describe('Complete journey to a result', () => {
  for (const scenario of scenarios) {
    test(`${scenario.name} gives ${scenario.outcome}`, async ({ journey, resultPage }) => {
      const checkAnswers = await journey.answerAll(scenario.answers);
      await checkAnswers.expectAnswers(scenario.answers);

      await checkAnswers.checkEligibility();

      await resultPage(scenario.outcome).expectResult(scenario.reasons);
    });
  }
});

test.describe('Question pages', () => {
  for (const id of questionOrder) {
    test(`${id} shows its question, options in order and nothing chosen`, async ({ journey }) => {
      const question = await journey.answerUntil(id, eligibleAnswers);

      await question.radios.expectOptions(questions[id].options);
      await question.radios.expectNothingChosen();
      await expect(question.continueButton).toBeVisible();
      await expect(question.backLink).toBeVisible();
    });
  }

  test('the income question has hint text', async ({ journey }) => {
    const income = await journey.answerUntil('income', eligibleAnswers);
    await expect(income.hint).toHaveText(questions.income.hint);
    await expect(income.radios.fieldset).toHaveAccessibleDescription(questions.income.hint);
  });
});

test('the whole journey can be done with the keyboard', async ({ page, startPage, questionPage, checkAnswersPage, resultPage }) => {
  // focus() puts the keyboard on each control; everything after that is a key press.
  await startPage.goto();
  await startPage.startButton.focus();
  await page.keyboard.press('Enter');

  for (const id of questionOrder) {
    const question = questionPage(id);
    await question.expectLoaded();
    await question.radios.radios.first().focus();
    await page.keyboard.press('Space');
    await expect(question.radios.radios.first()).toBeChecked();
    await page.keyboard.press('Tab');
    await expect(question.continueButton).toBeFocused();
    await page.keyboard.press('Enter');
  }

  await checkAnswersPage.expectLoaded();
  await checkAnswersPage.checkEligibilityButton.focus();
  await page.keyboard.press('Enter');
  await resultPage('eligible').expectResult([]);
});
