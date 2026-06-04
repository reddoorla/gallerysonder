<script lang="ts">
	import { useSwipe, type SwipeCustomEvent } from 'svelte-gestures';
	import { PrismicImage } from '@prismicio/svelte';
	import type { ImageField } from '@prismicio/client';
	import { isFilled } from '@prismicio/helpers';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import { onMount } from 'svelte';

	const appState = getAppState();

	let imageArray = $state<ImageField[]>([]);
	let tripledImages = $state<ImageField[]>([]);
	let lastProcessedArtworkId = '';

	const setImageArray = () => {
		imageArray = [];

		if (
			appState.activeArtwork?.data.primary_image &&
			isFilled.image(appState.activeArtwork.data.primary_image)
		) {
			imageArray.push(appState.activeArtwork.data.primary_image);

			if (
				appState.activeArtwork?.data.secondary_images &&
				appState.activeArtwork.data.secondary_images.length > 0
			) {
				appState.activeArtwork.data.secondary_images.forEach((e) => {
					if (e.image && isFilled.image(e.image)) {
						imageArray.push(e.image);
					}
				});
			}
		}

		tripledImages = [...imageArray, ...imageArray, ...imageArray];
		// console.log('Image Array:', imageArray);
		// console.log('Tripled Images:', tripledImages);
	};

	$effect(function updateImageArrayOnArtworkChange() {
		const artwork = appState.activeArtwork;
		if (artwork && artwork.id !== lastProcessedArtworkId) {
			lastProcessedArtworkId = artwork.id;
			setImageArray();
		}
	});

	let sliderIndex = $state(0);
	let isSlideAnimated = $state(true);
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
		// console.log('Current slide index:', sliderIndex);
	};

	const slideLeft = () => {
		sliderIndex++;
		if (sliderIndex >= imageArray.length) resetSliderToStart();
		// console.log('Current slide index:', sliderIndex);
	};

	function handleSwipe(event: SwipeCustomEvent) {
		if (event.detail.direction === 'left') slideLeft();
		if (event.detail.direction === 'right') slideRight();
	}

	onMount(() => {
		setImageArray();
		// console.log('Component mounted, images initialized');
	});
</script>

<div
	class="w-full h-full overflow-hidden relative"
	{...useSwipe(handleSwipe, () => ({ touchAction: 'pan-y' }))}
>
	{#if tripledImages.length > 0}
		<div
			style="width: {tripledImages.length * 100}%; transform:translateX({(-sliderIndex /
				tripledImages.length -
				1 / 3) *
				100}%);"
			class="flex flex-row justify-between flex-nowrap h-full w-full overflow-hidden
		{isSlideAnimated ? 'transition-transform duration-[2000ms]' : ''}"
		>
			{#each tripledImages as image, i (i)}
				<div style="width: {100 / tripledImages.length}%;" class="h-full relative overflow-hidden">
					<PrismicImage
						field={image}
						class="min-h-full min-w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
					/>
				</div>
			{/each}
		</div>

		<div class="flex flex-row justify-between items-center absolute bottom-6 left-6 gap-12">
			<button class="bump" onclick={slideRight} aria-label="Previous image">
				<i class="fa-sharp fa-regular fa-arrow-left text-white fa-2xl shadow-sm"></i>
			</button>
			<button class="bump" onclick={slideLeft} aria-label="Next image">
				<i class="fa-sharp fa-regular fa-arrow-right text-white fa-2xl shadow-sm"></i>
			</button>
		</div>
	{:else}
		<div class="w-full h-full flex items-center justify-center">
			<p>No images available</p>
		</div>
	{/if}
</div>
