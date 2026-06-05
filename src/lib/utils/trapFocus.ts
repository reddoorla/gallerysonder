interface TrapFocusOptions {
	/** Called when the user presses Escape inside the trapped region. */
	onEscape?: () => void;
}

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Svelte action for modal dialogs: moves focus into the node on mount, keeps Tab
 * cycling inside it, closes on Escape (via `onEscape`), and restores focus to the
 * previously-focused element on destroy. Apply to a container with
 * `role="dialog" aria-modal="true" tabindex="-1"`. The action mounts/destroys with
 * the element, so gate the element behind the `{#if open}` that shows the modal.
 */
export function trapFocus(node: HTMLElement, options: TrapFocusOptions = {}) {
	let opts = options;
	const previouslyFocused = document.activeElement as HTMLElement | null;

	const focusable = () =>
		Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
			(el) => el.offsetParent !== null
		);

	// Move focus into the dialog (first focusable, else the container itself).
	(focusable()[0] ?? node).focus();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			opts.onEscape?.();
			return;
		}
		if (event.key !== 'Tab') return;

		const items = focusable();
		if (items.length === 0) {
			event.preventDefault();
			return;
		}

		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;

		if (event.shiftKey && active === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus();
		}
	}

	node.addEventListener('keydown', handleKeydown);

	return {
		update(newOptions: TrapFocusOptions) {
			opts = newOptions;
		},
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
			previouslyFocused?.focus?.();
		}
	};
}
