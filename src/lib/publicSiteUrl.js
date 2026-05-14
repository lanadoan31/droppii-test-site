/** Path on this SPA where the seller test-taking flow is mounted (see `src/main.jsx`). */
export const SELLER_TEST_PATH = '/take';

/**
 * Public origin for links shown to admins (copy / share).
 * Optional override: `VITE_PUBLIC_SITE_URL` (no trailing slash) if the seller entry is not same origin as admin.
 */
export function getPublicSiteOrigin() {
  const fromEnv = import.meta.env.VITE_PUBLIC_SITE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

/** Full URL sellers should open to take tests on this deployment. */
export function getSellerTestEntryUrl() {
  const o = getPublicSiteOrigin();
  return o ? `${o}${SELLER_TEST_PATH}` : SELLER_TEST_PATH;
}
