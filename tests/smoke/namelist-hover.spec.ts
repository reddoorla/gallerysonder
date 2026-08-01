import { test, expect, type Page } from '@playwright/test';

// Hovering a name must not move the page.
//
// The shaped slices set `--shape-base` on their <section> from an action
// (shapeMargin), and ALSO render `style="background-color:{...}"`, which the name
// hover changes. Svelte writes that as a whole style attribute, and assigning the
// style attribute wipes every other inline property on the element — including the
// custom property the action just measured. margin-top: calc(var(--shape-base) + …)
// then collapses, the page reflows, the observer recomputes and puts it back. Every
// hover in and out is a jump, and it is invisible to the existing suite because no
// test moves a mouse.
//
// Every page carrying a name list shifted, including /artists — which was expected
// to be immune because its list is unshaped, and was not. Whatever the per-page
// geometry, the trigger is the same attribute write, so all three are covered here.
const PAGES = ['/', '/about', '/artists'];

// The NameRevealOnHover wrapper signature: an <a>/<button> holding the name image,
// with `w-fit` and the component's `ease-fast-slow` easing. Two earlier attempts at
// this got it wrong and are worth not repeating — hunting by geometry found nothing
// in CI (the list sits lower there than locally), and matching on `brightness-0`
// also caught the nav logo, so `.first()` scrolled to a header element that was
// already in view and the names stayed below the fold.
const NAME = 'a.ease-fast-slow.w-fit:has(img), button.ease-fast-slow.w-fit:has(img)';

/** Walk the list once so every lazy image loads before the observer is installed —
 *  an image arriving mid-test is a real shift, just not the one under test. */
async function settleList(page: Page, names: ReturnType<Page['locator']>, count: number) {
	for (let i = 0; i < count; i++) {
		await names
			.nth(i)
			.scrollIntoViewIfNeeded()
			.catch(() => {});
	}
	// Scrolling can pop the newsletter overlay, which then covers the list.
	const newsletter = page.getByRole('dialog', { name: 'Newsletter signup' });
	if (await newsletter.isVisible().catch(() => false)) {
		await page.keyboard.press('Escape');
		await newsletter.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
	}
	await page.waitForTimeout(800);
}

for (const path of PAGES) {
	test(`${path}: hovering the name list does not shift the layout`, async ({ page }) => {
		// Pre-answer cookie consent (same approach as newsletter.spec.ts): `.env` is
		// untracked, so in CI the modal appears 3s in, locks body scroll and would
		// stop this test ever reaching the list. 'false' dismisses it without opting
		// into analytics.
		await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
		await page.goto(path, { waitUntil: 'load' });
		// Let the hero and lazy images settle so their loads aren't counted as
		// hover-induced shifts.
		await page.waitForTimeout(2500);

		const names = page.locator(NAME);
		const found = await names.count();
		expect(found, `expected name images on ${path}`).toBeGreaterThanOrEqual(2);
		const toHover = Math.min(found, 5);
		await settleList(page, names, toHover);

		// Start observing only now — everything above is page load, not hover.
		await page.evaluate(() => {
			(window as Window & { __shifts?: unknown[] }).__shifts = [];
			new PerformanceObserver((list) => {
				for (const entry of list.getEntries() as Array<
					PerformanceEntry & {
						value: number;
						hadRecentInput: boolean;
						sources?: Array<{ node: Node | null }>;
					}
				>) {
					if (entry.hadRecentInput) continue;
					(window as Window & { __shifts?: unknown[] }).__shifts!.push({
						value: +entry.value.toFixed(4),
						sources: (entry.sources ?? []).map((s) => {
							const n = s.node as HTMLElement | null;
							return n ? `${n.tagName}.${String(n.className).split(' ')[0]}` : '(detached)';
						})
					});
				}
			}).observe({ type: 'layout-shift', buffered: false });
		});

		// locator.hover() scrolls the target into view itself — and scrolling is not a
		// layout shift as far as the API is concerned, so it cannot pollute the result.
		for (let i = 0; i < toHover; i++) {
			await names.nth(i).hover();
			await page.waitForTimeout(300);
		}
		// Off the list, and past the 1s background transition.
		await page.mouse.move(3, 3);
		await page.waitForTimeout(1200);

		const shifts = await page.evaluate(
			() =>
				(window as Window & { __shifts?: unknown[] }).__shifts as Array<{
					value: number;
					sources: string[];
				}>
		);
		const total = shifts.reduce((a, s) => a + s.value, 0);
		expect(shifts, `${path} moved while hovering names (CLS ${total.toFixed(4)})`).toEqual([]);
	});
}
