<script lang="ts">
	import type { ImageGallerySlice, ImageGallerySliceDefaultItem } from '../../prismicio-types';
	import GridImage from './GridImage.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import * as prismicHelpers from '@prismicio/helpers';
	import { slide } from 'svelte/transition';
	import LinkPlusToggle from './Buttons/LinkPlusToggle.svelte';
	import { asLink, createClient, isFilled } from '@prismicio/client';
	import { onMount } from 'svelte';
	import type { LinkField, ImageField, KeyTextField } from '@prismicio/client';

	export let slice: ImageGallerySlice;

	export let willBlur = false;
	export let isRegular = true;
	export let isList = false;

	let isTruncated = slice.primary.show_more_button;
	let isHoverArray: boolean[] = [];
	let viewportWidth = 1024;

	function handleHover(event: CustomEvent<boolean>, index: number) {
		isHoverArray[index] = event.detail;
	}

	interface GalleryItem {
		artistName: string|KeyTextField;
		eyebrow: string|KeyTextField;
		title: string|KeyTextField;
		image: ImageField<never>;
		subtitleOne: string|KeyTextField;
		subtitleTwo: string|KeyTextField;
		buttonText: string|KeyTextField;
		buttonLink: LinkField;
		artUID: string;
		willOpen: boolean;
	} 

	let galleryItems: GalleryItem[] = [];
	let isLoading = true;

	async function fetchGalleryItems(items: ImageGallerySliceDefaultItem[]) {
		const client = createClient('gallerysonder');
	
		for (const item of items) {
			let itemData = {
				artistName: item.artist_name,
				eyebrow: item.eyebrow,
				title: item.title,
				image: item.image,
				subtitleOne: item.subtitle,
				subtitleTwo: item.subtitle_two,
				buttonText: item.button_text,
				buttonLink: item.link,
				artUID: '',
				willOpen : slice.primary.will_open
			}
			if(isFilled.contentRelationship(item.artwork) && item.artwork.uid) {
				const fetchedContent = (await client.getByUID('artwork', item.artwork.uid)).data
				itemData.artUID = item.artwork.uid;
				console.log(fetchedContent)

				if(!itemData.artistName && isFilled.contentRelationship(fetchedContent.artist) && fetchedContent.artist.uid) {
					const artistContent = (await client.getByUID('artist', fetchedContent.artist.uid)).data
					itemData.artistName = artistContent.full_name
				}
				itemData.title = fetchedContent.title
				if(!isFilled.image(itemData.image))
					itemData.image = fetchedContent.primary_image
				if(!itemData.subtitleOne)
					itemData.subtitleOne = fetchedContent.year
				
				if(!itemData.subtitleTwo) {
					itemData.subtitleTwo = fetchedContent.medium
					if(!itemData.subtitleTwo) {
						itemData.subtitleTwo = fetchedContent.dimensions
					} else if(fetchedContent.dimensions) {
						itemData.subtitleTwo = itemData.subtitleTwo + ', ' + fetchedContent.dimensions
					}
				}
			} else if(isFilled.contentRelationship(item.exhibition) && item.exhibition.uid){
				const fetchedContent = (await client.getByUID('exhibit', item.exhibition.uid)).data

				console.log(fetchedContent)

				itemData.willOpen=false;

				if(!itemData.eyebrow)
					itemData.eyebrow=fetchedContent.dates

				if(!itemData.artistName) {
					itemData.artistName = fetchedContent.artist;
				}
				itemData.title = fetchedContent.title
				if(!isFilled.image(itemData.image)&&isFilled.image(fetchedContent.primary_image))
					itemData.image = fetchedContent.primary_image
				if(!itemData.subtitleOne)
					itemData.subtitleOne = fetchedContent.short_description
				if(!itemData.buttonText)
					itemData.buttonText="Explore"
				if(!isFilled.link(itemData.buttonLink))
					itemData.buttonLink = {
						link_type: "Web",
						url:"/exhibitions/"+item.exhibition.uid
				}
			}
		
			console.log(itemData)
			galleryItems.push(itemData);
		}
		
		isHoverArray = new Array(galleryItems.length).fill(false);
		isLoading = false;
	}

	onMount(() => {
		fetchGalleryItems(slice.items);
	})
