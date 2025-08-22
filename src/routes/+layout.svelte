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
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import Analytics from '$lib/components/Analytics.svelte';
	import { utmParams } from '$lib/stores/analyticsData.js';

	export let data;
	const USE_INTRO = import.meta.env.VITE_USE_INTRO&&import.meta.env.VITE_USE_INTRO!=='false';
	let isVideoLoaded = !USE_INTRO;
	let isPlaying = !USE_INTRO;
	let isTransitioning = false;

	// UTM parameters
	let currentUtmParams = {
		source: 'none',
		medium: 'none',
		campaign: 'none',
		term: 'none',
		content: 'none'
	};

	interface VimeoComponent {
		play: () => Promise<void>;
		pause: () => Promise<void>;
		reload: () => void;
	}

	let vimeoPlayer: VimeoComponent;

	onMount(() => {
		if(!USE_INTRO)
			isIntroFinished.set(true);

		// Extract UTM parameters from URL
		const urlParams = $page.url.searchParams;
		currentUtmParams = {
			source: urlParams.get('utm_source') || 'none',
			medium: urlParams.get('utm_medium') || 'none',
			campaign: urlParams.get('utm_campaign') || 'none',
			term: urlParams.get('utm_term') || 'none',
			content: urlParams.get('utm_content') || 'none'
		};

		// Update the store
		utmParams.set(currentUtmParams);
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
		
			
			await vimeoPlayer.play();
			isVideoLoaded = true;
			setTimeout(async () => {
				await vimeoPlayer.pause();
				isVideoDone = true;
				isIntroFinished.set(true);
			}, 6000);

		

	};

	
	let isVideoDone = !USE_INTRO;
</script>

<style>
	.clip-by-logo{
        clip-path: url(#sonderClipPath);
    }

    .gradient-logo{
		background: radial-gradient(86.17% 86.17% at 9.64% 0%, #000 0%, #222020 48.5%, #565454 100%);
	    background-size: 400% 400%;
	    animation: gradient 5s ease infinite;
    }

	.loading-text{
		color: #727272;
		text-align: center;
		font-feature-settings: 'liga' off, 'clig' off;
		font-family: "commuters-sans";
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: 150%; /* 27px */
	}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>

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
<CookieConsent />
<Analytics />

<svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg">
	<clipPath id="sonderClipPath">
		<path d="M302.026 13.1236V18.7285H321.051V29.3915H302.026V34.9964H325.493V47.2998H225.973V0.820227H325.493V13.1236H302.026ZM0 41.8316L4.78466 30.8269C9.91108 34.4495 16.4045 36.2951 23.9916 36.2951C29.3231 36.2951 31.7155 35.4065 31.7155 33.4243C31.7155 31.6471 30.4851 31.1686 23.3765 30.4851C7.10864 28.913 2.11892 25.222 2.11892 15.2426C2.11892 5.26312 10.2528 0 24.1967 0C32.4673 0 39.6443 1.91386 45.1125 5.53653L40.3962 16.0628C36.2267 13.2603 31.1686 11.8249 25.4954 11.8249C19.8222 11.8249 17.7032 12.7135 17.7032 14.7641C17.7032 16.5413 18.8652 17.0197 25.9055 17.7032C42.1734 19.2753 47.2998 22.9664 47.2998 32.9458C47.2998 42.9252 39.576 48.12 24.5385 48.12C14.2856 48.12 5.67324 45.9327 0 41.8316ZM52.973 24.06C52.973 9.36426 63.0208 0 78.8102 0C94.5995 0 104.647 9.36426 104.647 24.06C104.647 38.7557 94.5995 48.12 78.8102 48.12C63.0208 48.12 52.973 38.7557 52.973 24.06ZM88.9263 24.06C88.9263 17.4982 84.9619 13.2603 78.8102 13.2603C72.6585 13.2603 68.694 17.4982 68.694 24.06C68.694 30.6218 72.6585 34.8597 78.8102 34.8597C84.9619 34.8597 88.9263 30.6218 88.9263 24.06ZM160.149 0.820227V47.2998H146.137L127.682 20.9158V47.2998H112.986V0.820227H130.006L145.454 22.9664V0.820227H160.149ZM217.839 24.06C217.839 38.4823 208.611 47.2998 193.505 47.2998H170.881V0.820227H193.505C208.611 0.820227 217.839 9.63767 217.839 24.06ZM202.118 24.06C202.118 17.2931 198.632 13.8072 191.865 13.8072H186.328V34.3128H191.865C198.632 34.3128 202.118 30.8269 202.118 24.06ZM364.523 47.2998L354.953 32.2623H349.622V47.2998H334.174V0.820227H361.857C373.819 0.820227 379.97 6.1517 379.97 16.5413C379.97 23.5815 377.099 28.3662 371.563 30.6218L382.226 47.2998H364.523ZM349.622 20.0956H359.533C362.814 20.0956 364.249 19.0019 364.249 16.5413C364.249 14.0806 362.814 12.9869 359.533 12.9869H349.622V20.0956Z" fill="#231F20"/>
   </clipPath>
</svg>


<main
	class={isVideoDone ? '' : 'w-screen h-screen'}
	style="overflow: {isVideoDone ? 'auto' : 'hidden'}"
>

		<div class="w-screen h-screen fixed top-0 left-0 bg-black -z-10" transition:fade>
			{#if !isVideoLoaded}
			<div
			class="w-screen h-screen absolute top-0 left-0 bg-black flex flex-col items-center text-center justify-center gap-10 z-20"
			
		>

				<div class="loading-text">Loading Your</div>
				<div class="h-12 w-[382px] gradient-logo clip-by-logo"/>
				<div class="loading-text">Experience</div>
				<!-- <div class="gradient-logo w-screen h-screen fixed top-0 left-0"/> -->
				   
	
		
		</div>
			{/if}

			<div
				class="w-screen h-screen absolute top-0 left-0 -z-10 transition-opacity" transition:fade={{duration:200}}
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

			<div class="bg-black {isVideoDone ? 'opacity-0' : ''} w-full h-full absolute left-0 -z-20 top-0" />
			<div
				class="bg-black {isVideoDone
					? 'opacity-20'
					: 'opacity-0'} w-full h-full absolute left-0 top-0 transition-opacity duration-1000"
			/>
		</div>


	{#if isTransitioning}
		<div
			out:fade={{ duration: 600 }}
			class="w-screen h-screen fixed top-0 left-0 bg-black z-30"
		></div>
	{/if}

	{#if $isIntroFinished && isVideoDone}

	<div transition:fade>
	
		<Nav isLogoBlack={false} navProps={data.nav.data.links} />
		<slot />
	</div>
	{/if}
	
</main>

		{#if $isLightboxActive}
		
			<Lightbox />
		
		{/if}

<PrismicPreview {repositoryName} />


<form class="hidden" name="contact" method="post" data-netlify="true" data-netlify-honeypot="bot-field" id="netlifyContactForm">
	<input type="hidden" name="form-name" value="contact" />
	
	<!-- UTM Parameters -->
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />
	
	<p>Name</p>
	<input type="text" name="name" required placeholder="first and last name" class="w-full border-1 border-mid p-2 mb-4" />
	<p>Company Name</p>
	<input type="text" name="company" placeholder="company name" class="w-full border-1 border-mid p-2 mb-4" />
	<p>Phone</p>
	<input type="phone" name="phone" required placeholder="000-000-0000" class="w-full border-1 border-mid p-2 mb-4" />
	<p>Email</p>
	<input type="email" name="email" required placeholder="you@domain.com" class="w-full border-1 border-mid p-2 mb-4" />
	<p class="hidden">
	  <label>
		Don't fill this out if you're human: <input name="bot-field" />
	  </label>
	</p>
	<p>Message</p>
	<textarea name="message" required placeholder="how can we help?" class="min-h-24 w-full border-1 border-mid p-2 mb-4"></textarea>
	<button id="hiddenSubmitButton" type="submit" value="Connect" class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button>
</form>


<form class="hidden" name="inquiry" method="post" data-netlify="true" data-netlify-honeypot="bot-field" id="netlifyInquiryForm">
	<input type="hidden" name="form-name" value="inquiry" />
	
	<!-- UTM Parameters -->
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />
	
	<p>Name</p>
	<input type="text" name="name" required placeholder="first and last name" class="w-full border-1 border-mid p-2 mb-4" />
	<p>Phone</p>
	<input type="phone" name="phone" required placeholder="000-000-0000" class="w-full border-1 border-mid p-2 mb-4" />
	<p>Email</p>
	<input type="email" name="email" required placeholder="you@domain.com" class="w-full border-1 border-mid p-2 mb-4" />
	<p class="hidden">
	  <label>
		Don't fill this out if you're human: <input name="bot-field" />
	  </label>
	</p>
	<p>Message</p>
	<textarea name="message" required placeholder="how can we help?" class="min-h-24 w-full border-1 border-mid p-2 mb-4"></textarea>

	<input name="piece" type="text"/>
	<input name="artist" type="text"/>
	<input name="role" type="text" />

	<button id="hiddenSubmitButton" type="submit" value="Connect" class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button>
</form>