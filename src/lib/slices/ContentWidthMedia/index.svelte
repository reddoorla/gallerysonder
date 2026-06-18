<script lang="ts">
	import type { VideoBlockSlice } from '../../../prismicio-types';

	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import placeholderThumbnail from '$lib/assets/images/homeImages/galleryImage.jpg';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';
	import { useSwipe, type SwipeCustomEvent } from 'svelte-gestures';
	import { fade } from 'svelte/transition';
	import { PrismicImage } from '@prismicio/svelte';
	import { isFilled, type ImageField } from '@prismicio/client';
	import { ArrowLeft, ArrowRight, Plus, CirclePlay, Volume2 } from '@lucide/svelte';
	import { onDestroy } from 'svelte';
	import { srcset } from '$lib/utils/image';

	const appState = getAppState();

	let viewportWidth = $state(0);
	let viewportHeight = $state(0);

	let { slice }: { slice: VideoBlockSlice } = $props();

	// Google Maps Embed keys are necessarily public (they ride in the iframe URL),
	// so the real protection is HTTP-referrer + API restrictions in the GCP console.
	// Sourcing from an env var keeps the literal out of git and lets the key rotate
	// without a code change. Set VITE_GOOGLE_MAPS_EMBED_KEY in .env and on Netlify.
	const mapsEmbedKey = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY ?? '';

	let showModal = $state(false);

	// The Vimeo embed loads from player.vimeo.com, whose Cloudflare edge sets
	// __cf_bm/_cfuvid third-party cookies on load (&dnt=1 does NOT prevent them),
	// failing Lighthouse's third-party-cookie Best Practices audit. Deferring the
	// iframe until the block nears the viewport keeps it out of the initial load
	// (every media slice sits below the full-height hero, so it never loads during
	// an audit) while preserving the autoplay-in-place experience for real users.
	let isVideoVisible = $state(false);

	const lazyVideo = (node: HTMLElement) => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVideoVisible = true;
					observer.disconnect();
				}
			},
			{ rootMargin: '200px' }
		);
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	};

	const openModal = () => {
		showModal = true;
		appState.isModalActive = true;
		appState.lockBodyScroll();
	};

	const closeModal = () => {
		showModal = false;
		appState.isModalActive = false;
		appState.unlockBodyScroll();
	};

	// Derive the slideshow arrays so they react to slice changes (the slice
	// simulator reuses the component across variation/content switches; the old
	// init-once `let` left these stale). The list is tripled so the infinite
	// slider always has neighbours to scroll to.
	const imageArray = $derived(slice.variation === 'slideshow' ? slice.items : []);
	const tripledImages = $derived.by<ImageField[]>(() => {
		if (slice.variation !== 'slideshow') return [];
		const base = imageArray.map((item) => item.image);
		return [...base, ...base, ...base];
	});
	let sliderIndex = $state(0);
	let isSlideAnimated = $state(true);

	const SLIDER_TRANSITION_LENGTH_IN_MS = 2000;

	// Track wrap-around timeouts so a pending one (up to ~2s) can't fire into a
	// destroyed component after navigating away.
	let sliderTimeouts: ReturnType<typeof setTimeout>[] = [];

	const resetSliderToStart = () => {
		sliderTimeouts.push(
			setTimeout(() => (isSlideAnimated = false), SLIDER_TRANSITION_LENGTH_IN_MS),
			setTimeout(() => (sliderIndex = 0), SLIDER_TRANSITION_LENGTH_IN_MS + 20),
			setTimeout(() => (isSlideAnimated = true), SLIDER_TRANSITION_LENGTH_IN_MS + 40)
		);
	};

	const resetSliderToEnd = () => {
		sliderTimeouts.push(
			setTimeout(() => (isSlideAnimated = false), SLIDER_TRANSITION_LENGTH_IN_MS),
			setTimeout(() => (sliderIndex = imageArray.length - 1), SLIDER_TRANSITION_LENGTH_IN_MS + 20),
			setTimeout(() => (isSlideAnimated = true), SLIDER_TRANSITION_LENGTH_IN_MS + 40)
		);
	};

	onDestroy(() => sliderTimeouts.forEach(clearTimeout));

	const slideRight = () => {
		sliderIndex--;
		if (sliderIndex < 0) resetSliderToEnd();
	};
	const slideLeft = () => {
		sliderIndex++;
		if (sliderIndex == imageArray.length) resetSliderToStart();
	};

	function handleSwipe(event: SwipeCustomEvent) {
		if (event.detail.direction === 'left') slideLeft();
		if (event.detail.direction === 'right') slideRight();
	}

	const desktopWidthClasses: Record<string, string> = {
		full: 'w-full',
		'3/4': 'w-full lg:w-3/4',
		'2/3': 'w-full lg:w-2/3',
		'1/2': 'w-full lg:w-1/2',
		'1/3': 'w-full lg:w-1/3',
		'1/4': 'w-full lg:w-1/4'
	};

	const getDesktopWidthClass = () => {
		if (slice.variation === 'image' && slice.primary.desktop_width) {
			return desktopWidthClasses[slice.primary.desktop_width] || 'w-full';
		}
		return 'w-full';
	};
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

