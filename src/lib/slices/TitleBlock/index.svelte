<script lang="ts">


	import type { TitleBlockSlice } from '../../../prismicio-types';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import { backgroundColor } from '$lib/stores/backgroundColor';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';
	import { isFilled } from '@prismicio/helpers';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import LinkPlusToggle from '$lib/components/Buttons/LinkPlusToggle.svelte';
	import { slide } from 'svelte/transition';
	import { isNewsletterActive } from '$lib/stores/isNewsletterActive';

	let viewportWidth: number;

	export let slice: TitleBlockSlice;

	let showFullBody = false;
	let showContactForm = false;
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="w-full md:bg-transparent {slice.primary.shape_top==="1"?"":""}"
	style="background-color: {$backgroundColor} "
>
{#if slice.primary.shape_top !== '0'}<div
class="-translate-y-full "
>
<TopShape shapeNumber={slice.primary.shape_top || '0'} />
</div>

{/if}
	<ContentWidth class="h-full flex flex-col items-left lg:pl-20 relative">
		{#if slice.variation === 'default'}
			<h5>{slice.primary.eyebrow || ''}</h5>
			{#if slice.primary.title}
				<h3 class="mt-6">{slice.primary.title || ''}</h3>
			{/if}
			{#if slice.primary.subtitle}
				<h6 class="mb-6">{slice.primary.subtitle || ''}</h6>
			{/if}
			{#if slice.primary.body}
				<div class="lg:w-{slice.primary.desktop_body_width} rich-text mb-6">
					<PrismicRichText field={slice.primary.body} />
				</div>
			{/if}
			{#if slice.primary.button_text && isFilled.link(slice.primary.button_link)}
				<LinkArrowButton
					text={slice.primary.button_text || ''}
					href={slice.primary.button_link.url}
				/>
			{/if}
		{:else if slice.variation === 'twoColumn'}
			<div class="w-full flex flex-col md:flex-row">
				<div class="w-full md:w-1/2">
					<h5>{slice.primary.eyebrow || ''}</h5>
					{#if slice.primary.title}
						<h3 class="mt-6">{slice.primary.title || ''}</h3>
					{/if}
					{#if slice.primary.subtitle}
						<h6 class="mb-6">{slice.primary.subtitle || ''}</h6>
					{/if}
					{#if slice.primary.body}
						{#if slice.primary.read_more_button}
						<div class="rich-text mb-6 md:pr-16">
							{#if showFullBody}
							  <div transition:slide>
								<PrismicRichText field={slice.primary.body} />
							  </div>
							{:else}
							  <div class="max-h-[400px] overflow-hidden">
								<PrismicRichText field={slice.primary.body} />
							  </div>
							{/if}
						  </div>
							<LinkPlusToggle
								click={() => (showFullBody = !showFullBody)}
								text={showFullBody ? 'Show Less' : 'Read More'}
							/>
							<div class="h-12" />
						{:else}
							<div class="rich-text mb-6 md:pr-16">
								<PrismicRichText field={slice.primary.body} />
							</div>
						{/if}
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
				<LinkPlusToggle text={slice.primary.button_text||'Inquire'} click={()=>{showContactForm=!showContactForm}} />
			{/if}
			{#if slice.primary.button_text}
				<LinkPlusToggle text={slice.primary.button_two_text||'Newsletter'} click={()=>{isNewsletterActive.set(true)}} />
			{/if}
			</div>
			<div class="flex flex-row gap-6">
				{#if isFilled.link(slice.primary.instagram)}
					<a href={slice.primary.instagram.url}><i class="fa-brands fa-instagram fa-lg"/></a>
				{/if}
			</div>
		{/if}
	</ContentWidth>
</section>
