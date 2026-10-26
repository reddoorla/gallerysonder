import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/svelte';
import Select from './Select.svelte';

// The listbox opens and closes with `transition:slide`, which Svelte runs
// through the Web Animations API. jsdom has none, and vitest fails the run on
// the unhandled TypeError even when every assertion passes.
beforeAll(() => {
	Element.prototype.animate ??= function () {
		const animation = {
			onfinish: null as (() => void) | null,
			playState: 'finished',
			cancel() {},
			finished: Promise.resolve()
		};
		queueMicrotask(() => animation.onfinish?.());
		return animation as unknown as Animation;
	};
});

// WCAG 2.5.3 (Label in Name): a control's visible text must be inside its
// accessible name, so a voice-control user who says "click No preference"
// reaches the trigger. axe checks it as `label-content-name-mismatch`, which
// 4.14 runs by default (it was experimental, and skipped, through 4.13). axe
// compares the two strings lowercased with punctuation stripped; so does this.
const normalize = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s]/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const options = [
	{ value: '', label: 'No preference' },
	{ value: 'Morning', label: 'Morning' },
	{ value: 'Afternoon', label: 'Afternoon' }
];

function trigger(container: HTMLElement) {
	const button = container.querySelector<HTMLButtonElement>('button[aria-haspopup="listbox"]');
	if (!button) throw new Error('no Select trigger rendered');
	return button;
}

function expectLabelInName(button: HTMLButtonElement) {
	const visible = normalize(button.textContent ?? '');
	const name = normalize(button.getAttribute('aria-label') ?? '');
	expect(visible, 'the trigger shows some text').not.toBe('');
	expect(name, `visible "${visible}" must be inside the name "${name}"`).toContain(visible);
}

afterEach(cleanup);

describe('Select trigger (WCAG 2.5.3)', () => {
	it('names the placeholder it shows when no option matches', () => {
		const { container } = render(Select, {
			props: {
				options: options.slice(1),
				placeholder: 'Any time',
				ariaLabel: 'Preferred time of day'
			}
		});
		expect(trigger(container).textContent).toContain('Any time');
		expectLabelInName(trigger(container));
	});

	it('names the selected option it shows on load', () => {
		const { container } = render(Select, {
			props: { options, placeholder: 'Any time', ariaLabel: 'Preferred time of day' }
		});
		expect(trigger(container).textContent).toContain('No preference');
		expectLabelInName(trigger(container));
	});

	it('is named by the field label alone when it shows nothing', () => {
		const { container } = render(Select, {
			props: { options: options.slice(1), placeholder: '', ariaLabel: 'Preferred time of day' }
		});
		expect(trigger(container).getAttribute('aria-label')).toBe('Preferred time of day');
	});

	it('names the option it shows once one is chosen', async () => {
		const { container, getByRole } = render(Select, {
			props: { options, placeholder: 'No preference', ariaLabel: 'Preferred time of day' }
		});
		await fireEvent.click(trigger(container));
		await fireEvent.click(getByRole('option', { name: 'Afternoon' }).querySelector('button')!);
		expect(trigger(container).textContent).toContain('Afternoon');
		expectLabelInName(trigger(container));
	});

	it('keeps the field label in the name', () => {
		const { container } = render(Select, {
			props: { options, placeholder: 'No preference', ariaLabel: 'Preferred time of day' }
		});
		expect(trigger(container).getAttribute('aria-label')).toContain('Preferred time of day');
	});
});
