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

/** Scroll until at least `want` name images are on screen, and return their centres. */
async function nameCentres(page: Page, want = 2) {
	let boxes: Array<{ x: number; y: number; alt: string }> = [];
	for (let i = 0; i < 25; i++) {
		boxes = await page.evaluate(() =>
			Array.from(document.querySelectorAll('a:has(img), button:has(img)'))
				.map((e) => {
					const r = e.getBoundingClientRect();
					const img = e.querySelector('img');
					return {
						x: r.x + r.width / 2,
						y: r.y + r.height / 2,
						w: r.width,
						h: r.height,
						alt: img?.alt ?? ''
					};
				})
				// Name images only: wide, short, and captioned with the artist's name.
				.filter(
					(b) =>
						b.y > 120 &&
						b.y < 700 &&
						b.w > 60 &&
						b.h < 200 &&
						b.alt !== '' &&
						b.alt !== 'link arrow'
				)
				.map(({ x, y, alt }) => ({ x, y, alt }))
		);
		if (boxes.length >= want) break;
		await page.mouse.wheel(0, 600);
		await page.waitForTimeout(250);
	}
	return boxes;
}

for (const path of PAGES) {
	test(`${path}: hovering the name list does not shift the layout`, async ({ page }) => {
		await page.goto(path, { waitUntil: 'load' });
		// Let the hero and lazy images settle so their loads aren't counted as
		// hover-induced shifts.
		await page.waitForTimeout(2500);

		const names = await nameCentres(page);
		expect(names.length, `expected name images on ${path}`).toBeGreaterThanOrEqual(2);

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

		for (const n of names.slice(0, 5)) {
			await page.mouse.move(n.x, n.y);
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
