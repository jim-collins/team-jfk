import { useEffect } from 'react';
import { SERVICE_TITLE } from '../service';

// Set the tab title: "<heading> - <service> - GOV.UK", with "Error: " in front when the page has an error.
export function usePageTitle(heading, hasError = false) {
  useEffect(() => {
    const title = heading ? `${heading} - ${SERVICE_TITLE}` : SERVICE_TITLE;
    document.title = hasError ? `Error: ${title}` : title;
  }, [heading, hasError]);
}
