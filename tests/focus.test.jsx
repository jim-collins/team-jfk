import { StrictMode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import App from '../src/App';

// Render App the way main.jsx does (StrictMode), with a hook to navigate from the test.
function renderWithNavigate(address = '/') {
  let navigate;
  function Probe() {
    navigate = useNavigate();
    return null;
  }
  render(
    <StrictMode>
      <MemoryRouter initialEntries={[address]}>
        <App />
        <Probe />
      </MemoryRouter>
    </StrictMode>
  );
  return (to) => act(() => navigate(to));
}

const announcer = () => document.querySelector('[aria-live="polite"]');

describe('page-change focus (req 34)', () => {
  it('does not move focus or announce anything on the first page load, even in StrictMode', () => {
    renderWithNavigate('/');
    expect(announcer().textContent).toBe('');
    expect(document.body.hasAttribute('tabindex')).toBe(false);
  });

  it('does not treat a #-only link (the feedback link) as a page change', async () => {
    const user = userEvent.setup();
    const navigate = renderWithNavigate('/');
    await user.click(screen.getByRole('button', { name: 'Start now' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    const summary = document.querySelector('.govuk-error-summary');
    expect(document.activeElement).toBe(summary);

    announcer().textContent = '';
    await navigate({ hash: '#' });
    expect(document.activeElement).toBe(summary);
    expect(announcer().textContent).toBe('');
  });
});
