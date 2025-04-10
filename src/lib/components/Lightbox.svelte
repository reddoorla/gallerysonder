<script lang='ts'>
    import { isLightboxActive, lightboxImageUrl, activeArtworkUid, activeArtwork, activeArtist } from "$lib/stores/lightbox";
    import { isModalActive } from "$lib/stores/isModalActive";
	import { fade } from "svelte/transition";
	import { backgroundColor } from "$lib/stores/backgroundColor";
	import ContentWidth from "./ContentWidth.svelte";
	import RotatingLogo from "./RotatingLogo.svelte";
	import { PrismicImage, PrismicRichText } from "@prismicio/svelte";
	import { isFilled } from "@prismicio/client";
	import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";
	import Slideshow from "./Slideshow.svelte";


	let viewportWidth:number;

	 

	



    const closeModal = () => {

		isModalActive.set(false)
        isLightboxActive.set(false)
        lightboxImageUrl.set('')
		activeArtworkUid.set('')
		if (document.getElementsByTagName('body'))
			(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'auto';
	};
</script>
<svelte:window bind:innerHeight={viewportWidth} />
<div transition:fade>

{#if viewportWidth<768 || !$activeArtwork  }

	<div
			class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-90 flex justify-center items-center z-40"
			transition:fade
		>
			<button class="absolute w-full h-full" on:click={closeModal}> </button>
			<div class="w-11/12 h-11/12 max-h-11/12 max-w-11/12 lg:w-4/5 lg:h-4/5 lg:max-w-4/5 lg:max-h-4/5">
				<img
					src={$lightboxImageUrl}
					alt="lightbox"
					class="w-full h-full object-contain"
				/>
				
			</div>
	</div>
{:else if $activeArtwork.data.orientation}
	<div
	class="w-screen h-screen fixed top-0 left-0 flex justify-center items-start lg:items-center z-40 overflow-scroll"
	transition:fade
	style="background-color:{$backgroundColor}" 
	>
		<ContentWidth class="h-full w-full relative flex flex-col lg:flex-row justify-center items-start lg:items-center gap-6 lg:gap-0">
			<div class="w-full absolute top-0 h-16 flex items-center justify-between">
				<button class="h-6 bump" on:click={closeModal}><i class="text-black fa-sharp fa-solid fa-close fa-2xl hover:opacity-80 transition"/></button>
				<a href="/" class="bump" on:click={closeModal}><RotatingLogo class="h-6 hover:opacity-80 transition" /></a>
				
			</div>
			<div class="w-full lg:w-1/2 h-2/5 lg:h-4/5 flex items-start lg:items-center justify-start lg:justify-center ">
				<div class="relative {$activeArtwork.data.orientation==='landscape'?'aspect-[4/3] w-full':$activeArtwork.data.orientation==='portrait'?'aspect-[3/4] h-full':'w-full max-w-full h-full max-h-full'}">
					{#if $activeArtwork.data.secondary_images[0]&&isFilled.image($activeArtwork.data.secondary_images[0].image) && $activeArtwork.data.orientation!=='fit'}
						<Slideshow />
					{:else}
						<PrismicImage class="{$activeArtwork.data.orientation==='fit'?"object-contain":"object-cover"} w-full h-full" field={$activeArtwork.data.primary_image} />
					{/if}
				</div>
				
			</div>
			<div class="w-full lg:w-1/2 lg:h-4/5 lg:p-16 lg:pr-0 flex flex-col items-start justify-center gap-6">
		
					{#if $activeArtist}
						<a on:click={closeModal} class="cursor-pointer hover:opacity-80 transition no-underline" href="/artists/{$activeArtist.uid}"><h5 class="brightness-50" style="color: {$activeArtist.data.artist_color||"black"};"><b>{$activeArtist.data.full_name}</b></h5></a>
					{/if}
				<div class="flex flex-col gap-1">
					<h6 class="uppercase"><b>{$activeArtwork.data.title}</b></h6>
					{#if $activeArtwork.data.year}
						<h6><b>{$activeArtwork.data.year}</b></h6>
					{/if}
					{#if $activeArtwork.data.medium}
						<h6><b>{$activeArtwork.data.medium}</b></h6>
					{/if}
					{#if $activeArtwork.data.dimensions}
						<h6><b>{$activeArtwork.data.dimensions}</b></h6>
					{/if}
				</div>
				{#if isFilled.richText($activeArtwork.data.body)}
				<div class="rich-text"><PrismicRichText field={$activeArtwork.data.body} /></div>
				{/if}
				<LinkArrowButton text="Inquire" href="/contact?inquire" click={closeModal}/>
			</div>

		</ContentWidth>
	</div>
{/if}
</div>
