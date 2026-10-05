/**
 * Reads the CSRF token to send back as the `X-CSRFToken` header on the
 * `/order` fetch (the standard Django AJAX CSRF pattern) — without touching
 * `views.py`/urls.py or the CSRF middleware at all.
 *
 * Primary source: the `<meta name="csrf-token" content="{{ csrf_token }}">`
 * tag Django renders into the production shell template
 * (app/templates/index.html) — always present when the page is actually
 * served by Django, which is the scenario that matters for the real
 * acceptance check.
 *
 * Fallback: the `csrftoken` cookie Django's CsrfViewMiddleware sets on any
 * response that renders a token. This covers `npm run dev` (Vite serves its
 * own bare index.html, so there is no meta tag) as long as the browser has
 * loaded the Django-served page at least once in the same session — the
 * cookie is shared across localhost ports.
 */
export function getCsrfToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]');
  const fromMeta = meta?.getAttribute('content');
  if (fromMeta) return fromMeta;

  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
