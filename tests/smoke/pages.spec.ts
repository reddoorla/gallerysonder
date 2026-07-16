import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import { smokeRoutes } from './routes';

// Console messages we don't care about. Add patterns here only after seeing them
// in CI and confirming they aren't actionable. Patterns are matched against both
// the message text and the offending resource URL — Chromium's "Failed to load
// resource" text omits the URL, so URL matching catches third-party network noise.
const ALLOWED_CONSOLE_PATTERNS: RegExp[] = [
	// Vimeo iframe embeds + their CDN telemetry endpoints occasionally 403 from
	// cloud IPs due to bot detection.
	/vimeo/i,
	// Turnstile (Cloudflare) telemetry occasionally surfaces in console.
	/turnstile|challenges\.cloudflare/i
];

function attachConsoleWatcher(page: Page, extraAllowed: RegExp[] = []) {
	const errors: string[] = [];
	const allowed = [...ALLOWED_CONSOLE_PATTERNS, ...extraAllowed];
	const isAllowed = (s: string) => !!s && allowed.some((re) => re.test(s));

	page.on('console', (msg: ConsoleMessage) => {
		if (msg.type() !== 'error') return;
		const text = msg.text();
		const url = msg.location()?.url ?? '';
		if (isAllowed(text) || isAllowed(url)) return;
		errors.push(`[console.error] ${text}${url ? ` (${url})` : ''}`);
	});

	page.on('pageerror', (err) => {
		if (isAllowed(err.message)) return;
		errors.push(`[pageerror] ${err.message}`);
	});

	return errors;
}

for (const route of smokeRoutes) {
	test(`${route.path} (${route.name}) loads with no console errors`, async ({ page }) => {
		const errors = attachConsoleWatcher(page);
		const response = await page.goto(route.path, {
			waitUntil: 'domcontentloaded'
		});
		expect(response?.status(), `HTTP status for ${route.path}`).toBe(route.expectStatus ?? 200);
		if (route.hydrationMarker) {
			await expect(
				page.locator(route.hydrationMarker),
				`hydration marker "${route.hydrationMarker}" on ${route.path}`
			).toBeVisible();
		}
		expect(errors, `console errors on ${route.path}`).toEqual([]);
	});
}

test('first nav-linked page loads with no console errors', async ({ page }) => {
	// Every non-home public page on this site is served by the [uid] catch-all
	// (and its artists/essays/exhibitions/news siblings), so there are no static
	// paths to hardcode. Discover a real one the way a visitor would: open the
	// full-screen menu (its links only mount while it's open) and follow the
	// first internal link (nav links come from the Prismic nav doc, so this
	// tracks the live content).
	const errors = attachConsoleWatcher(page);
	await page.goto('/', { waitUntil: 'domcontentloaded' });
	// The toggle's click handler only exists after hydration, and domcontentloaded
	// doesn't wait for that — so retry the click until the menu actually opens.
	// aria-expanded reflects real component state (SSR'd "false", flips on open),
	// which keeps the retry from toggling the menu back shut.
	const toggle = page.getByRole('button', { name: 'Toggle navigation menu' });
	await expect(async () => {
		if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
		await expect(page.locator('#main-nav')).toBeVisible({ timeout: 1000 });
	}).toPass({ timeout: 15000 });
	const firstInternalHref = await page.locator('#main-nav a').evaluateAll((els) =>
		els
			.map((el) => el.getAttribute('href'))
			.map((href) => {
				if (!href) return null;
				try {
					const url = new URL(href, location.origin);
					return url.origin === location.origin ? url.pathname : null;
				} catch {
					return null;
				}
			})
			.find((path) => !!path && path !== '/')
	);
	expect(firstInternalHref, 'found an internal nav link in the menu').toBeTruthy();

	const response = await page.goto(firstInternalHref!, { waitUntil: 'domcontentloaded' });
	expect(response?.status(), `HTTP status for ${firstInternalHref}`).toBe(200);
	await expect(page.locator('footer')).toBeVisible();
	expect(errors, `console errors on ${firstInternalHref}`).toEqual([]);
});

test('/health reports ok', async ({ request }) => {
	// The Report Health Gate probe endpoint — asserts the server can reach
	// Prismic. The home-page test above already hard-depends on Prismic, so
	// this adds no new flake surface.
	const response = await request.get('/health');
	expect(response.status(), 'HTTP status for /health').toBe(200);
	const body = await response.json();
	expect(body.ok, `/health body: ${JSON.stringify(body)}`).toBe(true);
});

test('404 page renders the custom error component', async ({ page }) => {
	// The browser logs a top-level "Failed to load resource: 404" for the page
	// itself — expected on a 404 route, not a bug. Allow it here.
	const errors = attachConsoleWatcher(page, [/Failed to load resource.*404/i]);
	const response = await page.goto('/this-uid-does-not-exist', {
		waitUntil: 'domcontentloaded'
	});
	expect(response?.status()).toBe(404);
	// src/routes/+error.svelte renders `<h1>{page.status}</h1>` → "404".
	await expect(page.getByText('404', { exact: false }).first()).toBeVisible();
	expect(errors).toEqual([]);
});
