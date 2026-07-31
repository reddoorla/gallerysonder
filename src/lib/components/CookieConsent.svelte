<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import ContentWidth from './ContentWidth.svelte';
	import { fade } from 'svelte/transition';
	import { trapFocus } from '$lib/utils/trapFocus';

	const appState = getAppState();

	export const cookieConsent = writable(false);

	const GTM_ID = 'GTM-5FVCTMK7';

	let showModal = $state(false);
	let _hasConsented = $state(false);
	let gtmInjected = false;

	onMount(() => {
		const consent = localStorage.getItem('cookieConsent');
		if (consent !== null) {
			const accepted = consent === 'true';
			cookieConsent.set(accepted);
			_hasConsented = true;

			if (accepted) {
				loadAnalytics();
			}
		} else {
			// Lock together with the modal appearing — locking 3s early left the
			// page visibly interactive but unscrollable with nothing on screen.
			setTimeout(() => {
				appState.lockBodyScroll('cookie-consent');
				showModal = true;
			}, 3000);
		}
	});

	function initializeFacebookPixel() {
		if (!window.fbq) {
			const queue: unknown[][] = [];
			const fbqFn: NonNullable<Window['fbq']> = (...args: unknown[]) => {
				if (fbqFn.callMethod) {
					fbqFn.callMethod(...args);
				} else {
					fbqFn.queue.push(args);
				}
			};
			fbqFn.push = fbqFn;
			fbqFn.loaded = true;
			fbqFn.version = '2.0';
			fbqFn.queue = queue;
			window.fbq = fbqFn;
			if (!window._fbq) window._fbq = fbqFn;

			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://connect.facebook.net/en_US/fbevents.js';
			const firstScript = document.getElementsByTagName('script')[0];
			firstScript.parentNode?.insertBefore(script, firstScript);
		}

		window.fbq('init', '1547698656610293');
		window.fbq('track', 'PageView');
	}

	function initializeGoogleTagManager() {
		if (gtmInjected) return;
		gtmInjected = true;

		const w = window as Window & { dataLayer?: Record<string, unknown>[] };
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
		const firstScript = document.getElementsByTagName('script')[0];
		firstScript.parentNode?.insertBefore(script, firstScript);
	}

	// Both trackers are consent-gated: nothing loads until the visitor accepts.
	function loadAnalytics() {
		initializeGoogleTagManager();
		initializeFacebookPixel();
	}

	function acceptCookies() {
		saveConsent(true);
		loadAnalytics();
		showModal = false;
		appState.unlockBodyScroll('cookie-consent');
	}

	function rejectCookies() {
		saveConsent(false);
		showModal = false;
		appState.unlockBodyScroll('cookie-consent');
	}

	function saveConsent(accepted: boolean) {
		localStorage.setItem('cookieConsent', accepted.toString());
		localStorage.setItem('cookieConsentDate', new Date().toISOString());
		cookieConsent.set(accepted);
		_hasConsented = true;
	}
</script>

{#if showModal}
	<!-- No `onEscape`: this is a consent gate, not a dismissible overlay — the
	     visitor has to pick Accept or Reject. That is not a WCAG 2.1.2 keyboard
	     trap, because both buttons are reachable by Tab and activating either one
	     closes the modal. The trap itself matters because this appears on a timer
	     and can land on top of an already-open overlay (newsletter, nav, lightbox);
	     trapFocus only lets the topmost trap govern, so focus follows the gate. -->
	<div
		class="w-screen h-screen fixed top-0 left-0 z-50"
		transition:fade
		use:trapFocus
		role="dialog"
		aria-modal="true"
		aria-label="Cookie consent"
		tabindex="-1"
	>
		<div class="w-full h-full absolute top-0 left-0 blur-sm backdrop-blur-sm bg-black/40"></div>
		<ContentWidth class="relative z-10 flex justify-center md:justify-end h-full flex-col pb-5">
			<div
				class="z-20 relative flex flex-col items-start px-5 pt-10 w-full"
				style="background-color: {appState.backgroundColor}"
			>
				<p>We use cookies to track website usage and personalize content.</p>
				<p>Click 'Accept' to allow all cookies or 'Reject' to limit to necessaries.</p>
			</div>

			<div
				class="z-20 relative flex flex-row gap-3 px-5 pt-5 pb-10 w-full"
				style="background-color: {appState.backgroundColor}"
			>
				<button
					class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer"
					onclick={acceptCookies}
				>
					Accept
				</button>
				<button
					onclick={rejectCookies}
					class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer"
					>REJECT</button
				>
			</div>
		</ContentWidth>
	</div>
{/if}

{#if $cookieConsent}
	<noscript>
		<img
			height="1"
			width="1"
			style="display:none"
			src="https://www.facebook.com/tr?id=1547698656610293&ev=PageView&noscript=1"
			alt=""
		/>
	</noscript>
{/if}
