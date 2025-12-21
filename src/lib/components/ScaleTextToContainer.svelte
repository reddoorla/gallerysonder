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

	let windowWidth: string;

	const debounce = (func: Function, delay: number) => {
		let timer: NodeJS.Timeout;
		return function (this: any, ...args: any[]) {
			const context = this;
			clearTimeout(timer);
			timer = setTimeout(() => func.apply(context, args), delay);
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

	$effect(() => {
		windowWidth;
		if (parent) {
			nodes = [...parent?.children] as HTMLElement[];
			console.log(nodes);
			const parentWidth = parent.offsetWidth;
			let largestChildWidth = 1;
			nodes.forEach((node) => {
				if (node.offsetWidth > largestChildWidth) largestChildWidth = node.offsetWidth;
			});
			scale = parentWidth / largestChildWidth;
			nodes.forEach((node) => {
				node.style.fontSize = getFontSizeInPixels(node) * scale + 'px';
			});
		}
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
