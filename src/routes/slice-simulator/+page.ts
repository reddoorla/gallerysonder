// Server-rendered on every host so hooks.server.ts, not netlify.toml's static
// [[headers]] block, decides this page's framing policy: it is the one route
// the Prismic Type Builder and Page Builder frame from another origin. While it
// was prerendered (the root layout's `prerender = "auto"`), Netlify served it as
// a static file with netlify.toml's `/*` CSP, `frame-ancestors 'self'
// https://*.prismic.io`, which leaves out https://prismic.io and the local
// simulator origin. See $lib/security/cms-framing.ts.
export const prerender = false;
