import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { focusElement } from './focus';

// After each page change, move focus to the top of the page (so Tab reaches the skip link first)
// and read out the new title through the live region in `announcerRef`.
// Pages set their title in their own effects, which run before this one.
// Only a new path or query counts: not the first load (StrictMode runs effects twice) or a '#' link.
export function usePageChangeFocus(announcerRef) {
  const location = useLocation();
  const pageAddress = location.pathname + location.search;
  const lastPageAddress = useRef(pageAddress);
  useEffect(() => {
    if (lastPageAddress.current === pageAddress) return;
    lastPageAddress.current = pageAddress;
    announcerRef.current.textContent = document.title;
    focusElement(document.body);
  }, [announcerRef, pageAddress]);
}
