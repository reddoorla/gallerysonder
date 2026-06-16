<script lang="ts">
	import { getAppState } from '$lib/contexts/appState.svelte';
	import ContentWidth from './ContentWidth.svelte';
	import { fade } from 'svelte/transition';
	import RotatingLogo from './RotatingLogo.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import { onMount } from 'svelte';
	import { populateHiddenForm, submitForm } from '$lib/utils/forms';

	const appState = getAppState();

	let submitted = $state(false);
	let submitting = $state(false);
	let error = $state(false);

	$effect(function manageScrollLockForNewsletter() {
		if (appState.isNewsletterActive) {
			appState.lockBodyScroll();
			disableScroll();
		} else {
			appState.unlockBodyScroll();
			enableScroll();
		}
	});

	let emailValue = $state('');

	let lowestPoint = 0;

	const enableScroll = () => {
		if (window) {
			window.onscroll = function () {};
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

	const triggerSubmitButton = async () => {
		if (submitting) return;
		submitting = true;
		try {
			if (populateHiddenForm('netlifyNewsletterSignup', { email: emailValue })) {
				const form = document.getElementById('netlifyNewsletterSignup') as HTMLFormElement;
				const result = await submitForm(form);

				submitted = true;
				error = !result.success;
				appState.hasNewsletterBeenCleared = true;
			}
		} finally {
			submitting = false;
		}
	};
</script>

{#if appState.isNewsletterActive}
	<div class="w-screen h-screen fixed top-0 left-0 z-40 backdrop-blur" transition:fade>
		<div
			class="w-full h-full absolute top-0 left-0 opacity-95 transition-colors duration-1000"
			style="background-color:{appState.backgroundColor}"
		></div>
		<ContentWidth class="h-full relative flex flex-col items-start justify-center gap-10">
			<button
				onclick={() => {
					appState.isNewsletterActive = false;
					appState.hasNewsletterBeenCleared = true;
				}}
				class="absolute top-12 left-0 hover:opacity-80"
				aria-label="Close newsletter signup"
				><i class="text-black fa-sharp fa-light fa-close fa-2xl hover:opacity-80 transition"
				></i></button
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
					<input
						type="email"
						bind:value={emailValue}
						name="email"
						placeholder="Enter Your Email"
						class="h-12 pl-2"
					/>
					<LinkArrowButton
						class="mt-6"
						text="Subscribe"
						onclick={triggerSubmitButton}
						disabled={submitting}
					/>
				</div>
				<p class="text-xs mt-24">
					By signing up, you agree to the Terms of Use and Privacy Policy to receive electronic <br
					/> communications from Gallery Sonder. You can unsubscribe or change your preferences at any
					time.
				</p>
			{:else if error}
				<h2 transition:fade>
					We're sorry, there appears to be an error. Please email info@gallerysonder.com with your
					inquiry.
				</h2>
			{:else}
				<h2>Thank you for joining our email list</h2>
			{/if}
		</ContentWidth>
	</div>
{/if}
