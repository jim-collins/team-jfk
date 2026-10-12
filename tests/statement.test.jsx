import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAt, axeViolations, savePage } from './helpers';

const SERVICE = 'Check if you can get a Green Home Grant - GOV.UK';

describe('accessibility statement (req 29)', () => {
  it('follows the GOV.UK sample structure, with the placeholder contact and the known gap', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('link', { name: 'Accessibility statement' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Accessibility statement for Check if you can get a Green Home Grant' })
    ).toBeTruthy();
    expect(document.title).toBe(`Accessibility statement - ${SERVICE}`);
    // "Compliance status" is an h3 under "Technical information", as in the GOV.UK sample.
    const sections = [...document.querySelectorAll('main h2, main h3')].map((h) => h.textContent);
    expect(sections).toEqual(
      expect.arrayContaining([
        'How accessible this service is',
        'Feedback and contact information',
        'Enforcement procedure',
        'Technical information about this service’s accessibility',
        'Compliance status',
        'What we’re doing to improve accessibility',
        'Preparation of this accessibility statement',
      ])
    );
    expect(screen.getAllByText(/\[contact email to be confirmed\]/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/feedback link/).length).toBeGreaterThan(0);
    expect(await axeViolations()).toEqual([]);
    savePage('accessibility-statement');
  });
});
