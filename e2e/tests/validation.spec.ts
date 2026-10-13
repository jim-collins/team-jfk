import { test, expect } from '../fixtures/test';
import { eligibleAnswers } from '../data/outcomes';
import { questionOrder, questions } from '../data/questions';

// Spec requirements 20-24: what happens when the user presses Continue without choosing an answer.
for (const id of questionOrder) {
  test.describe(`${id}: no answer chosen`, () => {
    test('shows the GOV.UK error pattern and stays on the page', async ({ journey }) => {
      const question = await journey.answerUntil(id, eligibleAnswers);
      await question.expectNoValidationError();

      await question.continueWithoutAnswer();

      await question.expectValidationError();
    });

    test('the error summary link moves focus to the first radio', async ({ journey }) => {
      const question = await journey.answerUntil(id, eligibleAnswers);
      await question.continueWithoutAnswer();

      await question.errorSummary.link(questions[id].error).click();

      await expect(question.radios.radios.first()).toBeFocused();
    });

    test('pressing Continue again keeps the error and refocuses the summary', async ({ journey }) => {
      const question = await journey.answerUntil(id, eligibleAnswers);
      await question.continueWithoutAnswer();
      await question.radios.radios.first().focus();

      await question.continueWithoutAnswer();

      await question.expectValidationError();
    });

    test('choosing an answer and continuing clears the error', async ({ journey }) => {
      const question = await journey.answerUntil(id, eligibleAnswers);
      await question.continueWithoutAnswer();

      await question.answer(eligibleAnswers[id]);

      await expect(question.page).not.toHaveURL(question.url);
      await question.errorSummary.expectHidden();
    });
  });
}

test('an error shown on one question does not carry over to the next', async ({ journey, questionPage }) => {
  const propertyType = await journey.answerUntil('propertyType', eligibleAnswers);
  await propertyType.continueWithoutAnswer();
  await propertyType.answer('House');

  const ownership = questionPage('ownership');
  await ownership.expectLoaded();
  await ownership.expectNoValidationError();
});
