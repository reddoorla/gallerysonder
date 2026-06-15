<script lang="ts">
	import { getAppState } from '$lib/contexts/appState.svelte';
	import { fade } from 'svelte/transition';
	import ContentWidth from './ContentWidth.svelte';
	import RotatingLogo from './RotatingLogo.svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import Slideshow from './Slideshow.svelte';
	import { populateHiddenForm, submitForm } from '$lib/utils/forms';
	import { trapFocus } from '$lib/utils/trapFocus';

	const appState = getAppState();

	// Lock body scroll while either lightbox overlay is open (mirrors closeModal,
	// which unlocks). Keyed on the same conditions that render the overlays below.
	$effect(() => {
		const open =
			(appState.isLightboxActive && appState.activeArtworkUid) ||
			(!appState.activeArtwork && appState.lightboxImageUrl);
		if (open) appState.lockBodyScroll();
	});

	let submitted = $state(false);
	let error = $state(false);

	let formName = $state('');
	let formPhone = $state('');
	let formEmail = $state('');
	let formMessage = $state('');
	let formRole = $state('');

	const triggerSubmitButton = async () => {
		const fieldValues: Record<string, string> = {
			name: formName,
			phone: formPhone,
			email: formEmail,
			message: formMessage,
			role: formRole
		};

		if (appState.activeArtwork) {
			fieldValues.piece = `${appState.activeArtwork.data.title}, ${appState.activeArtwork.data.year}`;
		}

		if (appState.activeArtist) {
			fieldValues.artist = appState.activeArtist.data.full_name as string;
		}

		const populated = populateHiddenForm('netlifyInquiryForm', fieldValues);

		if (populated) {
			const form = document.getElementById('netlifyInquiryForm') as HTMLFormElement;
			const result = await submitForm(form);

			submitted = true;
			error = !result.success;
		}
	};

	const closeModal = () => {
		appState.showInquiryForm = false;
		appState.isModalActive = false;
		appState.isLightboxActive = false;
		appState.lightboxImageUrl = '';
		appState.activeArtworkUid = '';
		appState.unlockBodyScroll();
	};
</script>

