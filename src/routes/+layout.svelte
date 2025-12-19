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

	import { setAppState } from '$lib/contexts/appState.svelte';

	import { onNavigate } from '$app/navigation';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import Analytics from '$lib/components/Analytics.svelte';

	// Initialize app state context
	const appState = setAppState();


	export let data;
	let isTransitioning = false;
	let navDelayDone = false;

	// UTM parameters
	let currentUtmParams = {
		source: 'none',
		medium: 'none',
		campaign: 'none',
		term: 'none',
		content: 'none'
	};

	const areUtmParamsEmpty = () => {
		const u = appState.utmParams;
		return !(u.campaign||u.content||u.medium||u.medium||u.source||u.term)
	}



	onMount(() => {

		setTimeout(()=>navDelayDone=true, 500)

		// Extract UTM parameters from URL
		const urlParams = $page.url.searchParams;

		currentUtmParams = {
			source: urlParams.get('utm_source') || 'none',
			medium: urlParams.get('utm_medium') || 'none',
			campaign: urlParams.get('utm_campaign') || 'none',
			term: urlParams.get('utm_term') || 'none',
			content: urlParams.get('utm_content') || 'none'
		};

		if(areUtmParamsEmpty())
			appState.utmParams = currentUtmParams;

	});

	onNavigate(() => {
		isTransitioning = true;
		appState.isNewsletterActive = false;

		setTimeout(() => {
			isTransitioning = false;
		}, 1050);
	});

	
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

<CookieConsent />
<Analytics />




<main>


	{#if isTransitioning}
		<div
			out:fade={{ duration: 600 }}
			class="w-screen h-screen fixed top-0 left-0 bg-black z-30"
		></div>
	{/if}

	

		{#if !appState.isIntroRunning&&navDelayDone}
			<Nav isLogoBlack={false} navProps={data.nav.data.links} />
		{/if}
		<slot />



	
</main>



			<Lightbox />



<PrismicPreview {repositoryName} />

<form class="hidden"  name="contact" method="post" data-netlify="true" data-netlify-honeypot="bot-field" id="netlifyContactForm" >
	<input type="hidden" name="form-name" value="contact" />
	

	
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

		<!-- UTM Parameters -->
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />
	<button id="hiddenSubmitButton" type="submit" value="Connect" class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button>
</form>


<form class="hidden"  name="inquiry" method="post" data-netlify="true" data-netlify-honeypot="bot-field" id="netlifyInquiryForm" >
	<input type="hidden" name="form-name" value="inquiry" />
	
	<!-- UTM Parameters -->

	
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

	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />

	<button id="hiddenSubmitButton" type="submit" value="Connect" class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button>
</form>

<form class="hidden"  name="news" method="POST" id="netlifyNewsletterSignup" data-netlify="true" data-netlify-honeypot="bot-field" >
    <input type="hidden" name="form-name" value="news"  />
    <p class="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
    </p>
	<input name="name" type='text'/>
	<input type="email" name="email" />
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />

    <button type="submit" id="hiddenNewsSubmitButton" aria-label="Submit newsletter signup"></button>
</form>


<form class="hidden" name="rsvp" method="POST" id="netlifyRsvpForm" data-netlify="true" data-netlify-honeypot="bot-field">
	 <p class="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
	 </p>
	 <input type="hidden" name="form-name" value="rsvp" />
	<input name="name" type='text'/>
	<input type="email" name="email" />
	<input type="text" name="event" />
	<input name="guests" type="number" />
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />
	<button type="submit" id="hiddenRsvpSubmitButton" aria-label="Submit RSVP"></button>
</form>
	
