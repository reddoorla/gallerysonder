<script lang="ts">
	let { shapeNumber = '0' }: { shapeNumber?: string | number } = $props();

	// Each shape in TopShape.svelte is a full-width (w-screen) SVG, so its rendered
	// height is 100vw * (viewBox height / viewBox width). Reserving exactly that
	// height here with a CSS calc holds the space at SSR — replacing the old
	// onMount getBoundingClientRect() spacer that jumped 0 -> Npx after hydration
	// and produced layout shift (CLS). Keep these ratios in sync with TopShape.svelte.
	const HEIGHTS: Record<string, string> = {
		'1': 'calc(100vw * 416.24 / 1324.5729303547962)',
		'2': 'calc(100vw * 214 / 1440)',
		'3': 'calc(100vw * 206.5289256198347 / 1968)',
		'4': 'calc(100vw * 250.7388825065274 / 1200)',
		'5': 'calc(100vw * 245 / 1440)',
		'6': 'calc(100vw * 196.02 / 1429.8387096774193)'
	};

	const height = $derived(HEIGHTS[String(shapeNumber)]);
</script>

{#if height}
	<div aria-hidden="true" style="height: {height};"></div>
{/if}
