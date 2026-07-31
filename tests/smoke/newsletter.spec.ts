// Regression suite for the newsletter signup overlay (src/lib/components/NewsletterSignup.svelte).
//
// Every submission is intercepted at `**/api/forms`, so these tests never reach
// the real ingest endpoint and never create a dashboard row. Assertions are on
// the captured request bodies plus the rendered UI.
//
// Cookie consent is pre-answered in an init script rather than relying on
// `VITE_DISABLE_COOKIE_CONSENT`: `.env` is untracked, so in CI the consent modal
// would otherwise appear 3s in, lock body scroll, and steal clicks mid-test.
// Storing 'false' dismisses the modal without opting into analytics.

import { test, expect, type Page } from '@playwright/test';

type Captured = Record<string, unknown>;

/** Collect every `/api/forms` body and reply with the given status, oldest first. */
function interceptForms(page: Page, statuses: number[] = [200]) {
	const bodies: Captured[] = [];
	let call = 0;
	return page
		.route('**/api/forms', async (route) => {
			bodies.push(JSON.parse(route.request().postData() || '{}'));
			const status = statuses[Math.min(call, statuses.length - 1)];
			call += 1;
			await route.fulfill({
				status,
				contentType: 'application/json',
				body: status === 200 ? '{"ok":true}' : '{"ok":false,"error":"nope"}'
			});
		})
		.then(() => bodies);
}

/** The overlay's own submit control, distinguished from the "Subscribe to our
 *  newsletter" CTAs that open it. Anchored regexes (/^subscribe$/i) do NOT work
 *  here — LinkArrowButton renders a trailing `<img alt="link arrow">` that
 *  Playwright folds into the element's text, so `$` never matches. */
const submitButton = (page: Page) =>
	page
		.locator('button')
		.filter({ hasText: 'Subscribe' })
		.filter({ hasNotText: /newsletter/i });

const emailField = (page: Page) => page.locator('#newsletter-email');

async function gotoHome(page: Page) {
	await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
	await page.goto('/');
	await page.waitForLoadState('networkidle');
}

async function openFromFooter(page: Page) {
	await page.locator('footer').scrollIntoViewIfNeeded();
	await page.locator('footer').getByText('Subscribe to our newsletter').click();
	await expect(emailField(page)).toBeVisible();
}

/** Wait out any running CSS/WAAPI animations under a node — Svelte's
 *  `transition:slide` moves the menu for ~400ms and clicks placed inside that
 *  window land on the wrong coordinates. */
async function settle(page: Page, selector: string) {
	await page
		.locator(selector)
		.evaluate((el) =>
			Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {})))
		);
}

async function openNavMenu(page: Page) {
	await page.getByLabel('Toggle navigation menu').click();
	await expect(page.locator('#main-nav')).toBeVisible();
	await settle(page, '#main-nav');
	// The CTA lives at the bottom of a non-scrollable `fixed h-screen` panel, so
	// it is only reachable on a tall enough viewport (see the describe-level
	// `test.use`). Fail loudly here rather than as a mystery click timeout.
	await expect(page.locator('#main-nav').getByText('Subscribe to our newsletter')).toBeInViewport();
}

/** Read the document's scroll range only once it has stopped changing. During a
 *  client-side navigation both the outgoing and incoming page are briefly in the
 *  DOM, so a single sample can read roughly their combined height. */
async function measureStableMaxScroll(page: Page, settleMs = 250, tries = 20) {
	const read = () =>
		page.evaluate(
			() => document.documentElement.scrollHeight - document.documentElement.clientHeight
		);
	let previous = await read();
	for (let i = 0; i < tries; i++) {
		await page.waitForTimeout(settleMs);
		const current = await read();
		if (current === previous) return current;
		previous = current;
	}
	return previous;
}

/** Type the way a person does — click, then keystrokes. `fill()` would set
 *  `.value` programmatically and mask a focus-stealing bug. */
async function typeEmail(page: Page, value: string) {
	await emailField(page).click();
	await page.keyboard.type(value);
}

