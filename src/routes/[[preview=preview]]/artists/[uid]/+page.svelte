<script lang="ts">
	import { onMount } from 'svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';

	import { components } from '$lib/slices';
	import { SliceZone } from '@prismicio/svelte';

	import Footer from '$lib/components/Footer.svelte';
	import InnerPageNav from '$lib/components/InnerPageNav.svelte';
	import HeroBackgroundImage from '$lib/components/HeroBackgroundImage.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';
	import { page } from '$app/stores';
	import { absoluteUrl, jsonLdScript } from '$lib/site';

	import { fade } from 'svelte/transition';

	const appState = getAppState();

	let { data } = $props();

	let content = $derived(data.page.data);

	let titleLines = $derived(
		[content.title_line_one, content.title_line_two, content.title_line_three]
			.map((line) => (typeof line === 'string' ? line.trim() : ''))
			.filter(Boolean)
	);

	let heroAlt = $derived(titleLines.join(' ').trim());

	// The hero renders one <h1> per title line. An artist can clear
	// artistHasPublicPage() on a hero image or a slice alone — an editor uploading
	// the background before writing the title is the ordinary case — and then the
	// hero had three EMPTY headings over the image. Fall back to the name, which
	// is set on every artist doc, so a page we agree to serve always says whose it
	// is. Split so a two-word name still breaks across lines the way the CMS
	// title lines do.
	let heroLines = $derived(
		titleLines.length ? titleLines : (content.full_name || '').trim().split(/\s+/).filter(Boolean)
	);

	// Person structured data for artist rich results (name from full_name, no
	// free-text fields shoehorned into typed schema properties).
	let personLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: content.full_name || heroAlt,
		url: absoluteUrl($page.url.pathname),
		...(content.background_image?.url ? { image: content.background_image.url } : {}),
		worksFor: { '@type': 'ArtGallery', name: 'Gallery Sonder' }
	});

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

	$effect(function revealPageElements() {
		checkPosition();
		setTimeout(() => (showEyebrow = true), 1000);
	});

	onMount(() => {
		window.addEventListener('scroll', checkPosition);
		appState.backgroundColorDefault = content.default_background_color || '#E4EEEA';

		return () => {
			window.removeEventListener('scroll', checkPosition);
		};
	});
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags (safe: JSON.stringify + escaped <) -->
	{@html jsonLdScript(personLd)}
</svelte:head>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

<div
	class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip min-h-full min-w-full aspect-video fixed -z-10"
>
	<HeroBackgroundImage
		image={content.background_image}
		altFallback={heroAlt}
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
	<ContentWidth
		class="h-full flex flex-col justify-end items-start transition-opacity {!isBackgroundDark &&
		showEyebrow
			? ''
			: 'opacity-0'}"
	>
		<!-- baseline-flush is md-and-up here by choice, not an oversight: phone
		     viewports vary too much for sitting these titles on the very edge to
		     read well, so below md they keep the default `justify-end` gap. The
		     other heroes take the nudge at every width. -->
		{#each heroLines as line, i (i)}
			<h1 class="mb-0 pb-0 md:baseline-flush w-fit text-white {i === 1 ? 'md:text-nowrap' : ''}">
				{line}
			</h1>
		{/each}
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
