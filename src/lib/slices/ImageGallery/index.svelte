<script lang='ts'>
	import type { ImageGallerySlice } from "../../../prismicio-types";

	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import Gallery from "$lib/components/Gallery.svelte";
	import LinkArrowButton from "$lib/components/Buttons/LinkArrowButton.svelte";

	import { backgroundColor } from "$lib/stores/backgroundColor";
	import { PrismicRichText } from "@prismicio/svelte";
	import TopShape from "$lib/components/Shapes/TopShape.svelte"
	
	let viewportWidth:number;
	
	export let slice:ImageGallerySlice;
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<TopShape shapeNumber={slice.primary.shape_top||"0"}/>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="w-screen py-16 transition duration-1000" style="background-color: { $backgroundColor}" >
	<ContentWidth class="lg:pl-20">
		<h5 class="pb-16">{slice.primary.gallery_eyebrow||""}</h5>
		<Gallery {slice} isList={slice.primary.islist} isRegular={!slice.primary.is_staggered}/>
	
		<div class="font-normal mt-40 sm:w-2/3">
			<PrismicRichText field={slice.primary.gallery_closing_text} />
		</div>
		<LinkArrowButton text={slice.primary.button_bottom_text||"explore"} class="mt-8"/>
	</ContentWidth>
</section>
