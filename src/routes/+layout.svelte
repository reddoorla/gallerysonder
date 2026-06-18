<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import '../app.css';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';

	import { setAppState } from '$lib/contexts/appState.svelte';

	import { onNavigate } from '$app/navigation';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';

	const appState = setAppState();
	const DISABLE_COOKIE_CONSENT = import.meta.env.VITE_DISABLE_COOKIE_CONSENT === 'true';

	let { data, children } = $props();

	let isTransitioning = $state(false);
	let navDelayDone = $state(false);

	// The Prismic editor toolbar (loaded by <PrismicPreview />) sets third-party
	// `io.prismic.previewSession` cookies that fail Lighthouse best-practices for
	// every visitor. Only mount it when a preview is actually active (the
	// `io.prismic.preview` cookie is set by /api/preview), so normal visitors and
	// the prerendered pages never load it. Editors still preview from the Prismic
	// dashboard, which sets the cookie before redirecting here.
	let isPreviewActive = $state(false);

	let currentUtmParams = {
		source: 'none',
		medium: 'none',
		campaign: 'none',
		term: 'none',
		content: 'none'
	};

	const areUtmParamsEmpty = () => {
		const u = appState.utmParams;
		return !(u.campaign || u.content || u.medium || u.medium || u.source || u.term);
	};

	onMount(() => {
		setTimeout(() => (navDelayDone = true), 500);

		isPreviewActive = document.cookie.includes('io.prismic.preview');

		const urlParams = $page.url.searchParams;

		currentUtmParams = {
			source: urlParams.get('utm_source') || 'none',
			medium: urlParams.get('utm_medium') || 'none',
			campaign: urlParams.get('utm_campaign') || 'none',
			term: urlParams.get('utm_term') || 'none',
			content: urlParams.get('utm_content') || 'none'
		};

		if (areUtmParamsEmpty()) appState.utmParams = currentUtmParams;
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
	<title>{$page.data.meta_title || 'Gallery Sonder'}</title>
	<!-- Typekit is loaded async (non-render-blocking) from app.html; do not add a
	     synchronous stylesheet link here or it re-introduces render-blocking. -->
	<meta
		name="description"
		content={$page.data.meta_description ||
			'Gallery Sonder is a contemporary art gallery presenting exhibitions, artists, and advisory services.'}
	/>
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>
<NewsletterSignup />

{#if !DISABLE_COOKIE_CONSENT}
	<CookieConsent />
{/if}

<main>
	{#if isTransitioning}
		<div
			out:fade={{ duration: 600 }}
			class="w-screen h-screen fixed top-0 left-0 bg-black z-30"
		></div>
	{/if}

	{#if navDelayDone}
		<Nav isLogoBlack={false} navProps={data.nav.data.links} />
	{/if}
	{@render children?.()}
</main>

<Lightbox />

{#if isPreviewActive}
	<PrismicPreview {repositoryName} />
{/if}

<form class="hidden" name="contact" method="post" id="netlifyContactForm">
	<input type="hidden" name="form-name" value="contact" />

	<p>Name</p>
	<input
		type="text"
		name="name"
		required
		placeholder="first and last name"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p>Company Name</p>
	<input
		type="text"
		name="company"
		placeholder="company name"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p>Phone</p>
	<input
		type="phone"
		name="phone"
		required
		placeholder="000-000-0000"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p>Email</p>
	<input
		type="email"
		name="email"
		required
		placeholder="you@domain.com"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p class="hidden">
		<label>
			Don't fill this out if you're human: <input name="bot-field" />
		</label>
	</p>
	<input type="date" name="appointment_date" />
	<select name="appointment_time">
		<option value=""></option>
		<option value="Morning">Morning</option>
		<option value="Afternoon">Afternoon</option>
		<option value="Evening">Evening</option>
	</select>
	<p>Message</p>
	<textarea
		name="message"
		required
		placeholder="how can we help?"
		class="min-h-24 w-full border-1 border-mid p-2 mb-4"
	></textarea>

	<!-- UTM Parameters -->
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />
	<button
		id="hiddenSubmitButton"
		type="submit"
		value="Connect"
		class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer"
		>Connect</button
	>
</form>

<form class="hidden" name="inquiry" method="post" id="netlifyInquiryForm">
	<input type="hidden" name="form-name" value="inquiry" />

	<p>Name</p>
	<input
		type="text"
		name="name"
		required
		placeholder="first and last name"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p>Phone</p>
	<input
		type="phone"
		name="phone"
		required
		placeholder="000-000-0000"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p>Email</p>
	<input
		type="email"
		name="email"
		required
		placeholder="you@domain.com"
		class="w-full border-1 border-mid p-2 mb-4"
	/>
	<p class="hidden">
		<label>
			Don't fill this out if you're human: <input name="bot-field" />
		</label>
	</p>
	<p>Message</p>
	<textarea
		name="message"
		required
		placeholder="how can we help?"
		class="min-h-24 w-full border-1 border-mid p-2 mb-4"
	></textarea>

	<input name="piece" type="text" />
	<input name="artist" type="text" />
	<input name="role" type="text" />

	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />

	<button
		id="hiddenSubmitButton"
		type="submit"
		value="Connect"
		class="bump text-primary border-b-2 hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer"
		>Connect</button
	>
</form>

<form class="hidden" name="news" method="POST" id="netlifyNewsletterSignup">
	<input type="hidden" name="form-name" value="news" />
	<p class="hidden">
		<label>
			Don’t fill this out if you’re human: <input name="bot-field" />
		</label>
	</p>
	<input name="name" type="text" />
	<input type="email" name="email" />
	<input type="hidden" name="utm_source" value={currentUtmParams.source} />
	<input type="hidden" name="utm_medium" value={currentUtmParams.medium} />
	<input type="hidden" name="utm_campaign" value={currentUtmParams.campaign} />
	<input type="hidden" name="utm_term" value={currentUtmParams.term} />
	<input type="hidden" name="utm_content" value={currentUtmParams.content} />

	<button type="submit" id="hiddenNewsSubmitButton" aria-label="Submit newsletter signup"></button>
</form>

<form class="hidden" name="rsvp" method="POST" id="netlifyRsvpForm">
	<p class="hidden">
		<label>
			Don’t fill this out if you’re human: <input name="bot-field" />
		</label>
	</p>
	<input type="hidden" name="form-name" value="rsvp" />
	<input name="name" type="text" />
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
