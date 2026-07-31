// Guards the bottom-anchored hero text.
//
// Every hero is a `flex flex-col justify-end` stack pinned to the bottom of a
// full-bleed container, and the design calls for the last line's letters to sit
// ON that edge. `justify-end` alone can't do it: a line box carries half-leading
// plus the font's descent below the baseline, so the letters float ~0.2em short.
//
// The old correction was `translate-y-[22%] lg:translate-y-[18%]`. A percentage
// in `translate` resolves against the element's own BORDER BOX, which for a
// heading is `lines x line-height` — so a title that wrapped got nudged two or
// three times too far and its last line dropped below the fold. It looked right
// only while the title fit on one line, which is why it survived on phones (48px
// type) and broke on desktop (80-120px type wraps far sooner).
//
// The replacement is `.baseline-flush` (src/app.css), which nudges by
// `calc(0.5lh - 0.3333em)` — `lh` is ONE line's height, so the nudge is the same
// whether the title wraps once or three times.
//
// These tests measure the real baseline from the loaded font's metrics rather
// than trusting the box: CSS puts half-leading above the font ascent, so
//   baseline = lineTop + (lineHeight - (ascent + descent)) / 2 + ascent
// Titles are `text-transform: uppercase`, so the baseline IS the bottom of the
// ink — no descenders hang below it.

import { test, expect, type Page } from '@playwright/test';

/** Widths spanning both line-height regimes: 125% at <=1024px, 1.1 above it. */
const WIDTHS = [390, 768, 1024, 1280, 1440, 1920];

/** Sub-pixel layout plus rounding in the font's reported metrics. */
const TOLERANCE_PX = 2;

type Measurement = {
	hostBottom: number;
	baseline: number;
	delta: number;
	lines: number;
	fontSize: number;
	lineHeight: number;
	text: string;
	fontLoaded: boolean;
};

/**
 * Distance from the last hero line's baseline to the hero container's bottom
 * edge. Positive = the letters float above the edge, negative = they hang below
 * it (off the bottom of the screen, for the `bottom-0` heroes).
 */
async function measureLastLine(page: Page): Promise<Measurement | null> {
	return page.evaluate(() => {
		const host = document.querySelector<HTMLElement>(
			'div.fixed[class*="h-screen-75"], div.fixed[class*="h-screen-50"]'
		);
		if (!host) return null;

		const texts = [...host.querySelectorAll<HTMLElement>('h1, h5, span')].filter(
			(el) => (el.textContent || '').trim() && el.getBoundingClientRect().height > 0
		);
		const el = texts.at(-1);
		if (!el) return null;

		const rect = el.getBoundingClientRect();
		const cs = getComputedStyle(el);
		const fontSize = parseFloat(cs.fontSize);
		const lineHeight = cs.lineHeight === 'normal' ? rect.height : parseFloat(cs.lineHeight);

		const ctx = document.createElement('canvas').getContext('2d')!;
		ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
		const m = ctx.measureText((el.textContent || '').trim());

		const lines = Math.max(1, Math.round(rect.height / lineHeight));
		const lastLineTop = rect.top + (lines - 1) * lineHeight;
		const baseline =
			lastLineTop +
			(lineHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 +
			m.fontBoundingBoxAscent;
		const hostBottom = host.getBoundingClientRect().bottom;

		return {
			hostBottom: +hostBottom.toFixed(2),
			baseline: +baseline.toFixed(2),
			delta: +(hostBottom - baseline).toFixed(2),
			lines,
			fontSize,
			lineHeight,
			text: (el.textContent || '').trim().slice(0, 30),
			// The nudge is sized for commuters-sans' metrics; a fallback font would
			// land somewhere else, so report it rather than fail on a mystery offset.
			fontLoaded: document.fonts.check(`700 ${cs.fontSize} commuters-sans`)
		};
	});
}

/** Wait out the hero's opacity/scale transitions — geometry settles a beat late. */
async function settled(page: Page): Promise<Measurement> {
	let previous = '';
	for (let i = 0; i < 40; i++) {
		const m = await measureLastLine(page);
		const key = JSON.stringify(m);
		if (m && key === previous) return m;
		previous = key;
		await page.waitForTimeout(100);
	}
	const last = await measureLastLine(page);
	expect(last, 'hero text never reached a stable position').not.toBeNull();
	return last!;
}

test.describe('hero text is flush with the bottom of its container', () => {
	test('at every breakpoint', async ({ page }) => {
		const results: string[] = [];

		for (const width of WIDTHS) {
			await page.setViewportSize({ width, height: 900 });
			await page.goto('/', { waitUntil: 'networkidle' });
			await page.evaluate(() => document.fonts.ready);

			const m = await settled(page);
			expect(m.fontLoaded, `commuters-sans did not load at ${width}px`).toBe(true);
			results.push(
				`${width}px: baseline is ${m.delta}px from the edge ` +
					`(${m.lines} line(s), ${m.fontSize}px/${m.lineHeight}px, "${m.text}")`
			);
		}

		const offenders = results.filter((r) => {
			const px = Number(r.match(/is (-?[\d.]+)px/)![1]);
			return Math.abs(px) > TOLERANCE_PX;
		});
		expect(offenders, `hero text is not flush:\n${results.join('\n')}`).toEqual([]);
	});

	test('by the same amount however many lines the title wraps to', async ({ page }) => {
		// The defect scaled the nudge with the element's box height, so it only
		// showed up once a title wrapped. Drive the wrap count directly instead of
		// depending on whatever title is published in Prismic today.
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);
		await settled(page);

		const deltas: Record<number, number> = {};

		for (const [wanted, words] of [
			[1, 'ONE'],
			[2, 'WRAPPING TITLE HERE'],
			[3, 'A DELIBERATELY LONG WRAPPING TITLE GOES HERE']
		] as const) {
			await page.evaluate((text) => {
				const host = document.querySelector<HTMLElement>('div.fixed[class*="h-screen-75"]')!;
				const headings = [...host.querySelectorAll<HTMLElement>('h1')].filter((h) =>
					(h.textContent || '').trim()
				);
				headings.at(-1)!.textContent = text;
			}, words);

			const m = await settled(page);
			expect(m.lines, `"${words}" was meant to wrap to ${wanted} line(s)`).toBe(wanted);
			deltas[m.lines] = m.delta;
		}

		expect(
			Math.abs(deltas[2] - deltas[1]),
			`a 2-line title sits ${deltas[2]}px from the edge but a 1-line title sits ${deltas[1]}px`
		).toBeLessThanOrEqual(TOLERANCE_PX);
		expect(
			Math.abs(deltas[3] - deltas[1]),
			`a 3-line title sits ${deltas[3]}px from the edge but a 1-line title sits ${deltas[1]}px`
		).toBeLessThanOrEqual(TOLERANCE_PX);
	});
});