</script>

<svelte:window bind:innerWidth={viewportWidth} />

{#if isLoading}
	<div class="w-full flex justify-center items-center py-8">
		<span>Loading gallery...</span>
	</div>
{:else if isList && viewportWidth > 768}
	<div class="w-full flex flex-col gap-16 mb-8">
		{#each galleryItems as item, i (i)}
			<div class="flex flex-row no-underline overflow-hidden">
				<button class="w-1/2 pr-16 no-underline pointer-events-none">
					<GridImage
						class="w-full aspect-[8/5]"
						src={item.image.url || ''}
						alt={item.title || ''}
						willOpen={item.willOpen}
						artworkUID={item.artUID}
						href={isFilled.link(item.buttonLink) ? item.buttonLink.url : ''}
					/>
				</button>

				<div class="w-1/2 h-full flex flex-col gap-4">
					{#if item.eyebrow}
						<span class="tracking-widest">{item.eyebrow}</span>
					{/if}
					{#if item.artistName}
						<h6>{item.artistName}</h6>
					{/if}
					{#if item.title}
						<h3>{item.title}</h3>
					{/if}
					{#if item.subtitleOne}
						<p>{item.subtitleOne}</p>
					{/if}
					{#if item.subtitleTwo}
						<p>{item.subtitleTwo}</p>
					{/if}
					{#if prismicHelpers.isFilled.link(item.buttonLink)}
						<LinkArrowButton
							text={item.buttonText || "explore"}
							href={item.buttonLink.url}
						/>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else if isList}
	<div class="w-full flex flex-row flex-wrap items-center justify-between {$$props.class || ''}">
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
						alt={item.title || ''}
						href={isFilled.link(item.buttonLink) ? item.buttonLink.url : ''}
						bind:isHover={isHoverArray[i]}
						on:hover={(event) => handleHover(event, i)}
						artworkUID={item.artUID}
					/>
					
					{#if item.eyebrow}
						<span class="tracking-widest mt-2">{item.eyebrow}</span>
					{/if}
					{#if item.artistName}
						<span class="mt-2 uppercase">{item.artistName}</span>
					{/if}
					{#if item.title}
						<h5 class="mt-2 uppercase"><b>{item.title}</b></h5>
					{/if}
					{#if item.subtitleOne}
						<p class="mt-2">{item.subtitleOne}</p>
					{/if}
					{#if item.subtitleTwo}
						<p class="mt-2">{item.subtitleTwo}</p>
					{/if}
					{#if prismicHelpers.isFilled.link(item.buttonLink)}
						<LinkArrowButton
							text={item.buttonText || "explore"}
							href={item.buttonLink.url}
							class="mt-4"
						/>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{:else}
	<div class="w-full flex flex-row flex-wrap items-center justify-between gap-y-10 {$$props.class || ''}">
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
						text={item.title || ''}
						subtitle={
							item.artistName && item.subtitleOne 
							? item.artistName + ' / ' + item.subtitleOne
							: item.artistName || item.subtitleOne || ''}
						alt={item.title || ''}
						subtitleTwo={item.subtitleTwo || ''}
						href={isFilled.link(item.buttonLink) ? item.buttonLink.url : ''}
						willOpen={item.willOpen}
						bind:isHover={isHoverArray[i]}
						on:hover={(event) => handleHover(event, i)}
						artworkUID={item.artUID}
					/>
				</div>
			{/if}
		{/each}
	</div>
{/if}

{#if slice.primary.show_more_button && galleryItems.length > 4}
	<LinkPlusToggle text={isTruncated ? 'Show More' : 'Show Less'} click={() => isTruncated = !isTruncated} class="mt-8" />
{/if}