{#if appState.isLightboxActive && appState.activeArtworkUid}
	<div
		class="w-screen h-screen fixed top-0 left-0 flex justify-center items-start lg:items-center z-40 overflow-y-scroll md:overflow-hidden transition-colors duration-1000"
		style="background-color:{appState.backgroundColor}"
		transition:fade
		use:trapFocus={{ onEscape: closeModal }}
		role="dialog"
		aria-modal="true"
		aria-label="Artwork details"
		tabindex="-1"
	>
		<ContentWidth
			class="w-full absolute top-0 h-16 flex items-center justify-between px-[4%] xl:px-0 z-40"
		>
			<button class="h-6" onclick={closeModal} aria-label="Close modal">
				<i class="text-black fa-sharp fa-light fa-close fa-2xl hover:opacity-80 transition"></i>
			</button>
			<a href="/" class="" onclick={closeModal}
				><RotatingLogo class="h-6 hover:opacity-80 transition" /></a
			>
		</ContentWidth>
		<ContentWidth
			class="min-h-screen h-screen w-full relative flex flex-col lg:flex-row justify-center items-start lg:items-center gap-6 lg:gap-0 overflow-y-scroll lg:overflow-hidden"
		>
			{#if !appState.activeArtwork || !appState.activeArtwork.data}
				<div class="w-full h-full flex items-center justify-center">
					<i class="fa-regular fa-circle-notch fa-spin fa-2xl text-black/80"></i>
				</div>
			{:else}
				<div
					class="mt-20 md:mt-0 w-full lg:w-1/2 h-2/5 lg:h-4/5 relative flex items-center justify-center"
				>
					<div
						class="w-full {appState.activeArtwork.data.orientation === 'landscape'
							? 'aspect-4/3 '
							: appState.activeArtwork.data.orientation === 'portrait'
								? 'md:w-auto md:aspect-3/4 h-full'
								: 'max-w-full h-full max-h-full'}"
					>
						<i
							class="fa-regular fa-circle-notch fa-spin fa-2xl text-black/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
						></i>

						{#if appState.activeArtwork.data.secondary_images[0] && isFilled.image(appState.activeArtwork.data.secondary_images[0].image) && appState.activeArtwork.data.orientation !== 'fit'}
							<Slideshow />
						{:else}
							<PrismicImage
								class="{appState.activeArtwork.data.orientation === 'fit'
									? 'object-contain'
									: 'object-cover'} w-full h-full z-10 relative"
								field={appState.activeArtwork.data.primary_image}
							/>
						{/if}
					</div>
				</div>
				<div
					class="w-full lg:w-1/2 lg:h-4/5 lg:p-16 lg:pr-0 flex flex-col items-start justify-center gap-6"
				>
					{#if !appState.showInquiryForm}
						{#if appState.activeArtist}
							<a
								onclick={closeModal}
								class="cursor-pointer hover:opacity-80 transition uppercase no-underline"
								href="/artists/{appState.activeArtist.uid}"
								><h5><b>{appState.activeArtist.data.full_name}</b></h5></a
							>
						{/if}
						<div class="flex flex-col gap-1">
							{#if appState.activeArtwork.data.title}
								<p><i>{appState.activeArtwork.data.title}</i></p>
							{/if}
							{#if appState.activeArtwork.data.year}
								<p>{appState.activeArtwork.data.year}</p>
							{/if}
							{#if appState.activeArtwork.data.medium}
								<p>{appState.activeArtwork.data.medium}</p>
							{/if}
							{#if appState.activeArtwork.data.dimensions}
								<p>{appState.activeArtwork.data.dimensions}</p>
							{/if}
						</div>
						{#if isFilled.richText(appState.activeArtwork.data.body)}
							<div class="rich-text">
								<PrismicRichText field={appState.activeArtwork.data.body} />
							</div>
						{/if}
						{#if !appState.showInquiryForm}
							<button
								onclick={() => (appState.showInquiryForm = true)}
								class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer"
								>Inquire</button
							>
						{/if}
					{/if}
					{#if appState.showInquiryForm}
						{#if !submitted}
							<div in:fade={{ delay: 400 }} class="w-full flex flex-col mt-64 md:mt-20">
								<h2>Inquire</h2>
								<p class="mb-8 mt-4">Fill out the form below to learn more about this piece.</p>
								<p>Name</p>
								<input
									type="text"
									name="name"
									bind:value={formName}
									required
									placeholder="first and last name"
									class="w-full border-2 border-mid p-2 mb-4"
								/>

								<p>Phone</p>
								<input
									type="phone"
									name="phone"
									bind:value={formPhone}
									required
									placeholder="000-000-0000"
									class="w-full border-2 border-mid p-2 mb-4"
								/>

								<p>Email</p>
								<input
									type="email"
									name="email"
									bind:value={formEmail}
									required
									placeholder="you@domain.com"
									class="w-full border-2 border-mid p-2 mb-4"
								/>

								<p class="hidden">
									<label>
										Don’t fill this out if you’re human: <input name="bot-field" />
									</label>
								</p>

								<p>Message</p>
								<textarea
									name="message"
									bind:value={formMessage}
									required
									placeholder="how can we help?"
									class="min-h-24 w-full border-2 border-mid p-2 mb-4"
								></textarea>

								<p>What best describes you?</p>
								<div>
									<select
										name="role"
										id="role"
										class="border-2 border-mid p-2 mb-8 cursor-pointer"
										bind:value={formRole}
									>
										<option value="First Time Buyer">First Time Buyer</option>
										<option value="Occasional Buyer">Occasional Buyer</option>
										<option value="experienced">Experienced Collector</option>
										<option value="Art Advisor">Art Advisor</option>
										<option value="Curator">Curator</option>
										<option value="Art Enthusiast">Art Enthusiast</option>
									</select>
								</div>

								<LinkArrowButton class="uppercase" onclick={triggerSubmitButton} text="Submit" />

								<div class="text-xs mt-12 mb-24">
									By signing up, you agree to the Terms of Use and Privacy Policy to receive
									electronic communications from Gallery Sonder. You can unsubscribe or change your
									preferences at any time.
								</div>
							</div>
						{:else if error}
							<h2>
								We're sorry, there appears to be an error. Please email info@gallerysonder.com with
								your inquiry.
							</h2>
						{:else}
							<h2>Thank you for reaching out!</h2>
						{/if}
					{/if}
				</div>
			{/if}
		</ContentWidth>
	</div>
{/if}

{#if !appState.activeArtwork && appState.lightboxImageUrl}
	<div
		class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-90 flex justify-center items-center z-40"
		use:trapFocus={{ onEscape: closeModal }}
		role="dialog"
		aria-modal="true"
		aria-label="Enlarged image"
		tabindex="-1"
	>
		<button class="absolute w-full h-full" onclick={closeModal} aria-label="Close image"></button>
		<div
			class="w-11/12 h-11/12 max-h-11/12 max-w-11/12 lg:w-4/5 lg:h-4/5 lg:max-w-4/5 lg:max-h-4/5"
		>
			<img src={appState.lightboxImageUrl} alt="lightbox" class="w-full h-full object-contain" />
		</div>
	</div>
{/if}
