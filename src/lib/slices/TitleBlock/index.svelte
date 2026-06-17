<script lang="ts">
	import type { TitleBlockSlice } from '../../../prismicio-types';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';
	import { isFilled } from '@prismicio/helpers';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import LinkPlusToggle from '$lib/components/Buttons/LinkPlusToggle.svelte';
	import { slide } from 'svelte/transition';
	import SplitRichTextAccordian from '$lib/components/SplitRichTextAccordian.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { populateHiddenForm, submitForm } from '$lib/utils/forms';
	import { datepicker } from '$lib/utils/datepicker';
	import Select from '$lib/components/Buttons/Select.svelte';

	const appState = getAppState();

	let viewportWidth = $state(0);
	let submitted = $state(false);
	let submitting = $state(false);
	let error = $state(false);

	let { slice }: { slice: TitleBlockSlice } = $props();

	let showFullBody = $state(false);
	let showContactForm = $state(true);

	let formName = $state('');
	let formCompany = $state('');
	let formPhone = $state('');
	let formEmail = $state('');
	let formMessage = $state('');
	let formDate = $state('');
	let formTimePreference = $state('');

	const triggerSubmitButton = async () => {
		if (submitting) return;
		submitting = true;
		try {
			const populated = populateHiddenForm('netlifyContactForm', {
				name: formName,
				company: formCompany,
				phone: formPhone,
				email: formEmail,
				message: formMessage,
				appointment_date: formDate,
				appointment_time: formTimePreference
			});

			if (populated) {
				const form = document.getElementById('netlifyContactForm') as HTMLFormElement;
				const result = await submitForm(form);

				submitted = true;
				error = !result.success;
			}
		} finally {
			submitting = false;
		}
	};

	let shape = $state<HTMLElement | undefined>(undefined);
	let shapeHeight = $state(0);

	onMount(() => {
		if (shape) shapeHeight = shape.getBoundingClientRect().height;
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

{#if slice.primary.shape_top !== '0'}
	<div style="height:{shapeHeight}px;"></div>
{/if}

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="w-full transition duration-1000 md:bg-transparent {slice.primary.shape_top === '1'
		? 'lg:mt-[100vh]'
		: ''} {slice.primary.hide ? 'hidden' : ''}"
	style="background-color: {appState.backgroundColor} "
>
	{#if slice.primary.shape_top !== '0'}<div class="-translate-y-[99%]" bind:this={shape}>
			<TopShape shapeNumber={slice.primary.shape_top || '0'} />
		</div>
	{/if}
	<ContentWidth class="h-full flex flex-col items-left pt-8 lg:pl-20 relative">
		{#if slice.variation === 'default'}
			<h5><b>{slice.primary.eyebrow || ''}</b></h5>
			{#if slice.primary.title}
				<h3 class="mt-3">{slice.primary.title || ''}</h3>
			{/if}
			{#if slice.primary.subtitle}
				<h6 class="mt-3"><b>{slice.primary.subtitle || ''}</b></h6>
			{/if}
			{#if slice.primary.body}
				<div
					class="xl:w-{slice.primary.desktop_body_width} {slice.primary.float === 'right'
						? 'xl:ml-auto'
						: ''} rich-text mt-6"
				>
					<PrismicRichText field={slice.primary.body} />
				</div>
			{/if}
			{#if slice.primary.button_text && isFilled.link(slice.primary.button_link)}
				<LinkArrowButton
					text={slice.primary.button_text || ''}
					href={slice.primary.button_link.url}
					class="mt-6"
				/>
			{/if}
		{:else if slice.variation === 'twoColumn'}
			<div class="w-full flex flex-col md:flex-row">
				<div class="w-full md:w-1/2 mb-10 md:mb-0">
					<h6 class="font-light">{slice.primary.eyebrow || ''}</h6>
					{#if slice.primary.title}
						<h3 class="mt-6">{slice.primary.title || ''}</h3>
					{/if}
					{#if slice.primary.subtitle}
						<h6 class="mb-6"><b>{slice.primary.subtitle || ''}</b></h6>
					{/if}
					{#if slice.primary.body}
						{#if slice.primary.read_more_button}
							<div class="rich-text mb-3 md:pr-16">
								{#key $page.url}
									<SplitRichTextAccordian bind:showFullBody>
										<PrismicRichText field={slice.primary.body} />
									</SplitRichTextAccordian>
								{/key}
							</div>
							<LinkPlusToggle
								onclick={() => (showFullBody = !showFullBody)}
								text={showFullBody ? 'Show Less' : 'Read More'}
							/>
						{:else}
							<div class="rich-text mb-6 md:pr-16">
								<PrismicRichText field={slice.primary.body} />
							</div>
						{/if}
					{/if}
					{#if slice.primary.button_text && isFilled.link(slice.primary.button_link)}
						<LinkArrowButton
							text={slice.primary.button_text || ''}
							href={slice.primary.button_link.url}
							class="mt-6"
							opensNewTab={slice.primary.button_link.link_type === 'Media'}
						/>
					{/if}
				</div>
				<div class="w-full md:w-1/2 md:pl-16">
					<PrismicImage field={slice.primary.image} />
				</div>
			</div>
		{:else if slice.variation === 'connect'}
			<h5>{slice.primary.eyebrow || ''}</h5>
			{#if slice.primary.title}
				<h2 class="mt-6">{slice.primary.title || ''}</h2>
			{/if}
			{#if slice.primary.subtitle}
				<h6 class="mb-6">{slice.primary.subtitle || ''}</h6>
			{/if}
			{#if slice.primary.body}
				<div class="rich-text mb-8">
					<PrismicRichText field={slice.primary.body} />
				</div>
			{/if}
			<div class="flex flex-row gap-6 mb-8">
				{#if slice.primary.button_text}
					<LinkPlusToggle
						startsActive={showContactForm}
						text={slice.primary.button_text || 'Inquire'}
						onclick={() => {
							showContactForm = !showContactForm;
						}}
					/>
				{/if}
				{#if slice.primary.button_text}
					<LinkPlusToggle
						togglable={false}
						text={slice.primary.button_two_text || 'Newsletter'}
						onclick={() => {
							appState.hasNewsletterBeenCleared = false;
							appState.isNewsletterActive = true;
						}}
					/>
				{/if}
			</div>
			{#if showContactForm}
				<div
					transition:slide
					class="h-full w-full my-12 md:mt-0 md:w-2/3 flex flex-col gap-2 items-start md:pr-24"
				>
					{#if !submitted}
						<p>Name</p>
						<input
							type="text"
							name="name"
							bind:value={formName}
							required
							placeholder="First and last name"
							class="w-full border-1 border-mid p-2 mb-4"
						/>

						<p>Company Name</p>
						<input
							type="text"
							name="company"
							bind:value={formCompany}
							placeholder="Company name"
							class="w-full border-1 border-mid p-2 mb-4"
						/>

						<p>Phone</p>
						<input
							type="phone"
							name="phone"
							bind:value={formPhone}
							required
							placeholder="000-000-0000"
							class="w-full border-1 border-mid p-2 mb-4"
						/>

						<p>Email</p>
						<input
							type="email"
							name="email"
							bind:value={formEmail}
							required
							placeholder="you@domain.com"
							class="w-full border-1 border-mid p-2 mb-4"
						/>

						<p>Preferred appointment date <span class="opacity-50">(optional)</span></p>
						<input
							type="text"
							name="appointment_date"
							bind:value={formDate}
							use:datepicker
							placeholder="Select a date"
							aria-label="Preferred appointment date"
							class="w-full border-1 border-mid p-2 mb-4 bg-white/40 rounded-[2px]"
						/>

						<p>Preferred time of day <span class="opacity-50">(optional)</span></p>
						<Select
							bind:value={formTimePreference}
							ariaLabel="Preferred time of day"
							placeholder="No preference"
							options={[
								{ value: '', label: 'No preference' },
								{ value: 'Morning', label: 'Morning' },
								{ value: 'Afternoon', label: 'Afternoon' },
								{ value: 'Evening', label: 'Evening' }
							]}
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
							placeholder="How can we help?"
							class="min-h-24 w-full border-1 border-mid p-2 mb-4"
						></textarea>

						<button
							type="submit"
							onclick={triggerSubmitButton}
							disabled={submitting}
							class="bump text-primary border-b-2 bg-white hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer"
							>Connect</button
						>
					{:else if error}
						<h2>
							We're sorry, there appears to be an error. Please email info@gallerysonder.com with
							your inquiry.
						</h2>
					{:else}
						<h2>Thank you for reaching out!</h2>
					{/if}
				</div>
			{/if}
			<div class="flex flex-row gap-6">
				{#if isFilled.link(slice.primary.instagram)}
					<a href={slice.primary.instagram.url} aria-label="Visit Gallery Sonder on Instagram"
						><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[1.25em]"
							><path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
							/></svg
						></a
					>
				{/if}
			</div>
		{/if}
	</ContentWidth>
</section>

<style>
	input,
	textarea {
		background-color: rgba(255, 255, 255, 0.4);
		border-radius: 2px;
	}
</style>
