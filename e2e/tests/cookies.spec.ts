import { test, expect } from '../fixtures/test';
import { CookiesPage } from '../pages/CookiesPage';
import { eligibleAnswers, scenarios } from '../data/outcomes';

// Spec requirement 30: GOV.UK cookie banner and cookies page, choice saved for a year.
test.describe('Cookie banner', () => {
  test('asks on first visit, with Accept all cookies, Set cookie preferences and View cookies', async ({ context, startPage }) => {
    await startPage.goto();
    const { cookieBanner } = startPage.layout;
    await expect(cookieBanner.heading).toBeVisible();
    await expect(cookieBanner.message).toBeVisible();
    await expect(cookieBanner.acceptButton).toBeVisible();
    await expect(cookieBanner.preferencesButton).toBeVisible();
    await expect(cookieBanner.viewCookiesLink).toBeVisible();
    expect(await CookiesPage.savedConsent(context)).toBeNull();
  });

  test('Accept all cookies saves the choice for a year and shows a focused confirmation', async ({ context, startPage }) => {
    await startPage.goto();
    const { cookieBanner } = startPage.layout;
    await cookieBanner.acceptAll();

    await expect(cookieBanner.confirmation).toBeFocused();
    await expect(cookieBanner.heading).toBeHidden();
    expect(await CookiesPage.savedConsent(context)).toEqual({ essential: true, analytics: true });
    const cookie = (await context.cookies()).find((c) => c.name === 'cookies_policy');
    const daysLeft = ((cookie?.expires ?? 0) * 1000 - Date.now()) / 86_400_000;
    expect(daysLeft).toBeGreaterThan(364);
    expect(daysLeft).toBeLessThanOrEqual(365);
  });

  test('Hide cookie message removes the banner and moves focus to the main content', async ({ startPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.acceptAll();
    await startPage.layout.cookieBanner.hide();
    await expect(startPage.layout.main).toBeFocused();
  });

  test('does not come back after a reload once accepted', async ({ page, startPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.acceptAll();
    await page.reload();
    await startPage.expectLoaded();
    await expect(startPage.layout.cookieBanner.region).toBeHidden();
  });

  test('stays until a choice is made, on every page of the journey', async ({ startPage, questionPage }) => {
    await startPage.goto();
    await startPage.start();
    await questionPage('propertyType').expectLoaded();
    await expect(startPage.layout.cookieBanner.heading).toBeVisible();
  });

  test('Set cookie preferences opens the cookies page', async ({ startPage, cookiesPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.preferencesButton.click();
    await cookiesPage.expectLoaded();
    await expect(cookiesPage.layout.cookieBanner.region).toBeHidden();
  });

  test('View cookies opens the cookies page', async ({ startPage, cookiesPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.viewCookiesLink.click();
    await cookiesPage.expectLoaded();
  });

  test('the confirmation links to the cookies page', async ({ startPage, cookiesPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.acceptAll();
    await startPage.layout.cookieBanner.changeSettingsLink.click();
    await cookiesPage.expectLoaded();
    await expect(cookiesPage.yes).toBeChecked();
  });

  test('can be used with the keyboard', async ({ page, startPage }) => {
    await startPage.goto();
    const { cookieBanner } = startPage.layout;
    await cookieBanner.acceptButton.focus();
    await page.keyboard.press('Enter');
    await expect(cookieBanner.confirmation).toBeFocused();
    await cookieBanner.hideButton.focus();
    await page.keyboard.press('Enter');
    await expect(cookieBanner.region).toBeHidden();
  });
});

test.describe('Cookies page', () => {
  test('is linked from the footer', async ({ startPage, cookiesPage }) => {
    await startPage.goto();
    await startPage.layout.cookiesLink.click();
    await cookiesPage.expectLoaded();
  });

  test('lists the essential cookie, says no analytics cookies are set, and defaults to No', async ({ cookiesPage }) => {
    await cookiesPage.goto();
    await cookiesPage.expectLoaded();
    await expect(cookiesPage.essentialCookiesTable.getByRole('cell')).toHaveText([
      'cookies_policy',
      'Saves your cookie settings',
      '1 year',
    ]);
    await expect(cookiesPage.noAnalyticsYet).toBeVisible();
    await expect(cookiesPage.no).toBeChecked();
  });

  for (const analytics of [true, false]) {
    test(`saving ${analytics ? 'Yes' : 'No'} records the choice and the banner no longer asks`, async ({ context, cookiesPage, statementPage }) => {
      await cookiesPage.goto();
      await cookiesPage.save(analytics);

      expect(await CookiesPage.savedConsent(context)).toEqual({ essential: true, analytics });
      await cookiesPage.layout.accessibilityStatementLink.click();
      await statementPage.expectLoaded();
      await expect(statementPage.layout.cookieBanner.region).toBeHidden();
    });
  }

  test('shows the saved choice after a reload', async ({ page, cookiesPage }) => {
    await cookiesPage.goto();
    await cookiesPage.save(true);
    await page.reload();
    await expect(cookiesPage.yes).toBeChecked();
  });

  test('a cookie choice does not affect the eligibility journey', async ({ journey, cookiesPage, resultPage }) => {
    await cookiesPage.goto();
    await cookiesPage.save(false);
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.checkEligibility();
    await resultPage('eligible').expectResult([]);
  });
});

test.describe('Going back after saving cookie settings', () => {
  test('from the banner mid-journey, returns to the same question with earlier answers kept', async ({ journey, cookiesPage, questionPage }) => {
    const income = await journey.answerUntil('income', eligibleAnswers);
    await income.layout.cookieBanner.viewCookiesLink.click();
    await cookiesPage.save(true);

    await cookiesPage.goBack();

    await income.expectLoaded();
    await income.back();
    const ownership = questionPage('ownership');
    await ownership.expectLoaded();
    await expect(ownership.radios.option(eligibleAnswers.ownership)).toBeChecked();
  });

  test('from Set cookie preferences, returns to the page it was opened from', async ({ journey, cookiesPage, checkAnswersPage }) => {
    await journey.answerAll(eligibleAnswers);
    await checkAnswersPage.layout.cookieBanner.preferencesButton.click();
    await cookiesPage.save(false);

    await cookiesPage.goBack();

    await checkAnswersPage.expectLoaded();
    await checkAnswersPage.expectAnswers(eligibleAnswers);
  });

  test('from the footer on the result page, returns to the same result', async ({ journey, cookiesPage, resultPage }) => {
    const notEligible = scenarios.find((s) => s.outcome === 'not-eligible');
    if (!notEligible) throw new Error('outcomes.ts needs a not-eligible scenario');
    const checkAnswers = await journey.answerAll(notEligible.answers);
    await checkAnswers.checkEligibility();
    const result = resultPage(notEligible.outcome);
    await result.layout.cookiesLink.click();
    await cookiesPage.save(false);

    await cookiesPage.goBack();

    await result.expectResult(notEligible.reasons);
  });

  test('from the confirmation link after accepting, returns to where the user was', async ({ startPage, cookiesPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.acceptAll();
    await startPage.layout.cookieBanner.changeSettingsLink.click();
    await cookiesPage.save(false);

    await cookiesPage.goBack();

    await startPage.expectLoaded();
  });

  test('while changing an answer, returns to the question in change mode', async ({ journey, cookiesPage, questionPage, checkAnswersPage }) => {
    const checkAnswers = await journey.answerAll(eligibleAnswers);
    await checkAnswers.change('heating');
    const heating = questionPage('heating');
    await heating.layout.cookiesLink.click();
    await cookiesPage.save(true);

    await cookiesPage.goBack();

    await heating.expectLoaded();
    await heating.answer('Oil boiler');
    await checkAnswersPage.expectAnswers({ ...eligibleAnswers, heating: 'Oil boiler' });
  });

  test('opened directly, goes back to the start page', async ({ cookiesPage, startPage }) => {
    await cookiesPage.goto();
    await cookiesPage.save(false);

    await cookiesPage.goBack();

    await startPage.expectLoaded();
  });
});
