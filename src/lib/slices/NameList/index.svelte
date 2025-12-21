<script lang="ts">
	import type { NameListSlice } from '../../../prismicio-types';
	import * as prismicHelpers from '@prismicio/helpers';
	import { asLink, createClient, isFilled, type LinkField } from '@prismicio/client';
	import NameRevealOnHover from '$lib/components/NameRevealOnHover.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import { onMount } from 'svelte';

	const appState = getAppState();

	let { slice }: { slice: NameListSlice } = $props();

	let shape = $state<HTMLElement | undefined>(undefined);
	let shapeHeight = $state(0);
	let isLoading = $state(true);
	
	interface ArtistItem {
	  activeImage: string;
	  color: string;
	  link: LinkField;
	  doubleHeight?: boolean;
	}

	let artistItems = $state<ArtistItem[]>([]);
	
	async function fetchArtistItems() {
	  const client = createClient('gallerysonder');
	  
	  for (const item of slice.items) {
		let artistData = {
		  activeImage: item.artist_active_image.url || '',
		  color: item.artist_color || '#E4EEEA',
		  link: item.artist_page || { link_type: "Web", url: '' },
		  doubleHeight: item.doubleheight || false
		};

		if (isFilled.contentRelationship(item.artist) && item.artist.uid) {
		  try {
			const fetchedArtist = (await client.getByUID('artist', item.artist.uid)).data;
			console.log('Fetched artist data:', fetchedArtist);

			if (!isFilled.image(item.artist_active_image) && isFilled.image(fetchedArtist.nav_image)) {
			  artistData.activeImage = fetchedArtist.nav_image.url;
			}
			
			if (!item.artist_color && fetchedArtist.artist_color) {
			  artistData.color = fetchedArtist.artist_color;
			}

			if (!isFilled.link(item.artist_page)) {
			  artistData.link = {
             link_type: "Web",
             url: '/artists/' + item.artist.uid
           };
			}
		  } catch (error) {
			console.error('Error fetching artist data:', error);
		  }
		}
		
		artistItems.push(artistData);
	  }
	  
	  isLoading = false;
	}
	
	onMount(() => {
	  if (shape) {
		shapeHeight = shape.getBoundingClientRect().height;
	  }
	  
	  fetchArtistItems();
	});
   </script>
   
   {#if slice.primary.shape_top !== '0'}
	 <div style="height:{shapeHeight}px;"></div>
   {/if}
   
   <section
	 class="w-full use-gpu transition-all duration-1000 {slice.primary.hide ? 'hidden' : ''}"
	 id={slice.primary.sectionLabel}
	 style="background-color:{appState.backgroundColor};"
   >
	 {#if slice.primary.shape_top !== '0'}
	   <div class="-translate-y-[99%]" bind:this={shape}>
		 <TopShape shapeNumber={slice.primary.shape_top || '0'} />
	   </div>
	 {/if}
	 
	 <ContentWidth class="lg:pl-20 relative flex flex-col gap-8 md:gap-16 mb-16">
	   {#if slice.primary.section_eyebrow}
		 <h5 class="uppercase">{slice.primary.section_eyebrow || ''}</h5>
	   {/if}
	   
	   {#if isLoading}
		 <div class="w-full flex justify-center items-center py-4">
		   <span>Loading artists...</span>
		 </div>
	   {:else}
		 {#each artistItems as item, i}
		   <NameRevealOnHover
			 activeImage={item.activeImage}
			 onmouseover={() => appState.backgroundColor = item.color}
			 onmouseout={() => appState.backgroundColor = appState.backgroundColorDefault}
			 href={isFilled.link(item.link) ? item.link.url : ''}
			 class={item.doubleHeight?"h-11 sm:h-[66px] md:h-[110px] lg:h-[132px]":"h-4 sm:h-6 md:h-10 lg:h-12"}
		   />
		 {/each}
	   {/if}
	   
	   {#if slice.primary.bottom_button_text}
		 <LinkArrowButton
		   text={slice.primary.bottom_button_text || ''}
		   href={prismicHelpers.isFilled.link(slice.primary.button_bottom_link)
			 ? slice.primary.button_bottom_link.url
			 : ''}
		   class="mt-16"
		   opensNewTab={slice.primary.button_bottom_link.link_type==='Media'}
		 />
	   {/if}
	 </ContentWidth>
   </section>