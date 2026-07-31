<script lang="ts">
	import { getAppState } from '$lib/contexts/appState.svelte';
	import ContentWidth from './ContentWidth.svelte';
	import { fade } from 'svelte/transition';
	import RotatingLogo from './RotatingLogo.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import { onMount, untrack } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { populateHiddenForm, submitForm } from '$lib/utils/forms';
	import TurnstileWidget from '$lib/components/TurnstileWidget.svelte';
	import { trapFocus } from '$lib/utils/trapFocus';
	import { X } from '@lucide/svelte';

	const appState = getAppState();

	let submitted = $state(false);
	let submitting = $state(false);
	let error = $state(false);
	let validationError = $state('');

	// The visible field lives outside any <form> (the real one is the hidden
	// Netlify form in +layout.svelte), so `type="email"` and `required` never run
	// native constraint validation — nothing ever submits a form owner. Validate
	// in JS instead. Slightly stricter than the HTML5 email grammar, which accepts
	// dotless hosts like `a@b`: a newsletter address always has a dotted domain.
	const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	$effect(function manageScrollLockForNewsletter() {
		if (appState.isNewsletterActive) {
			appState.lockBodyScroll('newsletter');
			disableScroll();
		} else {
			appState.unlockBodyScroll('newsletter');
			enableScroll();
		}
	});

	$effect(function resetFormEachTimeTheOverlayOpens() {
		if (!appState.isNewsletterActive) return;
		// A stale error, validation message or typed address from an earlier visit
		// must not greet the next one. Untracked so writing this state can't
		// re-trigger the effect.
		untrack(() => {
			submitted = false;
			error = false;
			validationError = '';
			emailValue = '';
			// Also drop any in-flight request: closing mid-submit and reopening used
			// to show a blank field with a disabled button, and then the abandoned
			// response landed in the new session as an unprompted "Thank you" or
			// error. Bumping the generation makes that continuation a no-op.
			submitting = false;
			submitGeneration += 1;
		});
	});

	let emailValue = $state('');
	let turnstileToken = $state('');
	let emailInput = $state<HTMLInputElement>();
	// Incremented whenever the overlay is reopened, so a submit that was in flight
	// at that moment can tell its result is no longer wanted.
	let submitGeneration = 0;

	let lowestPoint = 0;

	const enableScroll = () => {
		if (window) {
			window.onscroll = null;
		}
	};

	const disableScroll = () => {
		if (window) {
			const x = window.scrollX;
			const y = window.scrollY;
			window.onscroll = function () {
				window.scrollTo(x, y);
			};
		}
	};

	// Where focus should go when the overlay closes, for the one case trapFocus
	// cannot handle itself: the nav menu's CTA unmounts along with the menu, so
	// the node trapFocus captured is detached by close time and focus is dropped
	// on <body>. `null` means "trapFocus's own captured element is fine" — which
	// it is for the footer and TitleBlock CTAs, both still mounted.
	let restoreTarget: HTMLElement | null = null;

	$effect(function captureRestoreTargetOnOpen() {
		if (!appState.isNewsletterActive) return;
		untrack(() => {
			const active = document.activeElement;
			// Anything inside the menu is doomed — it unmounts with the menu (which
			// is still present here, mid slide-outro). Fall back to the always-mounted
			// hamburger only in that case, so the other entry points keep their own
			// correct restore. Detecting it here rather than racing frames after
			// close: an earlier attempt sampled focus two rAFs post-close and both
			// lost to Chromium's inert-blur AND stole the footer path's restore.
			restoreTarget =
				active instanceof HTMLElement && active.closest('#main-nav')
					? document.querySelector<HTMLElement>('[aria-label="Toggle navigation menu"]')
					: null;
		});
	});

	const closeNewsletter = () => {
		appState.isNewsletterActive = false;
		appState.hasNewsletterBeenCleared = true;
	};

	const checkPosition = () => {
		if (
			typeof window !== 'undefined' &&
			typeof document !== 'undefined' &&
			!appState.hasNewsletterBeenCleared
		) {
			const maxScroll =
				document.documentElement.scrollHeight - document.documentElement.clientHeight;
			if (window.scrollY > lowestPoint) lowestPoint = window.scrollY;
			if (
				lowestPoint / maxScroll > 0.8 &&
				window.scrollY / maxScroll < 0.5 &&
				!appState.hasNewsletterBeenCleared
			)
				appState.isNewsletterActive = true;
		}
	};

	onMount(() => {
		window.addEventListener('scroll', checkPosition);
		return () => window.removeEventListener('scroll', checkPosition);
	});

	// The high-water mark is per-page. This component lives in the root layout and
	// never unmounts, so without this reset a deep scroll on one page carried over
	// and the overlay sprang open on the next page the instant SvelteKit scrolled
	// to top — before the visitor had scrolled at all.
	afterNavigate(() => {
		lowestPoint = 0;
	});

	const triggerSubmitButton = async () => {
		if (submitting) return;

		// Clear the previous attempt's server error BEFORE the validation guard:
		// returning early with it still set rendered two contradictory role="alert"
		// regions at once — a fresh validation message next to a stale "there
		// appears to be an error" banner for a request that was never sent.
		error = false;

		const email = emailValue.trim();
		if (!EMAIL_PATTERN.test(email)) {
			validationError = email
				? 'Please enter a valid email address.'
				: 'Please enter your email address.';
			emailInput?.focus();
			return;
		}

		validationError = '';
		submitting = true;
		const generation = submitGeneration;
		try {
			if (!populateHiddenForm('netlifyNewsletterSignup', { email })) {
				// Hidden form missing from the DOM — surface it rather than leaving the
				// visitor with a button that silently does nothing.
				error = true;
				return;
			}
			const form = document.getElementById('netlifyNewsletterSignup') as HTMLFormElement;
			const result = await submitForm(form, turnstileToken);

			// The visitor closed and reopened the overlay while this was in flight —
			// that is a new session, so this result must not touch its state.
			if (generation !== submitGeneration) return;

			if (result.success) {
				submitted = true;
				appState.hasNewsletterBeenCleared = true;
			} else {
				// Keep the form mounted so the visitor can retry. Marking this
				// `submitted` used to replace the form with a dead-end error screen
				// that survived closing and re-opening the overlay for the whole
				// session, because this component never unmounts.
				error = true;
			}
		} finally {
			// Only if this is still the current attempt — an abandoned one must not
			// re-enable the button underneath a submit the visitor has since started.
			if (generation === submitGeneration) submitting = false;
		}
	};
