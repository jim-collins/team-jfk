import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, axeViolations, savePage } from './helpers';
import { questions } from '../src/questions';

const SERVICE = 'Check if you can get a Green Home Grant - GOV.UK';

// Start the service and answer the questions before `index` with their first option.
async function answerUpTo(user, index) {
  renderAt('/');
  await user.click(screen.getByRole('button', { name: 'Start now' }));
  for (const q of questions.slice(0, index)) {
    await user.click(screen.getByLabelText(q.options[0].label));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
  }
}

describe('start page (req 1, 2)', () => {
  it('describes the service, says you must own your home, and starts the questions', async () => {
    const user = userEvent.setup();
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Check if you can get a Green Home Grant' })).toBeTruthy();
    expect(screen.getByText('You must own your home to use this service.')).toBeTruthy();
    expect(document.title).toBe(SERVICE);
    expect(await axeViolations()).toEqual([]);
    savePage('start');

    await user.click(screen.getByRole('button', { name: 'Start now' }));
    expect(screen.getByRole('heading', { level: 1, name: questions[0].heading })).toBeTruthy();
  });
});

describe('question pages', () => {
  it('go in order from property type to heating, then Check your answers (req 2, 6)', async () => {
    const user = userEvent.setup();
    await answerUpTo(user, 0);
    for (const q of questions) {
      expect(screen.getByRole('heading', { level: 1, name: q.heading })).toBeTruthy();
      await user.click(screen.getByLabelText(q.options[0].label));
      await user.click(screen.getByRole('button', { name: 'Continue' }));
    }
    expect(screen.getByRole('heading', { level: 1, name: 'Check your answers' })).toBeTruthy();
  });

  questions.forEach((q, index) => {
    describe(q.heading, () => {
      it('has the question as the legend of a radio group, with a label for every answer (req 3, 4, 5, 36)', async () => {
        const user = userEvent.setup();
        await answerUpTo(user, index);
        const group = screen.getByRole('group', { name: q.heading });
        const radios = within(group).getAllByRole('radio');
        expect(radios.map((r) => r.labels[0].textContent)).toEqual(q.options.map((o) => o.label));
        if (q.hint) expect(within(group).getByText(q.hint)).toBeTruthy();

        await user.click(screen.getByText(q.options[1].label));
        expect(radios[1].checked).toBe(true);
      });

      it('has its own tab title and a Back link to the previous page (req 7, 31)', async () => {
        const user = userEvent.setup();
        await answerUpTo(user, index);
        expect(document.title).toBe(`${q.heading} - ${SERVICE}`);
        const back = index === 0 ? '/' : questions[index - 1].path;
        expect(screen.getByRole('link', { name: 'Back' }).getAttribute('href')).toBe(back);
        expect(await axeViolations()).toEqual([]);
        savePage(q.id);
      });

      it('shows the GOV.UK error pattern when Continue is pressed with no answer (req 20-23)', async () => {
        const user = userEvent.setup();
        await answerUpTo(user, index);
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        const summary = screen.getByRole('alert');
        expect(within(summary).getByRole('heading', { name: 'There is a problem' })).toBeTruthy();
        const link = within(summary).getByRole('link', { name: q.error });
        expect(document.querySelector('.govuk-error-message').textContent).toBe(`Error: ${q.error}`);
        expect(document.activeElement).toBe(summary.closest('.govuk-error-summary'));
        expect(document.title).toBe(`Error: ${q.heading} - ${SERVICE}`);
        expect(screen.getByRole('heading', { level: 1, name: q.heading })).toBeTruthy();
        expect(await axeViolations()).toEqual([]);
        savePage(`${q.id}-error`);

        await user.click(link);
        expect(document.activeElement).toBe(screen.getByLabelText(q.options[0].label));
      });
    });
  });

  it('clears the error once an answer is chosen (req 24)', async () => {
    const user = userEvent.setup();
    await answerUpTo(user, 0);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.queryByRole('alert')).toBeTruthy();
    await user.click(screen.getByLabelText('Flat'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(document.title).toBe(`${questions[0].heading} - ${SERVICE}`);
  });

  it('keeps an answer selected when the user goes Back (req 8)', async () => {
    const user = userEvent.setup();
    await answerUpTo(user, 0);
    await user.click(screen.getByLabelText('Bungalow'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByLabelText('Own with a mortgage'));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByLabelText('Own with a mortgage').checked).toBe(true);
    await user.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByLabelText('Bungalow').checked).toBe(true);
  });

  it('moves focus to the top of each new page and announces its title (req 34)', async () => {
    const user = userEvent.setup();
    await answerUpTo(user, 1);
    expect(document.activeElement).toBe(document.body);
    expect(document.querySelector('[aria-live="polite"]').textContent).toBe(`${questions[1].heading} - ${SERVICE}`);
    // user-event's Tab can't move on from a focused <body> (it lists body twice), so check
    // the first tabbable element instead. The manual keyboard check covers real browsers.
    const firstTabbable = document.querySelector('a[href], button, input, [tabindex]:not([tabindex="-1"])');
    expect(firstTabbable.textContent).toBe('Skip to main content');
  });
});

describe('skipping ahead (req 13)', () => {
  it.each(['/ownership', '/heating', '/check-answers', '/result'])(
    'sends someone who opens %s with no answers to the first question',
    (address) => {
      renderAt(address);
      expect(screen.getByRole('heading', { level: 1, name: questions[0].heading })).toBeTruthy();
    }
  );
});
