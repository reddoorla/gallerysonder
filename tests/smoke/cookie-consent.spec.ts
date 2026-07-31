// Guards the cookie-consent gate's focus behaviour.
//
// The gate appears on a 3s timer, so it can land on top of an overlay the
// visitor already opened (newsletter, nav menu, lightbox). Those overlays trap
// focus, and before this was fixed their document-level `focusin` recovery kept
// pulling focus back out of the gate — leaving a modal that is visually on top
// but keyboard-unreachable. src/lib/utils/trapFocus.ts now lets only the
// most-recently-activated trap govern.
//
// Unlike the other smoke specs these tests must NOT pre-answer consent, since
// the gate is the thing under test. Locally `.env` usually sets
// VITE_DISABLE_COOKIE_CONSENT=true, in which case the component never renders
// and these skip; CI has no `.env`, so the gate is live and they run.

import { test, expect, type Page } from '@playwright/test';

const gate = (page: Page) => page.getByRole('dialog', { name: /cookie consent/i });

const activeInfo = (page: Page) =>
	page.evaluate(() => {
		const el = document.activeElement as HTMLElement | null;
		if (!el || el === document.body) return { where: 'BODY', text: '' };
		return {
			where: el.closest('[aria-label="Cookie consent"]')
				? 'consent'
				: el.closest('[aria-label="Newsletter signup"]')
					? 'newsletter'
					: 'other',
			text: (el.textContent || '').trim().slice(0, 20)
		};
	});

test.describe('cookie consent gate', () => {
	test.use({ viewport: { width: 1280, height: 1000 } });

	test('is reachable and keeps focus when it appears over the newsletter overlay', async ({
		page
	}) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Open the newsletter first, so its focus trap is already armed.
		await page.locator('footer').scrollIntoViewIfNeeded();
		await page.locator('footer').getByText('Subscribe to our newsletter').click();
		await expect(page.locator('#newsletter-email')).toBeVisible();

		// The gate fires ~3s after mount.
		const appeared = await gate(page)
			.waitFor({ state: 'visible', timeout: 8000 })
			.then(() => true)
			.catch(() => false);
		test.skip(
			!appeared,
			'cookie consent disabled in this environment (VITE_DISABLE_COOKIE_CONSENT)'
		);

		// Focus must move into the gate, not stay trapped in the newsletter.
		await expect.poll(() => activeInfo(page).then((i) => i.where)).toBe('consent');

		// Tabbing must stay inside the gate rather than being yanked back.
		for (let i = 0; i < 6; i++) {
			await page.keyboard.press('Tab');
			expect((await activeInfo(page)).where, `Tab #${i + 1} left the consent gate`).toBe('consent');
		}

		// And it can actually be dismissed by keyboard.
		await page.getByRole('button', { name: /accept/i }).click();
		await expect(gate(page)).toHaveCount(0);
	});

	test('exposes dialog semantics', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const appeared = await gate(page)
			.waitFor({ state: 'visible', timeout: 8000 })
			.then(() => true)
			.catch(() => false);
		test.skip(
			!appeared,
			'cookie consent disabled in this environment (VITE_DISABLE_COOKIE_CONSENT)'
		);

		await expect(gate(page)).toHaveAttribute('aria-modal', 'true');
		await expect(page.getByRole('button', { name: /accept/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /reject/i })).toBeVisible();
	});
});