</script>

{#if appState.isNewsletterActive}
	<div
		class="w-screen h-screen fixed top-0 left-0 z-40 backdrop-blur"
		transition:fade
		use:trapFocus={{ onEscape: closeNewsletter, restoreFocus: () => restoreTarget }}
		role="dialog"
		aria-modal="true"
		aria-label="Newsletter signup"
		tabindex="-1"
	>
		<div
			class="w-full h-full absolute top-0 left-0 opacity-95 transition-colors duration-1000"
			style="background-color:{appState.backgroundColor}"
		></div>
		<ContentWidth class="h-full relative flex flex-col items-start justify-center gap-10">
			<button
				onclick={closeNewsletter}
				class="absolute top-12 left-0 hover:opacity-80"
				aria-label="Close newsletter signup"
				><X class="size-[2em] text-black hover:opacity-80 transition" strokeWidth={1.5} /></button
			>
			<a href="/" class="absolute top-5 right-0 hover:opacity-80"><RotatingLogo class="h-6" /></a>
			{#if !submitted}
				<div>
					<h2>Join Our Community</h2>
					<p>
						Sign up for our newsletter to receive updates <br /> on exhibitions, artists, and community
						events.
					</p>
				</div>
				<div>
					<label for="newsletter-email" class="sr-only">Email address</label>
					<input
						id="newsletter-email"
						type="email"
						required
						data-autofocus
						bind:this={emailInput}
						bind:value={emailValue}
						oninput={() => (validationError = '')}
						aria-invalid={validationError ? 'true' : undefined}
						aria-describedby={validationError ? 'newsletter-email-error' : undefined}
						name="email"
						placeholder="Enter Your Email"
						class="h-12 pl-2"
					/>
					{#if validationError}
						<p id="newsletter-email-error" class="text-xs mt-2" role="alert">{validationError}</p>
					{/if}
					<TurnstileWidget onToken={(t) => (turnstileToken = t)} />
					<LinkArrowButton
						class="mt-6"
						text="Subscribe"
						onclick={triggerSubmitButton}
						disabled={submitting}
					/>
					{#if error}
						<p class="text-xs mt-4" role="alert">
							We're sorry, there appears to be an error. Please try again, or email <a
								href="mailto:info@gallerysonder.com"
								class="underline">info@gallerysonder.com</a
							>.
						</p>
					{/if}
				</div>
				<p class="text-xs mt-24">
					By signing up, you agree to the Terms of Use and Privacy Policy to receive electronic <br
					/> communications from Gallery Sonder. You can unsubscribe or change your preferences at any
					time.
				</p>
			{:else}
				<h2 role="status">Thank you for joining our email list</h2>
			{/if}
		</ContentWidth>
	</div>
{/if}