test.describe('newsletter signup', () => {
	// The nav menu's newsletter CTA sits ~832px down a `position: fixed h-screen`
	// panel that cannot scroll, so it is off-screen and unclickable at the default
	// 720px viewport height. Verified reachable at 900px+.
	test.use({ viewport: { width: 1280, height: 1000 } });

	test('opening the overlay from the nav menu closes the menu', async ({ page }) => {
		await gotoHome(page);
		await openNavMenu(page);
		await page.locator('#main-nav').getByText('Subscribe to our newsletter').click();

		await expect(emailField(page)).toBeVisible();
		await expect(page.locator('#main-nav')).toHaveCount(0);
	});

	test('an email typed into the overlay opened from the nav reaches the payload', async ({
		page
	}) => {
		const bodies = await interceptForms(page);
		await gotoHome(page);
		await openNavMenu(page);
		await page.locator('#main-nav').getByText('Subscribe to our newsletter').click();
		await expect(emailField(page)).toBeVisible();

		await typeEmail(page, 'nav-path@example.com');
		await submitButton(page).click();

		await expect.poll(() => bodies.length).toBe(1);
		expect(bodies[0].email).toBe('nav-path@example.com');
	});

	test('the page stays scroll-locked when the overlay is opened from the nav menu', async ({
		page
	}) => {
		await gotoHome(page);
		await openNavMenu(page);
		await page.locator('#main-nav').getByText('Subscribe to our newsletter').click();
		await expect(emailField(page)).toBeVisible();

		await expect.poll(() => page.evaluate(() => document.body.style.overflowY)).toBe('hidden');
	});

	// The owner-keyed lock only releases once EVERY holder has let go, so a
	// stranded key is no longer cleared incidentally by another overlay closing.
	// These guard the release paths that property depends on.
	test('closing the overlay releases the scroll lock', async ({ page }) => {
		await gotoHome(page);
		await openFromFooter(page);
		await expect.poll(() => page.evaluate(() => document.body.style.overflowY)).toBe('hidden');

		await page.keyboard.press('Escape');
		await expect(emailField(page)).toHaveCount(0);

		await expect.poll(() => page.evaluate(() => document.body.style.overflowY)).toBe('');
		// Prove it with a real wheel event, not just the inline style.
		await page.mouse.wheel(0, 400);
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
	});

	test('opening then closing the overlay from the nav menu releases the scroll lock', async ({
		page
	}) => {
		await gotoHome(page);
		await openNavMenu(page);
		await page.locator('#main-nav').getByText('Subscribe to our newsletter').click();
		await expect(emailField(page)).toBeVisible();

		// Both the nav and the newsletter ran their own lock effect in this tick;
		// neither may leave a key behind once the overlay is dismissed.
		await page.keyboard.press('Escape');
		await expect(emailField(page)).toHaveCount(0);

		await expect.poll(() => page.evaluate(() => document.body.style.overflowY)).toBe('');
		await page.mouse.wheel(0, 400);
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
	});

	test('focus returns to a usable control after closing from the nav menu', async ({ page }) => {
		await gotoHome(page);
		await openNavMenu(page);
		await page.locator('#main-nav').getByText('Subscribe to our newsletter').click();
		await expect(emailField(page)).toBeVisible();
		// Let both overlays' focus rAFs settle before closing. Without this the
		// nav trap's own restore can win the race and mask a missing restore here.
		await page.waitForTimeout(1000);

		await page.keyboard.press('Escape');
		await expect(emailField(page)).toHaveCount(0);

		// The opening CTA unmounts with the menu, so focus must not be dropped on
		// <body> — it should land on the still-mounted menu toggle.
		await expect
			.poll(() =>
				page.evaluate(() => {
					const el = document.activeElement as HTMLElement | null;
					if (!el || el === document.body) return 'BODY';
					return el.getAttribute('aria-label') ?? el.tagName;
				})
			)
			.toBe('Toggle navigation menu');
	});

	test('focus returns to the footer CTA when the overlay was opened from the footer', async ({
		page
	}) => {
		await gotoHome(page);
		await openFromFooter(page);
		await page.waitForTimeout(1000);

		await page.keyboard.press('Escape');
		await expect(emailField(page)).toHaveCount(0);

		// The footer CTA is still mounted, so trapFocus must restore to IT — the
		// nav-menu fallback applies only when the opener unmounted. An earlier fix
		// hijacked every close path to the hamburger, losing the visitor's place
		// near the bottom of a long page.
		await expect
			.poll(
				() =>
					page.evaluate(() => {
						const el = document.activeElement as HTMLElement | null;
						if (!el || el === document.body) return 'BODY';
						return (el.textContent || '').trim() || el.getAttribute('aria-label') || el.tagName;
					}),
				{ timeout: 7000 }
			)
			.toBe('Subscribe to our newsletter');
	});

	test('focus moves into the overlay when it opens', async ({ page }) => {
		await gotoHome(page);
		await openFromFooter(page);

		await expect
			.poll(() =>
				page.evaluate(() => !!document.activeElement?.closest('[role="dialog"][aria-modal="true"]'))
			)
			.toBe(true);
	});

	test('the overlay exposes dialog semantics', async ({ page }) => {
		await gotoHome(page);
		await openFromFooter(page);

		const dialog = page.getByRole('dialog', { name: /newsletter/i });
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	test('Escape closes the overlay', async ({ page }) => {
		await gotoHome(page);
		await openFromFooter(page);

		await page.keyboard.press('Escape');
		await expect(emailField(page)).toHaveCount(0);
	});

	test('an empty email is not submitted', async ({ page }) => {
		const bodies = await interceptForms(page);
		await gotoHome(page);
		await openFromFooter(page);

		await submitButton(page).click();
		await page.waitForTimeout(500);

		expect(bodies).toHaveLength(0);
		await expect(emailField(page)).toBeVisible();
		await expect(page.getByText('Thank you for joining')).toHaveCount(0);
	});

	test('a malformed email is not submitted', async ({ page }) => {
		const bodies = await interceptForms(page);
		await gotoHome(page);
		await openFromFooter(page);

		await typeEmail(page, 'not-an-email');
		await submitButton(page).click();
		await page.waitForTimeout(500);

		expect(bodies).toHaveLength(0);
		await expect(emailField(page)).toBeVisible();
		await expect(page.getByText('Thank you for joining')).toHaveCount(0);
	});

	test('a valid email is submitted and confirmed', async ({ page }) => {
		const bodies = await interceptForms(page);
		await gotoHome(page);
		await openFromFooter(page);

		await typeEmail(page, 'valid@example.com');
		await submitButton(page).click();

		await expect(page.getByText('Thank you for joining')).toBeVisible();
		expect(bodies).toHaveLength(1);
		expect(bodies[0].email).toBe('valid@example.com');
		expect(bodies[0].formType).toBe('newsletter');
	});

	test('the payload carries no empty name field', async ({ page }) => {
		const bodies = await interceptForms(page);
		await gotoHome(page);
		await openFromFooter(page);

		await typeEmail(page, 'no-name@example.com');
		await submitButton(page).click();

		await expect.poll(() => bodies.length).toBe(1);
		expect(Object.keys(bodies[0])).not.toContain('name');
	});

	test('a failed submission can be retried', async ({ page }) => {
		const bodies = await interceptForms(page, [500, 200]);
		await gotoHome(page);
		await openFromFooter(page);

		await typeEmail(page, 'retry@example.com');
		await submitButton(page).click();

		// The failure is reported, but the form survives so the visitor can retry.
		await expect(page.getByRole('alert')).toBeVisible();
		await expect(emailField(page)).toBeVisible();
		await expect(submitButton(page)).toBeEnabled();

		await submitButton(page).click();
		await expect(page.getByText('Thank you for joining')).toBeVisible();
		expect(bodies).toHaveLength(2);
	});

	test('a failed submission does not suppress the overlay for the rest of the session', async ({
		page
	}) => {
		await interceptForms(page, [500]);
		await gotoHome(page);
		await openFromFooter(page);

		await typeEmail(page, 'failed@example.com');
		await submitButton(page).click();
		await expect(page.getByRole('alert')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(emailField(page)).toHaveCount(0);

		// Reopening must give a usable form again, not a stranded error screen.
		await openFromFooter(page);
		await expect(emailField(page)).toBeVisible();
		await expect(emailField(page)).toHaveValue('');
	});

	test('the scroll high-water mark does not carry across navigations', async ({ page }) => {
		await gotoHome(page);

		// Arm the heuristic without letting it fire: scroll to the very bottom, so
		// the high-water mark is 100% of this page but we are also at 100% (the
		// overlay needs us back above 50%), and `hasNewsletterBeenCleared` stays
		// false.
		await page.evaluate(() =>
			window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight)
		);
		await page.waitForTimeout(400);
		const armed = await page.evaluate(() => window.scrollY);
		await expect(emailField(page)).toHaveCount(0);

		// Navigate client-side (a full page load would remount the component and
		// reset the mark, hiding the bug). The routes live in the nav menu, so open
		// it now that the scroll is armed. Prefer the shortest page: a stale mark
		// only clears the 80% threshold on a page no taller than the one it was
		// measured on.
		await openNavMenu(page);
		const hrefs = await page
			.locator('#main-nav a[href^="/"]')
			.evaluateAll((els) =>
				els.map((el) => el.getAttribute('href')).filter((h): h is string => !!h && h !== '/')
			);
		test.skip(hrefs.length === 0, 'no second internal route in the nav to navigate to');
		const target = ['/contact', '/about'].find((p) => hrefs.includes(p)) ?? hrefs[hrefs.length - 1];

		await page.locator(`#main-nav a[href="${target}"]`).first().click();
		await page.waitForLoadState('networkidle');
		await expect(page.locator('#main-nav')).toHaveCount(0);
		// The root layout keeps a transition overlay up for 1050ms and SvelteKit
		// holds the OUTGOING page in the DOM alongside the incoming one for part of
		// that. Measuring inside that window reads the sum of both pages' heights —
		// which silently flipped the precondition below and skipped the only test
		// covering the afterNavigate reset. Poll until the height stops changing.
		const maxScroll = await measureStableMaxScroll(page);

		// Arriving already at the top fires no scroll event, so the check only runs
		// once the visitor scrolls. This is a precondition on the fixture, not on
		// the behaviour: assert it rather than skipping, so a content change that
		// invalidates the setup fails loudly instead of quietly deleting coverage.
		expect(
			armed / maxScroll,
			`fixture broken: route ${target} (maxScroll ${maxScroll}) is too tall for a stale high-water mark (${armed}) to clear the 80% threshold — pick a shorter route`
		).toBeGreaterThan(0.8);

		// A modest scroll down — nowhere near deep, and well under the 50% mark the
		// heuristic reads as "came back up". With the mark carried over from the
		// previous page this alone used to spring the overlay open.
		await page.evaluate((y) => window.scrollTo(0, y), Math.round(maxScroll * 0.2));
		await page.waitForTimeout(600);

		await expect(emailField(page)).toHaveCount(0);
	});
});
