<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import logo from '$lib/assets/icons/SONDER_Logo.svg';
	import VimeoPlayer from '$lib/components/VimeoPlayer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';

	import { isIntroFinished } from '$lib/stores/isIntroFinished';

	import { onNavigate } from '$app/navigation';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import { isNewsletterActive } from '$lib/stores/isNewsletterActive';
	import { isLightboxActive } from '$lib/stores/lightbox';
	import Lightbox from '$lib/components/Lightbox.svelte';

	export let data;
	let isVideoLoaded = true;
	let isPlaying = false;
	let isTransitioning = false;

	interface VimeoComponent {
		play: () => Promise<void>;
		pause: () => Promise<void>;
		reload: () => void;
	}

	let vimeoPlayer: VimeoComponent;

	onMount(() => {
		isIntroFinished.set(true)
	});

	onNavigate(() => {
		isTransitioning = true;
		isNewsletterActive.set(false);

		setTimeout(() => {
			isTransitioning = false;
		}, 1050);
	});

	const togglePlayback = async () => {
		try {
			if (isPlaying) {
				await vimeoPlayer.pause();
			} else {
				await vimeoPlayer.play();
			}
		} catch (error) {
			console.error('Error toggling playback:', error);
		}
	};

	const handlePlayingChange = (event: CustomEvent) => {
		isPlaying = event.detail.isPlaying;
	};

	const handleVideoReady = async () => {
		isVideoLoaded = true;
		// await vimeoPlayer.play();
		// setTimeout(async () => {
		// 	await vimeoPlayer.pause();
		// 	isVideoDone = true;
		// 	isIntroFinished.set(true);
		// }, 6000);
	};
	
	let isVideoDone = true;
</script>

<svelte:head>
	<title>Gallery Sonder</title>
	<link rel="stylesheet" href="https://use.typekit.net/oqt1xky.css" />
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image.url} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>
<NewsletterSignup />

<main
	class={isVideoDone ? '' : 'w-screen h-screen'}
	style="overflow: {isVideoDone ? 'auto' : 'hidden'}"
>
	{#if !isVideoDone}
		<div class="w-screen h-screen fixed top-0 left-0 bg-black" transition:fade>
			{#if !isVideoLoaded}
				<div
					class="w-screen h-screen absolute top-0 left-0 bg-black flex items-center justify-center z-20"
					out:fade={{ delay: 200 }}
				>
					<img src={logo} class="h-16 pulse-always" alt="sonder" />
				</div>
			{/if}

			<div
				class="w-screen h-screen absolute top-0 left-0 z-10 transition-opacity duration-700 delay-700 ease-out {isVideoDone
					? 'opacity-0'
					: ''}"
			>
				<VimeoPlayer
					bind:this={vimeoPlayer}
					videoId="1032470650"
					muted={true}
					bind:isPlaying
					on:playingChange={handlePlayingChange}
					on:ready={handleVideoReady}
				/>
			</div>

			<div class="bg-black {isVideoDone ? 'opacity-0' : ''} w-full h-full absolute left-0 top-0" />
			<div
				class="bg-black {isVideoDone
					? 'opacity-20'
					: 'opacity-0'} w-full h-full z-10 absolute left-0 top-0 transition-opacity"
			/>
		</div>
	{/if}

	{#if isTransitioning}
		<div
			out:fade={{ duration: 600 }}
			class="w-screen h-screen fixed top-0 left-0 bg-black z-30"
		></div>
	{/if}

	{#if $isIntroFinished}
		{#if $isLightboxActive}
			<Lightbox />
		{/if}
		<Nav isLogoBlack={false} navProps={data.nav.data.links} />
		<slot />
	{/if}
	
</main>

<PrismicPreview {repositoryName} />

