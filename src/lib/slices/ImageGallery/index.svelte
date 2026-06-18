<script lang="ts">
	import type { ImageGallerySlice } from '../../../prismicio-types';

	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';
	import { PrismicRichText } from '@prismicio/svelte';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import TopShapeSpacer from '$lib/components/Shapes/TopShapeSpacer.svelte';
	import { shapeMargin } from '$lib/actions/shapeMargin';
	import { isFilled } from '@prismicio/helpers';

	const appState = getAppState();

	let { slice }: { slice: ImageGallerySlice } = $props();

	let viewportWidth = $state(0);

	let isTruncated = $state(!!slice.primary.show_more_button);

	// Shape is positioned out of flow; the gap below the curve is the uniform
	// --shape-gap so spacing matches every other shaped slice (see TopShapeSpacer).
	const shaped = $derived(slice.primary.shape_top !== '0');
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<TopShapeSpacer shapeNumber={slice.primary.shape_top || '0'} />

<section
	use:shapeMargin
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="relative w-screen use-gpu transition duration-1000 {slice.primary.hide ? 'hidden' : ''}"
	style="background-color: {appState.backgroundColor}"
>
	{#if shaped}<div class="absolute left-0 top-0 w-screen -translate-y-[98%]">
			<TopShape shapeNumber={slice.primary.shape_top || ''} />
		</div>
	{/if}
	<ContentWidth
		class="lg:pl-20 {shaped
			? 'relative z-10 mt-[calc(var(--shape-base)_+_var(--shape-margin))]'
			: ''}"
	>
		{#if slice.primary.gallery_eyebrow}
			<h5 aria-level="2" class="mb-12 uppercase {shaped ? '' : 'mt-24'}">
				<b>{slice.primary.gallery_eyebrow || ''}</b>
			</h5>
		{/if}
		{#key slice}
			<Gallery
				{slice}
				isList={slice.primary.islist}
				isRegular={!slice.primary.is_staggered}
				{isTruncated}
			/>
		{/key}
		<div class="font-normal mt-12 sm:w-2/3">
			<PrismicRichText field={slice.primary.gallery_closing_text} />
		</div>
		{#if slice.primary.button_bottom_text && isFilled.link(slice.primary.button_bottom_link)}
			<LinkArrowButton
				text={slice.primary.button_bottom_text}
				href={slice.primary.button_bottom_link.url}
				class="mt-8"
				opensNewTab={slice.primary.button_bottom_link.link_type === 'Media'}
			/>
		{/if}
	</ContentWidth>
</section>
