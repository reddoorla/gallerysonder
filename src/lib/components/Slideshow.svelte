<script lang="ts">
	import { swipe } from 'svelte-gestures';
	import { fade } from 'svelte/transition';
	import { PrismicImage } from '@prismicio/svelte';
	import type { ImageField } from '@prismicio/client';
	import { isFilled } from '@prismicio/helpers';
	import { activeArtwork } from '$lib/stores/lightbox';
	import { onMount } from 'svelte';
  
	let viewportWidth: number;
	let imageArray: ImageField[] = [];
	let tripledImages: ImageField[] = [];
  
	const setImageArray = () => {
	  imageArray = [];
	  
	  if ($activeArtwork?.data.primary_image && isFilled.image($activeArtwork.data.primary_image)) {
		imageArray.push($activeArtwork.data.primary_image);
		
		if ($activeArtwork?.data.secondary_images && $activeArtwork.data.secondary_images.length > 0) {
		  $activeArtwork.data.secondary_images.forEach((e) => {
			if (e.image && isFilled.image(e.image)) {
			  imageArray.push(e.image);
			}
		  });
		}
	  }
	  

	  tripledImages = [...imageArray, ...imageArray, ...imageArray];
	  console.log('Image Array:', imageArray);
	  console.log('Tripled Images:', tripledImages);
	};
  

	$: if ($activeArtwork) {
	  setImageArray();
	}
  
	let sliderIndex = 0;
	let isSlideAnimated = true;
	const SLIDER_TRANSITION_LENGTH_IN_MS = 2000;
  
	const resetSliderToStart = () => {
	  setTimeout(() => (isSlideAnimated = false), SLIDER_TRANSITION_LENGTH_IN_MS);
	  setTimeout(() => (sliderIndex = 0), SLIDER_TRANSITION_LENGTH_IN_MS + 20);
	  setTimeout(() => (isSlideAnimated = true), SLIDER_TRANSITION_LENGTH_IN_MS + 40);
	};
  
	const resetSliderToEnd = () => {
	  setTimeout(() => (isSlideAnimated = false), SLIDER_TRANSITION_LENGTH_IN_MS);
	  setTimeout(() => (sliderIndex = imageArray.length - 1), SLIDER_TRANSITION_LENGTH_IN_MS + 20);
	  setTimeout(() => (isSlideAnimated = true), SLIDER_TRANSITION_LENGTH_IN_MS + 40);
	};
  
	const slideRight = () => {
	  sliderIndex--;
	  if (sliderIndex < 0) resetSliderToEnd();
	  console.log('Current slide index:', sliderIndex);
	};
  
	const slideLeft = () => {
	  sliderIndex++;
	  if (sliderIndex >= imageArray.length) resetSliderToStart();
	  console.log('Current slide index:', sliderIndex);
	};
  
	const handleSwipe = (
	  e: CustomEvent<{ direction: 'left' | 'top' | 'right' | 'bottom'; target: EventTarget }>
	) => {
	  if (e.detail.direction === 'left') slideLeft();
	  if (e.detail.direction === 'right') slideRight();
	};
  
	onMount(() => {
	  setImageArray();
	  console.log('Component mounted, images initialized');
	});
  </script>
  
  <div
	class="w-full h-full overflow-hidden relative"
	use:swipe={{ touchAction: 'pan-y' }}
	on:swipe={handleSwipe}
  >
	{#if tripledImages.length > 0}
	  <div
		style="width: {tripledImages.length * 100}%; transform:translateX({((-sliderIndex / tripledImages.length) - (1/3)) * 100}%);"
		class="flex flex-row justify-between flex-nowrap h-full w-full overflow-hidden
		{isSlideAnimated ? 'transition-transform duration-[2000ms]' : ''}"
	  >
		{#each tripledImages as image, i}
		  <div
			style="width: {100 / tripledImages.length}%;"
			class="h-full relative overflow-hidden"
		  >
			<PrismicImage
			  field={image}
			  class="min-h-full min-w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
			/>
		  </div>
		{/each}
	  </div>
	  
	  <div
		class="w-36 h-12 flex flex-row justify-between items-center absolute bottom-0 left-6"
	  >
		<button class="bump" on:click={slideRight}>
		  <i class="fa-sharp fa-regular fa-arrow-left text-white fa-2xl shadow-sm" />
		</button>
		<button class="bump" on:click={slideLeft}>
		  <i class="fa-sharp fa-regular fa-arrow-right text-white fa-2xl shadow-sm" />
		</button>
	  </div>
	{:else}
	  <div class="w-full h-full flex items-center justify-center">
		<p>No images available</p>
	  </div>
	{/if}
  </div>