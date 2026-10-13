import fs from 'node:fs';
import path from 'node:path';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import App from '../src/App';
import { screen } from '@testing-library/react';

export { SERVICE_NAME, SERVICE_TITLE } from '../src/service';

const PAGES_DIR = path.join(__dirname, 'pages');

// Render the whole app at a given address.
export function renderAt(address) {
  return render(
    <MemoryRouter initialEntries={[address]}>
      <App />
    </MemoryRouter>
  );
}

// Start the service and answer questions in order by clicking each label then Continue.
// Pass as many labels as questions to answer; the browser is left on the next page.
export async function startAndAnswer(user, labels) {
  renderAt('/');
  await user.click(screen.getByRole('button', { name: 'Start now' }));
  for (const label of labels) {
    await user.click(screen.getByLabelText(label));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
  }
}

// Run axe on the current page. jsdom can't compute colours, so colour contrast
// is checked separately with Lighthouse on the pages saved by savePage().
export async function axeViolations() {
  const results = await axe.run(document, {
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`
  );
}

// Save the current page's HTML as tests/pages/<name>.html for the Lighthouse contrast check.
export function savePage(name) {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
  const html = `<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${document.title}</title>
</head>
<body class="govuk-template__body">
${document.body.innerHTML}
</body>
</html>
`;
  fs.writeFileSync(path.join(PAGES_DIR, `${name}.html`), html);
}
