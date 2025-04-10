<script lang="ts">
	import type { ImageGallerySlice } from '../../../prismicio-types';

	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';

	import { backgroundColor } from '$lib/stores/backgroundColor';
	import { PrismicRichText } from '@prismicio/svelte';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import { isFilled } from '@prismicio/helpers';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';


	let viewportWidth: number;

	let shape:HTMLElement;
	let shapeHeight:number;

	

	onMount(()=>{
		if(shape)
			shapeHeight=shape.getBoundingClientRect().height	
	}
)

onNavigate(()=>{
		if(shape)
			shapeHeight=shape.getBoundingClientRect().height	
	}
)

	export let slice: ImageGallerySlice;


	let isTruncated = slice.primary.show_more_button;
</script>

<svelte:window bind:innerWidth={viewportWidth} />

{#if slice.primary.shape_top !== '0'}
	<div style="height:{shapeHeight}px;"></div>
{/if}

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="w-screen  use-gpu transition duration-1000"
	style="background-color: {$backgroundColor}"
>
	{#if slice.primary.shape_top !== '0'}<div
			class="-translate-y-[98%]" 
			bind:this={shape}
		>
			<TopShape shapeNumber={slice.primary.shape_top||""} />
		</div>
	{/if}
	<ContentWidth class="lg:pl-20">
		{#if slice.primary.gallery_eyebrow}
			<h5 class="mb-12 mt-24 uppercase"><b>{slice.primary.gallery_eyebrow || ''}</b></h5>
		{/if}
		{#key slice}
		<Gallery {slice} isList={slice.primary.islist} isRegular={!slice.primary.is_staggered} {isTruncated} />
		{/key}
		<div class="font-normal mt-12 sm:w-2/3">
			<PrismicRichText field={slice.primary.gallery_closing_text} />
		</div>
		{#if slice.primary.button_bottom_text&& isFilled.link(slice.primary.button_bottom_link)}
			<LinkArrowButton text={slice.primary.button_bottom_text} href={slice.primary.button_bottom_link.url} class="mt-8" />
		{/if}

	</ContentWidth>
</section>
