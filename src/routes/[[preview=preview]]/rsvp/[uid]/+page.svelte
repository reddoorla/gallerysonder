<script lang="ts">
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import { populateHiddenForm, submitForm } from '$lib/utils/forms';

	const appState = getAppState();

	let submitted = $state(false);
	let submitting = $state(false);
	let error = $state(false);

	let formName = $state('');
	let formEmail = $state('');
	let formGuests = $state('');

	let { data } = $props();

	function toTitleCase(str: string) {
		return str.replace(
			/\w\S*/g,
			(text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
		);
	}

	const triggerSubmitButton = async () => {
		if (submitting) return;
		submitting = true;
		try {
			const populated = populateHiddenForm('netlifyRsvpForm', {
				name: formName,
				email: formEmail,
				guests: formGuests,
				event: (data.page.data.name as string) || data.page.uid
			});

			if (populated) {
				const form = document.getElementById('netlifyRsvpForm') as HTMLFormElement;
				const result = await submitForm(form);

				submitted = true;
				error = !result.success;
			}
		} finally {
			submitting = false;
		}
	};

	onMount(() => {
		appState.hasNewsletterBeenCleared = true;
	});
</script>

<section class="w-screen min-h-lvh h-full flex bg-black text-white relative">
	<ContentWidth
		class="h-full flex flex-col md:flex-row items-start justify-start py-16 md:py-24 relative w-full"
	>
		<div class="w-full md:w-1/2 flex flex-col items-start justify-start">
			<div class="text-white ml-0.5">{data.page.data.dates || ''}</div>
			<h2 class="text-white">{data.page.data.name || toTitleCase(data.page.uid)}</h2>

			<PrismicImage
				field={data.page.data.image}
				class="w-full md:w-4/5 mt-4 rounded-sm h-full max-h-[50vh] object-cover"
			/>

			<div class="text-white mt-4 md:mt-12">
				<PrismicRichText field={data.page.data.body_text} />
			</div>
		</div>
		<div class="w-full md:w-1/2 flex flex-col gap-2 items-start mt-12 md:mt-0">
			{#if !submitted}
				<p class="text-white">Name</p>
				<input
					type="text"
					name="name"
					bind:value={formName}
					required
					placeholder="First and Last Name"
					class="w-full max-w-md border-1 border-white p-2 mb-4"
				/>

				<p class="text-white">Email</p>
				<input
					type="email"
					name="email"
					bind:value={formEmail}
					required
					placeholder="you@domain.com"
					class="w-full max-w-md border-1 border-white p-2 mb-4"
				/>

				<p class="text-white">Number of Guests</p>
				<input
					type="number"
					name="guests"
					bind:value={formGuests}
					required
					placeholder="1"
					min="1"
					class="w-full max-w-xs border-1 border-white p-2 mb-4"
				/>

				<button
					type="submit"
					onclick={triggerSubmitButton}
					disabled={submitting}
					class="text-black border-b-2 bg-white hover:bg-gray-200 p-3 font-bold border-black cursor-pointer"
				>
					Submit RSVP
				</button>
				<div class="text-white absolute bottom-0 left-0">
					By clicking submit you agree to receive emails under the terms of our privacy policy.
				</div>
			{:else if error}
				<h4 class="text-white">
					We're sorry, there appears to be an error. Please email info@gallerysonder.com with your
					RSVP.
				</h4>
			{:else}
				<h4 class="text-white">Thank you for your RSVP!</h4>
			{/if}
		</div>
	</ContentWidth>
</section>

<style>
	input {
		background-color: rgba(255, 255, 255, 0.4);
		border-radius: 2px;
	}
</style>
