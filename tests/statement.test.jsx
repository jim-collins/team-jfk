import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, axeViolations, savePage } from './helpers';

const SERVICE = 'Check if you can get a Green Home Grant - GOV.UK';

describe('accessibility statement (req 29)', () => {
  it('follows the GOV.UK accessibility statement structure, in order', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: 'Accessibility statement' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Accessibility statement for Check if you can get a Green Home Grant' })
    ).toBeTruthy();
    expect(document.title).toBe(`Accessibility statement - ${SERVICE}`);
    const headings = [...document.querySelectorAll('main h2, main h3')].map((h) => h.textContent);
    expect(headings).toEqual([
      'How you should be able to use this service',
      'How accessible this service is',
      'Feedback and contact information',
      'Reporting accessibility problems with this service',
      'Enforcement procedure',
      'Technical information about this service’s accessibility',
      'Compliance status',
      'Non-accessible content',
      'What we’re doing to improve accessibility',
      'Preparation of this accessibility statement',
    ]);
    expect(await axeViolations()).toEqual([]);
    savePage('accessibility-statement');
  });

  it('says who runs the service and how to ask for other formats, with placeholders still to fill', async () => {
    renderAt('/accessibility-statement');
    expect(screen.getByText(/This service is run by \[organisation to be confirmed\]/)).toBeTruthy();
    expect(screen.getAllByText(/\[contact email to be confirmed\]/).length).toBeGreaterThan(0);
    expect(screen.getByText(/\[response time to be confirmed\]/)).toBeTruthy();
    expect(screen.getByText(/large print, easy read, audio recording or braille/)).toBeTruthy();
  });

  it('says what has been tested and what has not (done.md checks 9 and 11)', async () => {
    renderAt('/accessibility-statement');
    expect(screen.getByText(/partially compliant with the Web Content Accessibility Guidelines version 2.2 AA standard/)).toBeTruthy();
    expect(screen.getByText(/not yet been tested with a screen reader/)).toBeTruthy();
    expect(screen.getAllByText(/contrast of radio button borders, the focus outline and the Start now arrow/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/feedback link/).length).toBeGreaterThan(0);
    expect(screen.getByText(/This service was last tested on 12 October 2026/)).toBeTruthy();
  });
});
