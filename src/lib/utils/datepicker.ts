import flatpickr from 'flatpickr';
import type { Options } from 'flatpickr/dist/types/options';

export function datepicker(node: HTMLInputElement, options: Options = {}) {
	const threeMonthsOut = new Date();
	threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);

	const fp = flatpickr(node, {
		dateFormat: 'Y-m-d',
		minDate: 'today',
		maxDate: threeMonthsOut,
		altInput: true,
		altFormat: 'F j, Y',
		...options
	});

	// Mirror placeholder + aria-label from original input to flatpickr's visible alt input
	if (fp.altInput) {
		if (node.placeholder) fp.altInput.placeholder = node.placeholder;
		const aria = node.getAttribute('aria-label');
		if (aria) fp.altInput.setAttribute('aria-label', aria);
	}

	return {
		update(newOptions: Options = {}) {
			Object.entries(newOptions).forEach(([key, value]) => {
				fp.set(key as keyof Options, value);
			});
		},
		destroy() {
			fp.destroy();
		}
	};
}
