// The user's cookie choice, kept in an essential cookie for a year (the GOV.UK pattern).
// The service sets no analytics cookies yet; the saved choice is used once it does.
export const CONSENT_COOKIE = 'cookies_policy';
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

// Returns { analytics: true | false }, or null if the user hasn't chosen yet.
export function readConsent() {
  const entry = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`));
  if (!entry) return null;
  try {
    const { analytics } = JSON.parse(decodeURIComponent(entry.slice(CONSENT_COOKIE.length + 1)));
    return typeof analytics === 'boolean' ? { analytics } : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics) {
  const value = encodeURIComponent(JSON.stringify({ essential: true, analytics }));
  document.cookie = `${CONSENT_COOKIE}=${value}; max-age=${ONE_YEAR_IN_SECONDS}; path=/; SameSite=Lax`;
  return { analytics };
}
