<script lang="ts">
	import { onMount } from 'svelte';

	let { class: className = '' } = $props();

	let parent: HTMLElement;
	let nodes: HTMLElement[] = [];
	let scale = 1;

	function getFontSizeInPixels(element: Element): number {
		const computedStyle = window.getComputedStyle(element);
		const fontSize = computedStyle.fontSize;
		const fontSizeValue = parseFloat(fontSize);
		const fontSizeUnit = fontSize.slice(fontSizeValue.toString().length);

		if (fontSizeUnit === 'px') {
			return fontSizeValue;
		} else if (fontSizeUnit === 'em' || fontSizeUnit === 'rem') {
			const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
			return fontSizeValue * rootFontSize;
		} else if (fontSizeUnit === '%') {
			const parentFontSize = parseFloat(
				getComputedStyle(element.parentElement as Element).fontSize
			);
			return (fontSizeValue / 100) * parentFontSize;
		} else {
			return 16;
		}
	}

	// $state so the resize handler's writes re-trigger the scaling $effect below.
	let windowWidth = $state('');
	// Original (unscaled) font size per node, so repeated runs scale from the
	// source size instead of compounding off an already-scaled value.
	const baseFontSize = new WeakMap<HTMLElement, number>();

	const debounce = (func: (...args: unknown[]) => unknown, delay: number) => {
		let timer: ReturnType<typeof setTimeout>;
		return (...args: unknown[]) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(...args), delay);
		};
	};

	const setWindowWidth = () => {
		windowWidth = `${window.innerWidth}px`;
	};

	const debouncedSetWindowWidth = debounce(setWindowWidth, 100);

	onMount(() => {
		window.addEventListener('resize', debouncedSetWindowWidth);
		return () => {
			window.removeEventListener('resize', debouncedSetWindowWidth);
		};
	});

	$effect(function scaleTextToFitContainer() {
		const _dep = windowWidth;
		if (!parent) return;

		nodes = [...parent.children] as HTMLElement[];

		// Reset each node to its cached original size before measuring, so the scale
		// is derived from the unscaled layout (otherwise width + font both compound).
		nodes.forEach((node) => {
			const base = baseFontSize.get(node) ?? getFontSizeInPixels(node);
			baseFontSize.set(node, base);
			node.style.fontSize = base + 'px';
		});

		const parentWidth = parent.offsetWidth;
		let largestChildWidth = 1;
		nodes.forEach((node) => {
			if (node.offsetWidth > largestChildWidth) largestChildWidth = node.offsetWidth;
		});
		scale = parentWidth / largestChildWidth;

		nodes.forEach((node) => {
			node.style.fontSize = (baseFontSize.get(node) as number) * scale + 'px';
		});
	});
</script>

<div bind:this={parent} class="parent transition-all {className}" style="">
	<slot />
</div>

<style>
	.parent {
		width: 80%;
	}

	@media screen and (max-width: 1024px) {
		.parent {
			width: 100%;
		}
	}
</style>
