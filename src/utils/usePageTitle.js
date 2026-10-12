import { useEffect } from 'react';

const SERVICE = 'Check if you can get a Green Home Grant - GOV.UK';

// Set the tab title: "<heading> - <service> - GOV.UK", with "Error: " in front when the page has an error.
export function usePageTitle(heading, hasError = false) {
  useEffect(() => {
    const title = heading ? `${heading} - ${SERVICE}` : SERVICE;
    document.title = hasError ? `Error: ${title}` : title;
  }, [heading, hasError]);
}
