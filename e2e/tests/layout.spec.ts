import { test, expect } from '../fixtures/test';

test.describe('Start page', () => {
  test('shows the service name, who it is for, and a Start now button', async ({ startPage }) => {
    await startPage.goto();
    await startPage.expectLoaded();
    await expect(startPage.ownershipNotice).toBeVisible();
    await expect(startPage.startButton).toHaveClass(/govuk-button--start/);
  });

  test('Start now opens the first question', async ({ startPage, questionPage }) => {
    await startPage.goto();
    await startPage.start();
    await questionPage('propertyType').expectLoaded();
  });
});

test.describe('GOV.UK page template', () => {
  test('the skip link is the first thing the keyboard reaches and moves focus to the main content', async ({ page, startPage }) => {
    await startPage.goto();
    await page.keyboard.press('Tab');
    await expect(startPage.layout.skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(startPage.layout.main).toBeFocused();
  });

  test('has the GOV.UK header, Alpha phase banner and footer', async ({ startPage }) => {
    await startPage.goto();
    const { layout } = startPage;
    await expect(layout.homeLink).toBeVisible();
    await expect(layout.phaseTag).toHaveText('Alpha');
    await expect(layout.feedbackLink).toBeVisible();
    await expect(layout.accessibilityStatementLink).toBeVisible();
  });

  test('the footer links to the accessibility statement', async ({ startPage, statementPage }) => {
    await startPage.goto();
    await startPage.layout.accessibilityStatementLink.click();
    await statementPage.expectLoaded();
  });

  test('pages reflow without sideways scrolling', async ({ page, startPage }) => {
    await startPage.goto();
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
  });
});

test.describe('Cookie banner (spec requirement 30)', () => {
  test('shows on first visit with an essential-cookies message', async ({ startPage }) => {
    await startPage.goto();
    const { cookieBanner } = startPage.layout;
    await expect(cookieBanner.region).toBeVisible();
    await expect(cookieBanner.message).toBeVisible();
  });

  test('Hide this message hides it and moves focus to the main content', async ({ startPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.hide();
    await expect(startPage.layout.main).toBeFocused();
  });

  test('stays hidden while moving through the service, and comes back on reload', async ({ page, startPage, questionPage }) => {
    await startPage.goto();
    await startPage.layout.cookieBanner.hide();
    await startPage.start();
    await questionPage('propertyType').expectLoaded();
    await expect(startPage.layout.cookieBanner.region).toBeHidden();

    await page.reload();
    await expect(startPage.layout.cookieBanner.region).toBeVisible();
  });
});
