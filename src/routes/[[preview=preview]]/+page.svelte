<script lang="ts">
	import { onMount } from 'svelte';

	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import ScaleTextToContainer from '$lib/components/ScaleTextToContainer.svelte';

	import { components } from '$lib/slices';
	import { SliceZone } from '@prismicio/svelte';

	import Footer from '$lib/components/Footer.svelte';
	import InnerPageNav from '$lib/components/InnerPageNav.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';

	import { fade } from 'svelte/transition';
	import AnimateIn from '$lib/components/Animation/AnimateIn.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import HeroBackgroundImage from '$lib/components/HeroBackgroundImage.svelte';

	const appState = getAppState();

	let { data } = $props();

	let content = $derived(data.page.data);

	// The hero background is the LCP element on every page. A descriptive alt
	// (falling back to the exhibition title/artist) satisfies image-alt for both
	// accessibility and SEO; an empty string would only satisfy a11y.
	let heroAlt = $derived(
		content.background_image.alt ||
			[content.title_line_one, content.title_line_two, content.title_line_three, content.artist]
				.filter(Boolean)
				.join(' ')
				.trim()
	);

	let viewportWidth = $state(0);
	let viewportHeight = $state(0);

	let showPresentedArtist = $state(false);
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
			setTimeout(() => (showPresentedArtist = true), 500);
			setTimeout(() => (showEyebrow = true), 1000);
		}
	});

	onMount(() => {
		appState.isIntroRunning = false;
		window.addEventListener('scroll', checkPosition);
		appState.backgroundColorDefault = content.default_background_color || '#E4EEEA';

		return () => {
			window.removeEventListener('scroll', checkPosition);
		};
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />
<Intro>
	<div
		class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip min-h-full min-w-full aspect-video fixed"
	>
		<HeroBackgroundImage image={content.background_image} altFallback={heroAlt} />
		<div
			class="absolute w-screen h-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 backdrop-blur md:backdrop-blur-none bg-black {isBackgroundDark
				? 'opacity-55'
				: 'opacity-20'}"
			transition:fade
		></div>
	</div>

	<div class="fixed w-screen h-screen-75 bottom-0">
		<ContentWidth class="h-full flex flex-col justify-end items-start transition-opacity">
			<span
				class="text-white translate-y-[22%] dates lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow {showEyebrow &&
				!isBackgroundDark
					? ''
					: 'opacity-0'}">{content.dates || ''}</span
			>
			<h5
				role="presentation"
				class="text-white translate-y-[22%] lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow {showEyebrow &&
				!isBackgroundDark
					? ''
					: 'opacity-0'}"
			>
				{content.artist || ''}
			</h5>
			<ScaleTextToContainer
				class="transition-opacity duration-500 ease-fast-slow {showPresentedArtist &&
				!isBackgroundDark
					? ''
					: 'opacity-0'}"
			>
				<AnimateIn>
					<h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white">
						{content.title_line_one || ''}
					</h1>
					<h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white">
						{content.title_line_two || ''}
					</h1>
					<h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white">
						{content.title_line_three || ''}
					</h1>
				</AnimateIn>
			</ScaleTextToContainer>
		</ContentWidth>
	</div>
	{#key data}
		<InnerPageNav {slicesSections} {sections} />
	{/key}
	<div class="flex flex-col" id="content-container" onscroll={checkPosition}>
		<div class="h-screen"></div>
		<div class="h-1" bind:this={theBottomOfTheTop}></div>

		<SliceZone slices={data.page.data.slices} {components} />

		<Footer />
	</div>
</Intro>

<style>
	.dates {
		font-family: 'commuters-sans';
		font-size: 21px;
		font-style: normal;
		font-weight: 300;
		line-height: 30px; /* 142.857% */
		letter-spacing: 1.5px;
		text-transform: uppercase;
	}
</style>
