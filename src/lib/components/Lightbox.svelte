<script lang="ts">
	import {
		isLightboxActive,
		showInquiryForm,
		lightboxImageUrl,
		activeArtworkUid,
		activeArtwork,
		activeArtist
	} from '$lib/stores/lightbox';
	import { isModalActive } from '$lib/stores/isModalActive';
	import { fade } from 'svelte/transition';
	import { backgroundColor } from '$lib/stores/backgroundColor';
	import ContentWidth from './ContentWidth.svelte';
	import RotatingLogo from './RotatingLogo.svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { isFilled } from '@prismicio/client';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import Slideshow from './Slideshow.svelte';

	let viewportWidth: number;
	let submitted=false;
	let error = false;

	let formName: string;
	let formCompany: string;
	let formPhone: string;
	let formEmail: string;
	let formMessage: string;
	let formRole:string;

	const submitForm = async (formElement:HTMLFormElement) => {
  const formData = new FormData(formElement);
  

 
    const response = await fetch("/", { 
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //@ts-ignore
      body: new URLSearchParams(formData).toString()
    });

	submitted = true;

	if (response.status !== 200)
		error = true;

}

	const triggerSubmitButton = () => {
		const hiddenForm = document.getElementById('netlifyInquiryForm') as HTMLFormElement;

		if (hiddenForm) {
			const hiddenName = hiddenForm.querySelector('[name="name"]') as HTMLInputElement;
			const hiddenPhone = hiddenForm.querySelector('[name="phone"]') as HTMLInputElement;
			const hiddenEmail = hiddenForm.querySelector('[name="email"]') as HTMLInputElement;
			const hiddenMessage = hiddenForm.querySelector('[name="message"]') as HTMLTextAreaElement;
			const hiddenPiece = hiddenForm.querySelector('[name="piece"]') as HTMLInputElement;
			const hiddenArtist = hiddenForm.querySelector('[name="artist"]') as HTMLInputElement;
			const hiddenRole = hiddenForm.querySelector('[name="role"]') as HTMLInputElement;

			if (hiddenName) hiddenName.value = formName;

			if (hiddenPhone) hiddenPhone.value = formPhone;
			if (hiddenEmail) hiddenEmail.value = formEmail;
			if (hiddenMessage) hiddenMessage.value = formMessage;
			if (hiddenPiece&&$activeArtwork) hiddenPiece.value = $activeArtwork.data.title as string+ ", " +$activeArtwork.data.year;
			if (hiddenArtist&&$activeArtist) hiddenArtist.value = $activeArtist.data.full_name as string ;
			if (hiddenRole) hiddenRole.value = formRole;

			submitForm(hiddenForm);
			console.log('submitted inquiry');
		}
	};

	const closeModal = () => {
		showInquiryForm.set(false);
		isModalActive.set(false);
		isLightboxActive.set(false);
		lightboxImageUrl.set('');
		activeArtworkUid.set('');
		if (document.getElementsByTagName('body'))
			(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'auto';
	};
</script>

<svelte:window bind:innerHeight={viewportWidth} />



	{#if $activeArtwork}
		<div
			class="w-screen h-screen fixed top-0 left-0 flex justify-center items-start lg:items-center z-40 overflow-y-scroll md:overflow-hidden"
			style="background-color:{$backgroundColor}"
			transition:fade
		>
			<ContentWidth class="w-full fixed top-0 h-16 flex items-center justify-between px-4 md:px-0 z-40">
					<button class="h-6 bump" on:click={closeModal}
						><i
							class="text-black fa-sharp fa-solid fa-close fa-2xl hover:opacity-80 transition"
						/></button
					>
					<a href="/" class="bump" on:click={closeModal}
						><RotatingLogo class="h-6 hover:opacity-80 transition" /></a
					>
				</ContentWidth>
			<ContentWidth
				class="min-h-screen h-screen w-full relative flex flex-col lg:flex-row justify-center items-start lg:items-center gap-6 lg:gap-0 overflow-y-scroll lg:overflow-hidden"
			>
			
				<div
					class="mt-20 md:mt-0 w-full lg:w-1/2 h-2/5 lg:h-4/5 relative flex items-center justify-center"
				>
					<div
						class="w-full {$activeArtwork.data.orientation === 'landscape'
							? 'aspect-[4/3] '
							: $activeArtwork.data.orientation === 'portrait'
								? 'md:w-auto md:aspect-[3/4] h-full'
								: 'max-w-full h-full max-h-full'}"
					>
					<i class='fa-regular fa-circle-notch fa-spin fa-2xl text-black/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0' />
					
						{#if $activeArtwork.data.secondary_images[0] && isFilled.image($activeArtwork.data.secondary_images[0].image) && $activeArtwork.data.orientation !== 'fit'}
							 <Slideshow /> 
						{:else}
							<PrismicImage
								class="{$activeArtwork.data.orientation === 'fit'
									? 'object-contain'
									: 'object-cover'} w-full h-full z-10 relative"
								field={$activeArtwork.data.primary_image}
							/>
						{/if}
					</div>
				</div>
				<div
					class="w-full lg:w-1/2 lg:h-4/5 lg:p-16 lg:pr-0 flex flex-col items-start justify-center gap-6"
				>
				{#if !$showInquiryForm}
					{#if $activeArtist}
						<a
							on:click={closeModal}
							class="cursor-pointer hover:opacity-80 transition uppercase no-underline"
							href="/artists/{$activeArtist.uid}"><h5><b>{$activeArtist.data.full_name}</b></h5></a
						>
					{/if}
					<div class="flex flex-col gap-1">
						{#if $activeArtist}
							<p><i>{$activeArtwork.data.title}</i></p>
						{/if}
						{#if $activeArtwork.data.year}
							<p>{$activeArtwork.data.year}</p>
						{/if}
						{#if $activeArtwork.data.medium}
							<p>{$activeArtwork.data.medium}</p>
						{/if}
						{#if $activeArtwork.data.dimensions}
							<p>{$activeArtwork.data.dimensions}</p>
						{/if}
					</div>
					{#if isFilled.richText($activeArtwork.data.body)}
						<div class="rich-text"><PrismicRichText field={$activeArtwork.data.body} /></div>
					{/if}
					{#if !$showInquiryForm}
					<button
						on:click={() => showInquiryForm.set(true)}
						class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer"
						>Inquire</button
					>
					{/if}
					{/if}
				{#if $showInquiryForm}
					
				{#if !submitted}
				<div in:fade={{delay:400}} class='w-full flex flex-col mt-64 md:mt-20'>
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
				/>

				<p>What best describes you?</p>
				<div>
					<select name="role" id="role" class='bg-white border-2 border-mid p-2 mb-8 cursor-pointer' bind:value={formRole}>
						<option value="First Time Buyer">First Time Buyer</option>
						<option value="Occasional Buyer">Occasional Buyer</option>
						<option value="experienced">Experienced Collector</option>
						<option value="Experienced Collector">Art Advisor</option>
						<option value="Curator">Curator</option>
						<option value="Art Enthusiast">Art Enthusiast</option>
					</select>
				</div>
					
				<LinkArrowButton
					class="uppercase"
					click={triggerSubmitButton}
					text="Submit"
					/>
				

					<p class="text-xs mt-12 w-2/3 mb-24">By signing up, you agree to the Terms of Use and Privacy Policy to receive electronic
communications from Gallery Sonder. You can unsubscribe or change your preferences at any time.</p>
				
				</div>
				{:else if error}
				<h2>We're sorry, there appears to be an error. Please email info@gallerysonder.com with your inquiry.</h2>
				{:else}
				<h2>Thank you for reaching out!</h2>
				{/if}
				{/if}
				</div>
				
			</ContentWidth>
		</div>
	{/if}

		 {#if !$activeArtwork&&$lightboxImageUrl}
		<div
			class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-90 flex justify-center items-center z-40"
			
		>
			<button class="absolute w-full h-full" on:click={closeModal}> </button>
			<div
				class="w-11/12 h-11/12 max-h-11/12 max-w-11/12 lg:w-4/5 lg:h-4/5 lg:max-w-4/5 lg:max-h-4/5"
			>
				<img src={$lightboxImageUrl} alt="lightbox" class="w-full h-full object-contain" />
			</div>
		</div>
	{/if}

