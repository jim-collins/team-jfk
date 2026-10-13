import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, axeViolations, savePage } from './helpers';

describe('page layout', () => {
  it('has a skip link as the first thing the keyboard reaches (req 26)', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.tab();
    expect(document.activeElement).toHaveProperty('textContent', 'Skip to main content');
    expect(document.activeElement.getAttribute('href')).toBe('#main-content');
  });

  it('moves focus to the main content when the skip link is used (req 26)', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: 'Skip to main content' }));
    expect(document.activeElement.id).toBe('main-content');
  });

  it('shows the GOV.UK header (req 25)', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'GOV.UK' })).toBeTruthy();
  });

  it('shows an Alpha phase banner with a feedback link (req 27)', () => {
    renderAt('/');
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'feedback' }).getAttribute('href')).toBe('#');
  });

  it('has a footer link to the accessibility statement (req 28)', () => {
    renderAt('/');
    const link = screen.getByRole('link', { name: 'Accessibility statement' });
    expect(link.getAttribute('href')).toBe('/accessibility-statement');
    expect(link.closest('footer')).toBeTruthy();
  });

  it('has a footer link to the cookies page (req 30)', () => {
    renderAt('/');
    const link = screen.getByRole('link', { name: 'Cookies' });
    expect(link.getAttribute('href')).toBe('/cookies');
    expect(link.closest('footer')).toBeTruthy();
  });
});
