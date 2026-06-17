<script lang="ts">
	import type { ImageField } from '@prismicio/client';
	import { imgix, srcset } from '$lib/utils/image';

	let {
		image,
		altFallback = '',
		class: className = 'absolute bottom-0 left-0 h-full w-full object-cover'
	}: {
		image: ImageField;
		/** Used when the Prismic image has no alt text (satisfies image-alt for a11y + SEO). */
		altFallback?: string;
		class?: string;
	} = $props();

	let src = $derived(imgix(image?.url, { w: 1920 }));
	let candidates = $derived(srcset(image?.url));
	let alt = $derived(image?.alt || altFallback);
</script>

<svelte:head>
	{#if image?.url}
		<!-- Preload the LCP hero so the browser discovers it before hydration
		     (fixes Lighthouse lcp-discovery / "LCP request discovery"). -->
		<link
			rel="preload"
			as="image"
			href={src}
			imagesrcset={candidates}
			imagesizes="100vw"
			fetchpriority="high"
		/>
	{/if}
</svelte:head>

{#if image?.url}
	<img
		{src}
		srcset={candidates}
		sizes="100vw"
		width={image.dimensions?.width}
		height={image.dimensions?.height}
		{alt}
		fetchpriority="high"
		decoding="async"
		class={className}
	/>
{/if}