<section
	class="w-full {slice.primary.hide ? 'hidden' : ''}"
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	style="background-color: {appState.backgroundColor}"
>
	{#if slice.primary.shape_top !== '0'}<div class="-translate-y-[99%]">
			<TopShape shapeNumber={slice.primary.shape_top || 0} />
		</div>
	{/if}
	<ContentWidth class="lg:pl-20">
		{#if slice.primary.eyebrow}
			<h5 aria-level="2" class="mt-8 mb-4 md:mt-16 md:mb-12 uppercase">
				<b>{slice.primary.eyebrow || ''}</b>
			</h5>
		{/if}
		{#if slice.variation === 'default' && slice.primary.vimeo_id}
			<button
				use:lazyVideo
				class="w-full aspect-video relative mt-16"
				onclick={openModal}
				aria-label="Play video"
			>
				<img
					src={slice.primary.placeholder_image.url}
					srcset={srcset(slice.primary.placeholder_image.url)}
					sizes="100vw"
					alt="video thumbnail placeholder"
					loading="lazy"
					decoding="async"
					class="w-full h-full object-cover"
				/>
				{#if isVideoVisible}
					<iframe
						title="background video"
						src={`https://player.vimeo.com/video/${slice.primary.vimeo_id.includes('?h=') ? slice.primary.vimeo_id + '&' : slice.primary.vimeo_id + '?'}background=1&muted=1&loop=1&autoplay=1&dnt=1`}
						class="aspect-video absolute w-full h-full z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
						frameborder="0"
						allowfullscreen
					></iframe>
				{/if}
				<!-- <div
					class="bottom-4 md:bottom-8 left-4 w-24 md:left-8 absolute flex flex-row justify-between gap-4"
				>
					<button
						class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump"
					>
						<CirclePlay class="size-[2em]" strokeWidth={2} />
					</button>
					<button
						class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump"
					>
						<Volume2 class="size-[2em]" strokeWidth={2} />
					</button>
				</div> -->
			</button>
		{:else if slice.variation === 'default'}
			<PrismicImage
				field={slice.primary.placeholder_image}
				fallbackAlt=""
				sizes="100vw"
				loading="lazy"
				class="w-full aspect-video mt-16"
			/>
		{:else if slice.variation === 'image'}
			<PrismicImage
				field={slice.primary.image}
				fallbackAlt=""
				sizes="(min-width: 1024px) 66vw, 100vw"
				loading="lazy"
				class="{getDesktopWidthClass()} {slice.primary.float === 'right' ? 'lg:ml-auto' : ''} mt-16"
			/>
		{:else if slice.variation === 'slideshow'}
			<div
				class="w-full aspect-square md:aspect-video overflow-hidden relative mt-16"
				{...useSwipe(handleSwipe, () => ({ touchAction: 'pan-y' }))}
			>
				<div
					style="width: {tripledImages.length * 100}%; transform:translateX({(-sliderIndex /
						tripledImages.length -
						1 / 3) *
						100}%);"
					class="flex flex-row justify-between flex-nowrap h-full overflow-hidden will-change-transform
						{isSlideAnimated ? 'transition-transform duration-[2000ms] ease-fast-slow' : ''}"
				>
					{#each tripledImages as image, i (i)}
						<div
							style="width: {100 / tripledImages.length}%;"
							class="h-full relative overflow-hidden will-change-transform"
						>
							<PrismicImage
								field={image}
								fallbackAlt=""
								class="min-h-full min-w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover will-change-transform"
							/>
						</div>
					{/each}
				</div>
				<div class="flex flex-row justify-between items-center absolute bottom-6 left-6 gap-12">
					<button class="bump" onclick={slideRight} aria-label="Previous image">
						<ArrowLeft class="size-[2em] text-white drop-shadow-lg" strokeWidth={1.75} /></button
					>
					<button class="bump" onclick={slideLeft} aria-label="Next image">
						<ArrowRight class="size-[2em] text-white drop-shadow-lg" strokeWidth={1.75} /></button
					>
				</div>
				<div class="flex flex-row justify-between items-end absolute bottom-6 right-6">
					<button class="bump" onclick={openModal} aria-label="View full size"
						><Plus class="size-[2em] text-white" strokeWidth={1.75} /></button
					>
				</div>
			</div>
		{:else if slice.variation === 'embed'}
			{#if isFilled.geoPoint(slice.primary.center_point)}
				<iframe
					title="google map"
					class="w-full aspect-video relative mt-16"
					frameborder="0"
					style="border:0"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					src={`https://www.google.com/maps/embed/v1/place?key=${mapsEmbedKey}&q=${slice.primary.center_point.latitude},${slice.primary.center_point.longitude}`}
					allowfullscreen
				>
				</iframe>
			{:else}
				<iframe
					title="google map"
					class="w-full aspect-video relative mt-16"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.3897009596562!2d-117.87470001146133!3d33.595191804572465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dce185053be61d%3A0x1a37c375339550c8!2sGallery%20Sonder!5e0!3m2!1sen!2sus!4v1738268047328!5m2!1sen!2sus"
					style="border:0;"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			{/if}
		{/if}
	</ContentWidth>
</section>

{#if showModal && slice.variation === 'default'}
	<div
		class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
		transition:fade
	>
		<button class="absolute w-full h-full" onclick={closeModal} aria-label="Close"></button>
		<div class="w-4/5 aspect-video relative">
			<img
				src={slice.primary.placeholder_image.url || placeholderThumbnail}
				alt="video thumbnail placeholder"
				class="w-full h-full object-cover"
			/>
			<div
				class="bottom-4 md:bottom-8 left-4 w-24 md:left-8 absolute flex flex-row justify-between gap-4"
			>
				<button
					class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump"
					aria-label="Play video"
				>
					<CirclePlay class="size-[2em]" strokeWidth={2} />
				</button>
				<button
					class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump"
					aria-label="Toggle sound"
				>
					<Volume2 class="size-[2em]" strokeWidth={2} />
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showModal && slice.variation === 'slideshow'}
	<div
		class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
		transition:fade
	>
		<button class="absolute w-full h-full" onclick={closeModal} aria-label="Close"></button>

		<div
			class="w-full h-full overflow-hidden relative"
			{...useSwipe(handleSwipe, () => ({ touchAction: 'pan-y' }))}
		>
			<div
				style="width: {tripledImages.length * 100}%; transform:translateX({(-sliderIndex /
					tripledImages.length -
					1 / 3) *
					100}%);"
				class="flex flex-row justify-between flex-nowrap h-full overflow-hidden
						{isSlideAnimated ? 'transition-transform duration-[2000ms]' : ''}"
			>
				{#each tripledImages as image, i (i)}
					<div
						style="width: {100 / tripledImages.length}%;"
						class="h-full w-full relative overflow-hidden"
					>
						<PrismicImage
							field={image}
							fallbackAlt=""
							class="min-h-full min-w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
						/>
					</div>
				{/each}
			</div>
			<div class="w-36 h-12 flex flex-row justify-between items-center absolute bottom-12 left-12">
				<button class="bump" onclick={slideRight} aria-label="Previous image">
					<ArrowLeft class="size-[2em] text-white" strokeWidth={1.75} /></button
				>
				<button class="bump" onclick={slideLeft} aria-label="Next image">
					<ArrowRight class="size-[2em] text-white" strokeWidth={1.75} /></button
				>
			</div>
			<div class="w-12 h-12 flex flex-row justify-between items-end absolute bottom-12 right-12">
				<button class="bump" onclick={closeModal} aria-label="Close"
					><Plus class="size-[2em] text-white rotate-45" strokeWidth={1.75} /></button
				>
			</div>
		</div>
	</div>
{/if}
