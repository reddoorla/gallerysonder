/**
 * Anchors a shaped section's content to its decorative TopShape curve.
 *
 * `--shape-margin: 0` should mean "content's top sits exactly where the curve
 * crosses the content-column edge" — specifically the edge the curve reaches
 * deepest (the binding side), so content never rides up past the shape on either
 * side. That intersection depends on the shape's bézier path, the viewport width
 * and the content-column max-width, so it can't be a static CSS value.
 *
 * This action hit-tests the shape path (`isPointInFill`, binary-searched) at both
 * content-column edges, takes the deeper intersection, and writes it to
 * `--shape-base` on the section. The content then offsets itself with
 * `margin-top: calc(var(--shape-base) + var(--shape-margin))`.
 *
 * Cost: runs on mount and on debounced (rAF) viewport resize only — never on
 * scroll. A handful of isPointInFill calls per section, reads batched before the
 * single write, so no layout thrash. SSR default (--shape-base: 0) is refined on
 * mount; shaped sections sit below the full-screen hero, so the refinement lands
 * before they're scrolled into view (no CLS).
 */
export function shapeMargin(section: HTMLElement) {
	let frame = 0;

	const findShapePath = (): SVGPathElement | null => {
		const wrap = Array.from(section.children).find(
			(c): c is HTMLElement =>
				c instanceof HTMLElement && /translate-y/.test(c.className) && !!c.querySelector('svg')
		);
		return wrap?.querySelector('svg path') ?? null;
	};

	const curveYAtX = (
		svg: SVGSVGElement,
		path: SVGPathElement,
		viewportX: number,
		top: number,
		bottom: number
	): number | null => {
		const ctm = svg.getScreenCTM();
		if (!ctm) return null;
		const inverse = ctm.inverse();
		const point = svg.createSVGPoint();
		const isFilled = (viewportY: number) => {
			point.x = viewportX;
			point.y = viewportY;
			return path.isPointInFill(point.matrixTransform(inverse));
		};
		// The fill lies below the curve: top of the SVG is outside, bottom inside.
		if (isFilled(top)) return top;
		if (!isFilled(bottom)) return null;
		let lo = top;
		let hi = bottom;
		for (let i = 0; i < 20; i++) {
			const mid = (lo + hi) / 2;
			if (isFilled(mid)) hi = mid;
			else lo = mid;
		}
		return hi;
	};

	const compute = () => {
		const path = findShapePath();
		const content = section.querySelector<HTMLElement>('[class*="max-w-"]');
		if (!path || !content) return;
		const svg = path.ownerSVGElement;
		if (!svg) return;

		// Batch reads.
		const svgRect = svg.getBoundingClientRect();
		const contentRect = content.getBoundingClientRect();
		const sectionTop = section.getBoundingClientRect().top;

		const left = curveYAtX(svg, path, contentRect.left + 1, svgRect.top, svgRect.bottom);
		const right = curveYAtX(svg, path, contentRect.right - 1, svgRect.top, svgRect.bottom);
		const offsets = [left, right].filter((v): v is number => v !== null).map((v) => v - sectionTop);
		if (!offsets.length) return;

		// Deepest (binding) intersection — content starts here at --shape-margin: 0,
		// so it never crosses the curve on the shallower side.
		const binding = Math.max(...offsets);

		// Single write.
		section.style.setProperty('--shape-base', `${Math.round(binding)}px`);
	};

	const schedule = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(compute);
	};

	schedule();
	const observer = new ResizeObserver(schedule);
	observer.observe(document.documentElement);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			observer.disconnect();
		}
	};
}
