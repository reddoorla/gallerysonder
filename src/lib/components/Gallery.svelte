<script lang="ts">
	import type {
		ImageGallerySlice,
		ImageGallerySliceDefaultItem,
		ArtworkDocumentData,
		ArtistDocumentData,
		ExhibitDocumentData,
		NewsDocumentData
	} from '../../prismicio-types';
	import GridImage from './GridImage.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import { slide } from 'svelte/transition';
	import LinkPlusToggle from './Buttons/LinkPlusToggle.svelte';
	import { isFilled } from '@prismicio/client';
	import { onMount } from 'svelte';
	import type { LinkField, ImageField, KeyTextField } from '@prismicio/client';
	import { onNavigate } from '$app/navigation';
	import { fetchFromRelationship } from '$lib/utils/prismic';
	import { LoaderCircle } from '@lucide/svelte';

	let {
		slice,
		willBlur = false,
		isRegular = true,
		isList = false,
		isTruncated = $bindable(false),
		class: className = ''
	}: {
		slice: ImageGallerySlice;
		willBlur?: boolean;
		isRegular?: boolean;
		isList?: boolean;
		isTruncated?: boolean;
		class?: string;
	} = $props();
	let isHoverArray = $state<boolean[]>([]);
	let viewportWidth = $state(1024);

	function handleHover(value: boolean, index: number) {
		isHoverArray[index] = value;
	}

	function formatDateRange(dateStr: string | KeyTextField): string {
		if (!dateStr || typeof dateStr !== 'string') return dateStr as string;

		// Match format: 04.25.25 - 05.25.25
		const dateRangePattern = /^(\d{2})\.(\d{2})\.(\d{2})\s*-\s*(\d{2})\.(\d{2})\.(\d{2})$/;
		const match = dateStr.match(dateRangePattern);

		if (!match) return dateStr;

		const [_, startMonth, startDay, startYear, endMonth, endDay, endYear] = match;

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		const startMonthName = monthNames[parseInt(startMonth) - 1];
		const endMonthName = monthNames[parseInt(endMonth) - 1];
		const startFullYear = `20${startYear}`;
		const endFullYear = `20${endYear}`;

		// If years are different, show both years
		if (startYear !== endYear) {
			return `${parseInt(startDay)} ${startMonthName} ${startFullYear} - ${parseInt(endDay)} ${endMonthName} ${endFullYear}`;
		}

		// Same year, only show year at the end
		return `${parseInt(startDay)} ${startMonthName} - ${parseInt(endDay)} ${endMonthName} ${endFullYear}`;
	}

	interface GalleryItem {
		titleOne: string | KeyTextField;
		titleTwo: string | KeyTextField;
		eyebrow: string | KeyTextField;
		image: ImageField<never>;
		bodyOne: string | KeyTextField;
		bodyTwo: string | KeyTextField;
		buttonText: string | KeyTextField;
		buttonLink: LinkField;
		artUID: string;
		willOpen: boolean;
	}

	let galleryItems = $state<GalleryItem[]>([]);
	let isLoading = $state(true);

	async function fetchGalleryItems(items: ImageGallerySliceDefaultItem[]) {
		galleryItems = [];

		for (const item of items) {
			// Temp variables for fetching artist and title data
			let artist = '';
			let title = '';

			// Manual overrides from CMS
			let manualTitleOne = item.title_one;
			let manualTitleTwo = item.title_two;

			let itemData = {
				titleOne: '',
				titleTwo: '',
				eyebrow: item.eyebrow,
				image: item.image,
				bodyOne: item.subtitle,
				bodyTwo: item.subtitle_two,
				buttonText: item.button_text,
				buttonLink: item.link,
				artUID: '',
				willOpen: slice.primary.will_open
			};

			if (isFilled.contentRelationship(item.artwork) && item.artwork.uid) {
				const fetchedContent = await fetchFromRelationship<ArtworkDocumentData>(
					item.artwork,
					'artwork'
				);

				if (fetchedContent) {
					itemData.artUID = item.artwork.uid;

					if (!artist && isFilled.contentRelationship(fetchedContent.artist)) {
						const artistContent = await fetchFromRelationship<ArtistDocumentData>(
							fetchedContent.artist,
							'artist'
						);
						if (artistContent) {
							artist = artistContent.full_name ?? '';
						}
					}
					title = fetchedContent.title ?? '';
					if (!isFilled.image(itemData.image)) itemData.image = fetchedContent.primary_image;
					if (!itemData.bodyOne) itemData.bodyOne = fetchedContent.year;

					if (!itemData.bodyTwo) {
						itemData.bodyTwo = fetchedContent.medium;
						if (!itemData.bodyTwo) {
							itemData.bodyTwo = fetchedContent.dimensions;
						} else if (fetchedContent.dimensions) {
							itemData.bodyTwo = itemData.bodyTwo + '<br/>' + fetchedContent.dimensions;
						}
					}
				}
			} else if (isFilled.contentRelationship(item.exhibition) && item.exhibition.uid) {
				const fetchedContent = await fetchFromRelationship<ExhibitDocumentData>(
					item.exhibition,
					'exhibit'
				);

				if (fetchedContent) {
					itemData.willOpen = false;

					if (!itemData.eyebrow) itemData.eyebrow = fetchedContent.dates;

					if (!artist) {
						artist = fetchedContent.artist ?? '';
					}
					title = fetchedContent.title ?? '';
					if (!isFilled.image(itemData.image) && isFilled.image(fetchedContent.primary_image))
						itemData.image = fetchedContent.primary_image;
					if (!itemData.bodyOne) itemData.bodyOne = fetchedContent.short_description;
					if (!itemData.buttonText) itemData.buttonText = 'Explore';
					if (!isFilled.link(itemData.buttonLink))
						itemData.buttonLink = {
							link_type: 'Web',
							url: '/exhibitions/' + item.exhibition.uid
						};
				}
			} else if (isFilled.contentRelationship(item.news) && item.news.uid) {
				const fetchedContent = await fetchFromRelationship<NewsDocumentData>(item.news, 'news');

				if (fetchedContent) {
					itemData.willOpen = false;
					title = fetchedContent.full_name ?? '';
					if (!isFilled.image(itemData.image))
						itemData.image = fetchedContent.nav_image || fetchedContent.background_image;

					if (!isFilled.link(itemData.buttonLink))
						itemData.buttonLink = {
							link_type: 'Web',
							url: '/news/' + item.news.uid
						};
				}
			}

			// Apply titleOne and titleTwo logic
			// If manual overrides exist, use them; otherwise compute from artist/title
			if (manualTitleOne) {
				itemData.titleOne = manualTitleOne;
			} else {
				// If artist exists, titleOne = artist; otherwise titleOne = title
				itemData.titleOne = artist || title;
			}

			if (manualTitleTwo) {
				itemData.titleTwo = manualTitleTwo;
			} else {
				// If artist exists, titleTwo = title; otherwise titleTwo is empty
				itemData.titleTwo = artist ? title : '';
			}

			galleryItems.push(itemData);
		}

		isHoverArray = new Array(galleryItems.length).fill(false);
		isLoading = false;
	}

	onMount(() => fetchGalleryItems(slice.items));

	onNavigate(() => {
		fetchGalleryItems(slice.items);
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

{#if isLoading}
	<div class="w-full flex justify-center items-center py-32">
		<LoaderCircle class="size-[2em] animate-spin" strokeWidth={2} />
	</div>
{:else if isList && viewportWidth > 768}
	<div class="w-full flex flex-col gap-16 mb-8">
		{#each galleryItems as item, i (i)}
			<div class="flex flex-row no-underline overflow-hidden">
				<button class="w-1/2 pr-16 no-underline pointer-events-none">
					<GridImage
						class="w-full aspect-8/5"
						src={item.image.url || ''}
						alt={item.titleOne || item.titleTwo || ''}
						willOpen={item.willOpen}
						artworkUID={item.artUID}
						href={isFilled.link(item.buttonLink) ? item.buttonLink.url : ''}
					/>
				</button>

				<div class="w-1/2 h-full flex flex-col gap-2">
					{#if item.eyebrow}
						<h6 class="tracking-[1.5px]">{formatDateRange(item.eyebrow)}</h6>
					{/if}
					{#if item.titleOne}
						<h3>{item.titleOne}</h3>
					{/if}
					{#if item.titleTwo}
						<h6 class="font-bold">{item.titleTwo}</h6>
					{/if}
					{#if item.bodyOne}
						<p class="mt-2">{item.bodyOne}</p>
					{/if}
					{#if item.bodyTwo}
						<p>{item.bodyTwo}</p>
					{/if}
					{#if prismicHelpers.isFilled.link(item.buttonLink)}
						<LinkArrowButton
							text={item.buttonText || 'explore'}
							href={item.buttonLink.url}
							class="mt-4"
						/>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else if isList}
	<div class="w-full flex flex-row flex-wrap items-center gap-8 justify-start {className}">
		{#each galleryItems as item, i (i)}
			{#if !isTruncated || i < 4}
				<div
					class="w-full md:w-1/2 pr-6 pb-6 use-gpu flex flex-col items-start transition duration-700 delay-700 justify-start relative
					{isHoverArray.some(Boolean) && !isHoverArray[i] && willBlur ? 'blur' : ''}"
					transition:slide
				>
					<GridImage
						class={(i % 4 == 0 || i % 3 == 0) && !isRegular ? 'md:w-11/12' : 'md:w-9/12'}
						src={item.image.url || ''}
						alt={item.titleOne || item.titleTwo || ''}
						href={isFilled.link(item.buttonLink) ? item.buttonLink.url : ''}
						bind:isHover={isHoverArray[i]}
						onHoverChange={(value) => handleHover(value, i)}
						artworkUID={item.artUID}
					/>

					{#if item.eyebrow}
						<span class="tracking-widest mt-2">{formatDateRange(item.eyebrow)}</span>
					{/if}
					{#if item.titleOne}
						<span class="mt-2 uppercase">{item.titleOne}</span>
					{/if}
					{#if item.titleTwo}
						<h5 class="mt-2 uppercase italic">{item.titleTwo}</h5>
					{/if}
					{#if item.bodyOne}
						<p class="mt-2">{item.bodyOne}</p>
					{/if}
					{#if item.bodyTwo}
						<p class="mt-2">{item.bodyTwo}</p>
					{/if}
					{#if prismicHelpers.isFilled.link(item.buttonLink)}
						<LinkArrowButton
							text={item.buttonText || 'explore'}
							href={item.buttonLink.url}
							class="mt-4"
						/>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{:else}
	<div class="w-full flex flex-row flex-wrap items-center justify-start gap-y-10 {className}">
		{#each galleryItems as item, i (i)}
			{#if !isTruncated || i < 4}
				<div
					class="w-full md:w-1/2 pr-6 pb-6 use-gpu flex flex-col items-start transition duration-700 delay-700 justify-start relative
					{isHoverArray.some(Boolean) && !isHoverArray[i] && willBlur ? 'blur' : ''}"
					transition:slide
				>
					<span class="tracking-widest mb-4">{item.eyebrow || ''}</span>
					<GridImage
						class={(i % 4 == 0 || i % 3 == 0) && !isRegular ? 'md:w-11/12' : 'md:w-9/12'}
						src={item.image.url || ''}
						text={item.titleOne || ''}
						subtitle={item.titleTwo && item.bodyOne
							? `<i>${item.titleTwo}</i>, ${item.bodyOne}`
							: item.titleTwo
								? `<i>${item.titleTwo}</i>`
								: item.bodyOne || ''}
						alt={item.titleOne || item.titleTwo || ''}
						subtitleTwo={item.bodyTwo || ''}
						href={isFilled.link(item.buttonLink) ? item.buttonLink.url : ''}
						willOpen={item.willOpen}
						bind:isHover={isHoverArray[i]}
						onHoverChange={(value) => handleHover(value, i)}
						artworkUID={item.artUID}
					/>
				</div>
			{/if}
		{/each}
	</div>
{/if}

{#if slice.primary.show_more_button && galleryItems.length > 4}
	<LinkPlusToggle
		text={isTruncated ? 'Show More' : 'Show Less'}
		onclick={() => (isTruncated = !isTruncated)}
		class="mt-8"
	/>
{/if}
