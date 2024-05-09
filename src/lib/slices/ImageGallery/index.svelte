<script lang='ts'>
	import type { ImageGallerySlice } from "../../../prismicio-types";

	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import Gallery from "$lib/components/Gallery.svelte";
	import LinkArrowButton from "$lib/components/Buttons/LinkArrowButton.svelte";

	import { backgroundColor } from "$lib/stores/backgroundColor";
	
	export let slice:ImageGallerySlice;
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="w-screen py-16" style="background-color: {$backgroundColor}">
	<ContentWidth class="lg:pl-20">
		<h5>Selected Works</h5>
		<Gallery {slice}/>
		
		<h2 class="font-normal mt-16 sm:w-2/3">The Complete Catalogue of <span class="font-bold">To the Garden We Return</span></h2>
		<LinkArrowButton text="explore" class="mt-8"/>
	</ContentWidth>
</section>
