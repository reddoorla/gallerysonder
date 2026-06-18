<script lang="ts">
	import type { NameListSlice } from '../../../prismicio-types';
	import { isFilled } from '@prismicio/client';
	import type { ArtistDocumentData } from '../../../prismicio-types';
	import type { NameListItem, ResolvedNameListSlice } from '$lib/utils/gallery';
	import NameRevealOnHover from '$lib/components/NameRevealOnHover.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import TopShapeSpacer from '$lib/components/Shapes/TopShapeSpacer.svelte';
	import { shapeMargin } from '$lib/actions/shapeMargin';
	import { onMount } from 'svelte';
	import { fetchFromRelationship } from '$lib/utils/prismic';

	const appState = getAppState();

	let { slice }: { slice: NameListSlice } = $props();

	// Shape positioned out of flow; uniform gap below the curve via --shape-gap.
	const shaped = $derived(slice.primary.shape_top !== '0');

	// Prefer server-resolved items (resolveNameLists in the page load) so the list
	// is server-rendered with no "Loading artists..." flash / CLS. Fall back to a
	// client fetch only when they're absent (e.g. the slice simulator).
	const resolved = $derived((slice as ResolvedNameListSlice).resolvedItems);
	let clientItems = $state<NameListItem[]>([]);
	let isLoading = $state(false);
	const artistItems = $derived(resolved ?? clientItems);

	async function fetchArtistItems() {
		isLoading = true;
		const out: NameListItem[] = [];
		for (const item of slice.items) {
			const artistData: NameListItem = {
				activeImage: item.artist_active_image.url || '',
				color: item.artist_color || '#E4EEEA',
				link: item.artist_page || { link_type: 'Web', url: '' },
				doubleHeight: item.doubleheight || false,
				label: item.artist_active_image.alt || ''
			};

			const fetchedArtist = await fetchFromRelationship<ArtistDocumentData>(item.artist, 'artist');

			if (fetchedArtist) {
				if (!isFilled.image(item.artist_active_image) && isFilled.image(fetchedArtist.nav_image)) {
					artistData.activeImage = fetchedArtist.nav_image.url;
				}

				if (!item.artist_color && fetchedArtist.artist_color) {
					artistData.color = fetchedArtist.artist_color;
				}

				if (
					!isFilled.link(item.artist_page) &&
					isFilled.contentRelationship(item.artist) &&
					item.artist.uid
				) {
					artistData.link = {
						link_type: 'Web',
						url: '/artists/' + item.artist.uid
					};
				}

				if (!artistData.label) artistData.label = fetchedArtist.full_name || '';
			}

			out.push(artistData);
		}

		clientItems = out;
		isLoading = false;
	}

	onMount(() => {
		if (!resolved) fetchArtistItems();
	});
</script>

<TopShapeSpacer shapeNumber={slice.primary.shape_top || '0'} />

<section
	use:shapeMargin
	class="relative w-full use-gpu transition-all duration-1000 {slice.primary.hide ? 'hidden' : ''}"
	id={slice.primary.sectionLabel}
	style="background-color:{appState.backgroundColor};"
>
	{#if shaped}
		<div class="absolute left-0 top-0 w-screen -translate-y-[99%]">
			<TopShape shapeNumber={slice.primary.shape_top || '0'} />
		</div>
	{/if}

	<ContentWidth
		class="lg:pl-20 relative flex flex-col gap-8 md:gap-16 mb-16 {shaped
			? 'z-10 mt-[calc(var(--shape-base)_+_var(--shape-margin))]'
			: ''}"
	>
		{#if slice.primary.section_eyebrow}
			<h5 aria-level="2" class="uppercase">{slice.primary.section_eyebrow || ''}</h5>
		{/if}

		{#if isLoading}
			<div class="w-full flex justify-center items-center py-4">
				<span>Loading artists...</span>
			</div>
		{:else}
			{#each artistItems as item, i (i)}
				<NameRevealOnHover
					activeImage={item.activeImage}
					label={item.label}
					onmouseover={() => (appState.backgroundColor = item.color)}
					onmouseout={() => (appState.backgroundColor = appState.backgroundColorDefault)}
					href={isFilled.link(item.link) ? item.link.url : ''}
					class={item.doubleHeight
						? 'h-11 sm:h-[66px] md:h-[110px] lg:h-[132px]'
						: 'h-4 sm:h-6 md:h-10 lg:h-12'}
				/>
			{/each}
		{/if}

		{#if slice.primary.bottom_button_text}
			<LinkArrowButton
				text={slice.primary.bottom_button_text || ''}
				href={isFilled.link(slice.primary.button_bottom_link)
					? slice.primary.button_bottom_link.url
					: ''}
				class="mt-16"
				opensNewTab={slice.primary.button_bottom_link.link_type === 'Media'}
			/>
		{/if}
	</ContentWidth>
</section>
