<script lang="ts">
	import { onMount } from 'svelte';

	import ContentWidth from '$lib/components/ContentWidth.svelte';

	import { components } from '$lib/slices';
	import { SliceZone } from '@prismicio/svelte';

	import Footer from '$lib/components/Footer.svelte';
	import InnerPageNav from '$lib/components/InnerPageNav.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';

	import { fade } from 'svelte/transition';

	const appState = getAppState();

	let { data } = $props();

	let content = $derived(data.page.data);

	let viewportWidth = $state(0);
	let viewportHeight = $state(0);

	let showEyebrow = $state(false);

	let theBottomOfTheTop = $state<HTMLElement | undefined>(undefined);

	let slicesSections = $derived(
		data.page.data.slices.map((slice) => slice.primary?.sectionLabel || '')
	);

	let sections = $derived(data.page.data.sections.map((section) => section.section || ''));

	let isBackgroundDark = $state(false);

	const checkPosition = () => {
		if (theBottomOfTheTop && theBottomOfTheTop.getBoundingClientRect().bottom < 0) {
			isBackgroundDark = true;
		} else {
			isBackgroundDark = false;
		}
	};

	$effect(function animatePageElementsAfterIntro() {
		if (!appState.isIntroRunning) {
			checkPosition();
			setTimeout(() => (showEyebrow = true), 500);
		}
	});

	onMount(() => {
		window.addEventListener('scroll', checkPosition);
		appState.backgroundColorDefault = content.default_background_color || '#E4EEEA';

		return () => {
			window.removeEventListener('scroll', checkPosition);
		};
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

<div
	class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip min-h-full min-w-full aspect-video fixed -z-10"
>
	<img
		src={content.background_image.url}
		alt={content.background_image.alt}
		class="absolute bottom-0 left-0 h-full w-full object-cover -z-10"
	/>
	<div
		class="absolute w-screen h-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 backdrop-blur md:backdrop-blur-none bg-black {isBackgroundDark
			? 'opacity-55'
			: 'opacity-20'}"
		transition:fade
	></div>
</div>

<!-- <div class="background-container">
    <PrismicImage
      field={data.page.data.background_image}
      class="absolute object-cover  {isBackgroundDark ? "blur-sm md:blur-none":""}"

    />
    </div> -->

<div class="fixed w-screen h-screen-75 bottom-0">
	<ContentWidth class="h-full flex flex-col justify-end items-start transition-opacity ">
		<h5
			class="text-white font-light translate-y-[22%] lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow {showEyebrow &&
			!isBackgroundDark
				? ''
				: 'opacity-0'}"
		>
			{content.dates || ''}
		</h5>
		<h1
			class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white {showEyebrow &&
			!isBackgroundDark
				? ''
				: 'opacity-0'}"
		>
			{content.title_line_one || ''}
		</h1>
		<h1
			class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white {showEyebrow &&
			!isBackgroundDark
				? ''
				: 'opacity-0'}"
		>
			{content.title_line_two || ''}
		</h1>
		<h1
			class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white {showEyebrow &&
			!isBackgroundDark
				? ''
				: 'opacity-0'}"
		>
			{content.title_line_three || ''}
		</h1>
	</ContentWidth>
</div>
{#key data}
	<InnerPageNav {slicesSections} {sections} />
{/key}

<div class="flex flex-col" id="content-container" onscroll={checkPosition}>
	<div class="h-screen mb-[40vw]"></div>
	<div class="h-1" bind:this={theBottomOfTheTop}></div>

	<SliceZone slices={data.page.data.slices} {components} />

	<Footer />
</div>
