<script>
	import { PrismicRichText } from '@prismicio/svelte';
	import Label from './Label.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { backgroundColor } from '$lib/stores/backgroundColor';
	import { isFilled } from '@prismicio/client';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';

	/** @type {import("@prismicio/client").Content.RichTextSlice} */
	export let slice;
</script>

<section style="background-color:{$backgroundColor}" class="w-screen transition duration-1000">
	<ContentWidth class="w-full flex flex-col items-start lg:pl-20 py-{parseInt(slice.primary.slice_vertical_padding)/2} sm:py-{slice.primary.slice_vertical_padding}">
		<div class="sm:w-{slice.primary.desktop_width} whitespace-pre-line rich-text pr-4 md:pr-0">
		<PrismicRichText
			field={slice.primary.content}
			components={{
				label: Label
			}}
		/>
 
		{#if slice.primary.button_text&& isFilled.link(slice.primary.button_link)}
			<LinkArrowButton text={slice.primary.button_text || 'explore'} href={slice.primary.button_link.url} opensNewTab={slice.primary.button_link.link_type==='Media'} class="mt-8" />
		{/if}
		</div>
	</ContentWidth>
</section>
