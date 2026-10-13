import { test, expect } from '../fixtures/test';
import { eligibleAnswers } from '../data/outcomes';
import { questionOrder, questions, type Answers } from '../data/questions';

const changedAnswers: Answers = { ...eligibleAnswers, income: 'Over £50,000' };

test.describe('Back links (spec requirement 7)', () => {
  test('the first question goes back to the start page', async ({ journey }) => {
    const first = await journey.answerUntil('propertyType', eligibleAnswers);
    await first.back();
    await journey.start.expectLoaded();
  });

  for (const [index, id] of questionOrder.entries()) {
    const previous = questionOrder[index - 1];
    if (!previous) continue; // the first question is covered above
    test(`${id} goes back to ${previous} with its answer still chosen`, async ({ journey, questionPage }) => {
      const question = await journey.answerUntil(id, eligibleAnswers);
      await question.back();

      const previousPage = questionPage(previous);
      await previousPage.expectLoaded();
      await expect(previousPage.radios.option(eligibleAnswers[previous])).toBeChecked();
    });
  }

  test('Check your answers goes back to the heating question', async ({ journey, questionPage }) => {
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.backLink.click();
    await questionPage('heating').expectLoaded();
  });
});

test.describe('Changing an answer (spec requirements 8-11)', () => {
  for (const id of questionOrder) {
    test(`Change ${questions[id].summaryKey.toLowerCase()} opens the question with the answer chosen`, async ({ journey, questionPage }) => {
      const checkAnswers = await journey.answerAll(eligibleAnswers);
      await checkAnswers.change(id);

      const question = questionPage(id);
      await question.expectLoaded();
      await expect(question.radios.option(eligibleAnswers[id])).toBeChecked();
    });
  }

  test('Continue after a change returns to Check your answers with the new answer', async ({ journey, questionPage, checkAnswersPage, resultPage }) => {
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.change('income');

    await questionPage('income').answer(changedAnswers.income);

    await checkAnswersPage.expectLoaded();
    await checkAnswersPage.expectAnswers(changedAnswers);
    await checkAnswersPage.checkEligibility();
    await resultPage('not-eligible').expectResult(['Your household income is over £50,000.']);
  });

  test('Back after a change returns to Check your answers without changing anything', async ({ journey, questionPage, checkAnswersPage }) => {
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.change('insulation');

    const insulation = questionPage('insulation');
    await insulation.radios.choose('Loft and walls');
    await insulation.back();

    await checkAnswersPage.expectLoaded();
    await checkAnswersPage.expectAnswers(eligibleAnswers);
  });
});

test.describe('Skipping ahead or reloading (spec requirement 13)', () => {
  for (const id of questionOrder.slice(1)) {
    test(`opening ${questions[id].path} directly sends the user to the first question`, async ({ page, questionPage }) => {
      await page.goto(questions[id].path);
      await questionPage('propertyType').expectLoaded();
    });
  }

  for (const path of ['/check-answers', '/result']) {
    test(`opening ${path} directly sends the user to the first question`, async ({ page, questionPage }) => {
      await page.goto(path);
      await questionPage('propertyType').expectLoaded();
    });
  }

  test('reloading part-way through loses the answers and starts again', async ({ page, journey, questionPage }) => {
    await journey.answerUntil('insulation', eligibleAnswers);
    await page.reload();
    await questionPage('propertyType').expectLoaded();
  });

  test('reloading the result page starts again', async ({ page, journey, questionPage }) => {
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.checkEligibility();
    await page.reload();
    await questionPage('propertyType').expectLoaded();
  });
});
