<script lang='ts'>
	import type { TitleBlockSlice } from "../../../prismicio-types";
	import TopShape from "$lib/components/Shapes/topShape.svelte";
	import { backgroundColor } from "$lib/stores/backgroundColor";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import LinkArrowButton from "$lib/components/Buttons/LinkArrowButton.svelte";
	import * as prismicH from '@prismicio/helpers'

	let viewportWidth:number;

	export let slice:TitleBlockSlice;
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<TopShape shapeNumber={slice.primary.shape_top||0}/>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="w-full md:bg-transparent" style="background-color: {(viewportWidth>768 && slice.primary.shape_top !== "0" ? "transparent" : $backgroundColor)} ">
	<ContentWidth class="h-full flex flex-col items-left lg:pl-20 relative">
		<h5>{slice.primary.eyebrow||""}</h5>
		<h3 class='mt-6'>{slice.primary.title||""}</h3>
		<h6 class='mb-6'>{slice.primary.subtitle||""}</h6>
		<LinkArrowButton text={slice.primary.button_text||""} href={(prismicH.isFilled.link(slice.primary.button_link) ? slice.primary.button_link.url : "#")}/>
	</ContentWidth>
</section>
