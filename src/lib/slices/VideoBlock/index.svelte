<script lang='ts'>
	import type { VideoBlockSlice } from "../../../prismicio-types";



	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import placeholderThumbnail from "$lib/assets/images/homeImages/galleryImage.jpg"
	import TopShape from "$lib/components/Shapes/TopShape.svelte";

	import { backgroundColor } from "$lib/stores/backgroundColor";

	let viewportWidth:number;

	export let slice:VideoBlockSlice;
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<TopShape shapeNumber={slice.primary.shape_top} />

<section class='w-full xl:-mb-[540px]' data-slice-type={slice.slice_type} data-slice-variation={slice.variation} style="background-color: {(viewportWidth>1340 ? "transparent" : $backgroundColor)}">

		<ContentWidth class="lg:pl-20">
			<div class="w-full aspect-video relative mt-16">
				<img src={slice.primary.placeholder_image.url||placeholderThumbnail} alt='video thumbnail placeholder' class="w-full h-full object-cover"/>
				<div class="bottom-4 md:bottom-8 left-4 w-24 md:left-8 absolute flex flex-row justify-between gap-4">
					<button class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump">
						<i class="fa-solid fa-circle-play fa-2xl"></i>
					</button>
					<button  class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump">
						<i class="fa-solid fa-volume-high fa-2xl"></i>
					</button>
				</div>
			</div>
		</ContentWidth>
		<div class="w-screen h-[540px] -mt-[540px] mb-[540px] hidden xl:block" style="background-color: {$backgroundColor};"/>

</section>
