// Guards the shared body-scroll lock in src/lib/contexts/appState.svelte.ts.
//
// The lock is OWNER-KEYED: it releases only once every holder has let go. That
// makes overlapping overlays correct (a closing one can no longer release a lock
// another still needs) but it also removes the old safety net, where any
// unlock() cleared the style regardless of who set it. A stranded key is now
// permanent, so every acquirer needs a guaranteed release path — these tests
// assert that for the lightbox, whose acquisition moved from GridImage (behind
// an uncancelled 500ms setTimeout that could re-lock after close) to Lightbox's
// own effect.
//
// Assertions use a real mouse wheel, not just the inline style, so a lock that
// is nominally released but functionally stuck still fails.

import { test, expect, type Page } from '@playwright/test';

const lightboxCards = (page: Page) => page.locator('button.absolute.inset-0.z-10');

const overflowY = (page: Page) => page.evaluate(() => document.body.style.overflowY);

/** Scroll by a real wheel event and report how far the page actually moved. */
async function wheelDelta(page: Page) {
	const before = await page.evaluate(() => window.scrollY);
	await page.mouse.wheel(0, 600);
	await page.waitForTimeout(300);
	const after = await page.evaluate(() => window.scrollY);
	return after - before;
}

/** Find a detail route that actually renders lightbox-opening cards. The Gallery
 *  slice only appears on Prismic detail pages, so the route is discovered rather
 *  than hardcoded. */
async function findRouteWithLightboxCards(page: Page) {
	await page.goto('/exhibitions');
	await page.waitForLoadState('networkidle');
	const hrefs: string[] = await page
		.locator('a[href^="/exhibitions/"]')
		.evaluateAll((els) =>
			Array.from(new Set(els.map((e) => e.getAttribute('href')!).filter(Boolean)))
		);

	for (const href of hrefs.slice(0, 8)) {
		await page.goto(href);
		await page.waitForLoadState('networkidle');
		if ((await lightboxCards(page).count()) > 0) return href;
	}
	return null;
}

test.describe('body scroll lock', () => {
	test.use({ viewport: { width: 1280, height: 1000 } });

	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
	});

	test('the lightbox locks the page while open and releases it on close', async ({ page }) => {
		const route = await findRouteWithLightboxCards(page);
		expect(
			route,
			'no exhibition detail page rendered a lightbox card — the fixture this test needs is gone, not the behaviour'
		).not.toBeNull();

		await expect(lightboxCards(page).first()).toBeAttached();
		await lightboxCards(page).first().scrollIntoViewIfNeeded();
		await lightboxCards(page).first().click();

		await expect.poll(() => overflowY(page)).toBe('hidden');
		expect(await wheelDelta(page), 'page scrolled behind an open lightbox').toBe(0);

		await page.keyboard.press('Escape');
		await expect.poll(() => overflowY(page)).toBe('');
		expect(await wheelDelta(page), 'page still frozen after the lightbox closed').toBeGreaterThan(
			0
		);
	});

	test('closing the lightbox immediately after opening does not strand the lock', async ({
		page
	}) => {
		const route = await findRouteWithLightboxCards(page);
		expect(route).not.toBeNull();

		// GridImage used to acquire the lock 500ms after the click, with no way to
		// cancel it — dismissing inside that window let the timer re-lock a page
		// that had already been released, freezing it with nothing on screen.
		await lightboxCards(page).first().scrollIntoViewIfNeeded();
		await lightboxCards(page).first().click();
		await page.waitForTimeout(80);
		await page.keyboard.press('Escape');
		await page.waitForTimeout(1200);

		await expect.poll(() => overflowY(page)).toBe('');
		expect(
			await wheelDelta(page),
			'page frozen by a lock acquired after the overlay had already closed'
		).toBeGreaterThan(0);
	});

	test('navigating away with the media modal open releases its lock', async ({ page }) => {
		// ContentWidthMedia unmounts on navigation without closeModal ever running,
		// so its onDestroy is the only release path. Owner-keyed releasing means a
		// stranded key is never cleared incidentally by another overlay, so losing
		// this leaves the destination page permanently unscrollable.
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const opener = page.getByRole('button', { name: /view full size/i }).first();
		test.skip(
			(await opener.count()) === 0,
			'no ContentWidthMedia "view full size" control on the home page'
		);

		await opener.scrollIntoViewIfNeeded();
		await opener.click();
		await expect.poll(() => overflowY(page)).toBe('hidden');

		// Client-side navigation, not a reload — a reload would remount everything
		// and reset the lock regardless, hiding the bug. It must also be to a
		// DIFFERENT route: the nav's logo link points at "/" and clicking it while
		// already on "/" navigates nowhere, so nothing unmounts.
		await page.getByLabel('Toggle navigation menu').click();
		const target = await page
			.locator('#main-nav a[href^="/"]')
			.evaluateAll((els) => els.map((e) => e.getAttribute('href')!).find((h) => h && h !== '/'));
		expect(target, 'no second internal route in the nav to navigate to').toBeTruthy();
		await page.locator(`#main-nav a[href="${target}"]`).first().click();
		await page.waitForURL(`**${target}`);
		await page.waitForLoadState('networkidle');

		await expect.poll(() => overflowY(page)).toBe('');
		expect(
			await wheelDelta(page),
			'destination page frozen by a lock the unmounted media modal never released'
		).toBeGreaterThan(0);
	});
});
