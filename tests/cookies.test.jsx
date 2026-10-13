import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, axeViolations, savePage, startAndAnswer, SERVICE_NAME, SERVICE_TITLE } from './helpers';

const banner = () => screen.queryByRole('region', { name: `Cookies on ${SERVICE_NAME}` });
const consentCookie = () => document.cookie.split('; ').find((c) => c.startsWith('cookies_policy='));
const saved = () => JSON.parse(decodeURIComponent(consentCookie().split('=')[1]));

describe('cookie banner (req 30)', () => {
  it('asks whether the user accepts cookies, with two buttons and a View cookies link', async () => {
    renderAt('/');
    const region = within(banner());
    expect(region.getByRole('heading', { level: 2, name: 'Tell us whether you accept cookies' })).toBeTruthy();
    expect(
      region.getByText(
        'We use cookies to collect information about how you use this website. This information is used to make the website work as well as possible and improve our services.'
      )
    ).toBeTruthy();
    expect(region.getByRole('button', { name: 'Accept all cookies' })).toBeTruthy();
    expect(region.getByRole('button', { name: 'Set cookie preferences' }).getAttribute('href')).toBe('/cookies');
    expect(region.getByRole('link', { name: 'View cookies' }).getAttribute('href')).toBe('/cookies');
    expect(consentCookie()).toBeUndefined();
    expect(await axeViolations()).toEqual([]);
    savePage('start-cookie-banner');
  });

  it('Accept all cookies saves the choice for a year and shows a focused confirmation', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Accept all cookies' }));

    expect(saved()).toEqual({ essential: true, analytics: true });
    const confirmation = within(banner()).getByRole('alert');
    expect(confirmation.textContent).toContain('You’ve accepted additional cookies.');
    expect(within(confirmation).getByRole('link', { name: 'change your cookie settings' }).getAttribute('href')).toBe('/cookies');
    expect(document.activeElement).toBe(confirmation);
    expect(await axeViolations()).toEqual([]);
    savePage('start-cookie-accepted');
  });

  it('Hide cookie message removes the banner and moves focus to the main content', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Accept all cookies' }));
    await user.click(screen.getByRole('button', { name: 'Hide cookie message' }));

    expect(banner()).toBeNull();
    expect(document.activeElement.id).toBe('main-content');
    expect(await axeViolations()).toEqual([]);
    savePage('start-cookie-hidden');
  });

  it('does not ask again once a choice has been saved (e.g. after a reload)', () => {
    document.cookie = 'cookies_policy=' + encodeURIComponent('{"essential":true,"analytics":false}') + '; path=/';
    renderAt('/');
    expect(banner()).toBeNull();
  });

  it('asks again if the saved cookie is not valid', () => {
    document.cookie = 'cookies_policy=not-json; path=/';
    renderAt('/');
    expect(banner()).toBeTruthy();
  });

  it('Set cookie preferences opens the cookies page, which does not show the banner', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Set cookie preferences' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Cookies' })).toBeTruthy();
    expect(banner()).toBeNull();
  });
});

describe('cookies page (req 30)', () => {
  it('lists the essential cookie, explains analytics and defaults to No', async () => {
    renderAt('/cookies');
    expect(document.title).toBe(`Cookies - ${SERVICE_TITLE}`);
    const table = screen.getByRole('table', { name: 'Essential cookies we use' });
    const cells = within(table).getAllByRole('cell').map((cell) => cell.textContent);
    expect(cells).toEqual(['cookies_policy', 'Saves your cookie settings', '1 year']);
    expect(screen.getByText(/This service does not set any analytics cookies yet/)).toBeTruthy();
    const question = screen.getByRole('group', { name: 'Do you want to accept analytics cookies?' });
    expect(within(question).getByLabelText('No').checked).toBe(true);
    expect(within(question).getByLabelText('Yes').checked).toBe(false);
    expect(await axeViolations()).toEqual([]);
    savePage('cookies');
  });

  it('saves the choice and shows a focused success banner', async () => {
    const user = userEvent.setup();
    renderAt('/cookies');
    await user.click(screen.getByLabelText('Yes'));
    await user.click(screen.getByRole('button', { name: 'Save cookie settings' }));

    expect(saved()).toEqual({ essential: true, analytics: true });
    const success = screen.getByRole('alert');
    expect(within(success).getByRole('heading', { name: 'Success' })).toBeTruthy();
    expect(success.textContent).toContain('You’ve set your cookie preferences.');
    expect(document.activeElement).toBe(success);
    expect(await axeViolations()).toEqual([]);
    savePage('cookies-saved');
  });

  it('saving No records analytics as refused, and the banner stays away on other pages', async () => {
    const user = userEvent.setup();
    renderAt('/cookies');
    await user.click(screen.getByRole('button', { name: 'Save cookie settings' }));
    expect(saved()).toEqual({ essential: true, analytics: false });

    await user.click(screen.getByRole('link', { name: 'Accessibility statement' }));
    expect(banner()).toBeNull();
  });

  it('after saving, links back to the question the user was on, with their answers kept', async () => {
    const user = userEvent.setup();
    await startAndAnswer(user, ['Flat', 'Own with a mortgage']);
    expect(screen.getByRole('heading', { level: 1, name: 'What is your household income?' })).toBeTruthy();

    await user.click(screen.getByRole('link', { name: 'View cookies' }));
    await user.click(screen.getByRole('button', { name: 'Save cookie settings' }));
    await user.click(screen.getByRole('link', { name: 'Go back to the page you were looking at' }));

    expect(screen.getByRole('heading', { level: 1, name: 'What is your household income?' })).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByLabelText('Own with a mortgage').checked).toBe(true);
  });

  it('remembers the page it came from after more than one save', async () => {
    const user = userEvent.setup();
    renderAt('/accessibility-statement');
    await user.click(screen.getByRole('button', { name: 'Set cookie preferences' }));
    await user.click(screen.getByRole('button', { name: 'Save cookie settings' }));
    await user.click(screen.getByLabelText('Yes'));
    await user.click(screen.getByRole('button', { name: 'Save cookie settings' }));
    expect(screen.getByRole('link', { name: 'Go back to the page you were looking at' }).getAttribute('href')).toBe(
      '/accessibility-statement'
    );
  });

  it('links back to the start page when opened directly', async () => {
    const user = userEvent.setup();
    renderAt('/cookies');
    await user.click(screen.getByRole('button', { name: 'Save cookie settings' }));
    expect(screen.getByRole('link', { name: 'Go back to the page you were looking at' }).getAttribute('href')).toBe('/');
  });

  it('shows the saved choice when opened again', () => {
    document.cookie = 'cookies_policy=' + encodeURIComponent('{"essential":true,"analytics":true}') + '; path=/';
    renderAt('/cookies');
    expect(screen.getByLabelText('Yes').checked).toBe(true);
  });
});
