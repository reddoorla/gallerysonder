import type { Options } from 'flatpickr/dist/types/options';
import type { Instance } from 'flatpickr/dist/types/instance';

export function datepicker(node: HTMLInputElement, options: Options = {}) {
	const threeMonthsOut = new Date();
	threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);

	let fp: Instance | undefined;
	let destroyed = false;
	let pending: Options | undefined;

	// Lazy-load flatpickr's JS so it stays out of the TitleBlock chunk and only
	// downloads on pages that actually render a date field. (Its CSS stays in
	// app.css so the custom theme overrides keep winning the cascade.) The action
	// itself returns synchronously, as Svelte requires.
	import('flatpickr').then(({ default: flatpickr }) => {
		if (destroyed) return;
		fp = flatpickr(node, {
			// Submitted value (bound to the input) — MM-DD-YYYY, e.g. 06-15-2026.
			dateFormat: 'm-d-Y',
			minDate: 'today',
			maxDate: threeMonthsOut,
			altInput: true,
			altFormat: 'F j, Y',
			...options,
			...(pending ?? {})
		});

		// Mirror placeholder + aria-label from original input to flatpickr's alt input
		if (fp.altInput) {
			if (node.placeholder) fp.altInput.placeholder = node.placeholder;
			const aria = node.getAttribute('aria-label');
			if (aria) fp.altInput.setAttribute('aria-label', aria);
		}
	});

	return {
		update(newOptions: Options = {}) {
			if (fp) {
				Object.entries(newOptions).forEach(([key, value]) => {
					fp!.set(key as keyof Options, value);
				});
			} else {
				// flatpickr hasn't loaded yet; apply these once it does.
				pending = newOptions;
			}
		},
		destroy() {
			destroyed = true;
			fp?.destroy();
		}
	};
}
