import { useLocation } from 'react-router-dom';

// Router state for links to the cookies page: remembers the page the user was on,
// so "Go back to the page you were looking at" can return there with their answers.
// On the cookies page itself, keep the page they first came from.
export function useCookiesLinkState() {
  const { pathname, search, state } = useLocation();
  return pathname === '/cookies' ? state : { from: pathname + search };
}
