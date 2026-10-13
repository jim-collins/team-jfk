import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations, savePage, startAndAnswer as answerAll, SERVICE_TITLE as SERVICE } from './helpers';
import { questions } from '../src/questions';


const ELIGIBLE = ['House', 'Own outright', 'Up to £30,000', 'None', 'Gas boiler'];

describe('Check your answers', () => {
  it('lists every question and answer in a summary list, with a Change link for each (req 9, 10)', async () => {
    const user = userEvent.setup();
    await answerAll(user, ['Flat', 'Own with a mortgage', '£30,001 to £50,000', 'Loft only', 'Oil boiler']);

    expect(screen.getByRole('heading', { level: 1, name: 'Check your answers' })).toBeTruthy();
    expect(document.title).toBe(`Check your answers - ${SERVICE}`);
    const list = document.querySelector('dl.govuk-summary-list');
    const rows = [...list.querySelectorAll('.govuk-summary-list__row')].map((row) => [
      row.querySelector('dt').textContent,
      row.querySelector('.govuk-summary-list__value').textContent,
    ]);
    expect(rows).toEqual([
      ['Property type', 'Flat'],
      ['Ownership', 'Own with a mortgage'],
      ['Household income', '£30,001 to £50,000'],
      ['Existing insulation', 'Loft only'],
      ['Current heating', 'Oil boiler'],
    ]);
    for (const q of questions) {
      const change = screen.getByRole('link', { name: `Change ${q.summaryKey.toLowerCase()}` });
      expect(change.getAttribute('href')).toBe(`${q.path}?change=1`);
    }
    expect(screen.getByRole('link', { name: 'Back' }).getAttribute('href')).toBe('/heating');
    expect(await axeViolations()).toEqual([]);
    savePage('check-answers');
  });

  it('returns to Check your answers after a change, keeping the other answers (req 8, 11)', async () => {
    const user = userEvent.setup();
    await answerAll(user, ELIGIBLE);
    await user.click(screen.getByRole('link', { name: 'Change household income' }));
    expect(screen.getByLabelText('Up to £30,000').checked).toBe(true);
    await user.click(screen.getByLabelText('Over £50,000'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Check your answers' })).toBeTruthy();
    const values = [...document.querySelectorAll('.govuk-summary-list__value')].map((v) => v.textContent);
    expect(values).toEqual(['House', 'Own outright', 'Over £50,000', 'None', 'Gas boiler']);
  });

  it('sends Back to Check your answers while changing an answer, then still returns there (req 7, 11)', async () => {
    const user = userEvent.setup();
    await answerAll(user, ELIGIBLE);
    await user.click(screen.getByRole('link', { name: 'Change ownership' }));
    expect(screen.getByRole('link', { name: 'Back' }).getAttribute('href')).toBe('/check-answers');
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Check your answers' })).toBeTruthy();
  });

  it('opens the result page from the "Check eligibility" button (req 12)', async () => {
    const user = userEvent.setup();
    await answerAll(user, ELIGIBLE);
    await user.click(screen.getByRole('button', { name: 'Check eligibility' }));
    expect(document.querySelector('.govuk-panel h1')).toBeTruthy();
  });
});

describe('result page (req 17-19)', () => {
  async function resultFor(labels) {
    const user = userEvent.setup();
    await answerAll(user, labels);
    await user.click(screen.getByRole('button', { name: 'Check eligibility' }));
  }

  function reasons() {
    const heading = screen.queryByRole('heading', { level: 2, name: 'Why' });
    if (!heading) return [];
    return [...heading.nextElementSibling.querySelectorAll('li')].map((li) => li.textContent);
  }

  it('shows an eligible result with no reasons and how to apply', async () => {
    await resultFor(ELIGIBLE);
    const panel = document.querySelector('.govuk-panel');
    expect(within(panel).getByRole('heading', { level: 1 }).textContent).toBe(
      "You're likely to be eligible for the Green Home Grant"
    );
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.title).toBe(`You're likely to be eligible for the Green Home Grant - ${SERVICE}`);
    expect(reasons()).toEqual([]);
    expect(screen.getByRole('heading', { level: 2, name: 'What to do next' })).toBeTruthy();
    expect(
      screen.getByText("Apply for the Green Home Grant. You'll need proof of your household income and of home ownership.")
    ).toBeTruthy();
    expect(await axeViolations()).toEqual([]);
    savePage('result-eligible');
  });

  it('shows a partial result with its reason', async () => {
    await resultFor(['House', 'Own outright', '£30,001 to £50,000', 'None', 'Gas boiler']);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'You may be eligible for part of the Green Home Grant'
    );
    expect(reasons()).toEqual([
      'Your household income is between £30,001 and £50,000, so you can get part of the grant.',
    ]);
    expect(
      screen.getByText("Apply for the Green Home Grant. You'll need proof of your household income and of home ownership.")
    ).toBeTruthy();
    expect(await axeViolations()).toEqual([]);
    savePage('result-partial');
  });

  it('shows a not-eligible result with every reason and where else to look', async () => {
    await resultFor(['Bungalow', 'Own with a mortgage', 'Over £50,000', 'Loft only', 'Heat pump']);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      "You're not eligible for the Green Home Grant"
    );
    expect(reasons()).toEqual([
      'Your household income is over £50,000.',
      'Your home already has some insulation.',
      'Your home already has a heat pump.',
    ]);
    expect(
      screen.getByText('You can find other help with energy costs and home improvements on GOV.UK.')
    ).toBeTruthy();
    expect(screen.queryByText(/Apply for the Green Home Grant/)).toBeNull();
    expect(await axeViolations()).toEqual([]);
    savePage('result-not-eligible');
  });
});
