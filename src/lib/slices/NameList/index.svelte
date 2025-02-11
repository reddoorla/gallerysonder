<script lang="ts">
	import type { NameListSlice } from '../../../prismicio-types';
	import * as prismicHelpers from '@prismicio/helpers';

	import NameRevealOnHover from '$lib/components/NameRevealOnHover.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';

	import { backgroundColor } from '$lib/stores/backgroundColor';

	export let slice: NameListSlice;
</script>

<section
	class="w-full use-gpu transition-all duration-1000 pt-16"
	id="explore"
	style="background-color:{$backgroundColor};"
>
	<ContentWidth class="lg:pl-20 relative flex flex-col gap-16 mb-16">
		{#if slice.primary.section_eyebrow}
			<h5 class="uppercase">{slice.primary.section_eyebrow || ''}</h5>
		{/if}

		{#each slice.items as item}
			<NameRevealOnHover
				activeImage={item.artist_active_image.url || ''}
				on:mouseover={() => backgroundColor.set(item.artist_color || '#E4EEEA')}
				on:mouseout={() => backgroundColor.set('#E4EEEA')}
				href={prismicHelpers.isFilled.link(item.artist_page) ? item.artist_page.url : ''}
				class="h-4 sm:h-6 md:h-10 lg:h-12"
			/>
		{/each}

		{#if slice.primary.bottom_button_text}
			<LinkArrowButton
				text={slice.primary.bottom_button_text || ''}
				href={prismicHelpers.isFilled.link(slice.primary.button_bottom_link)
					? slice.primary.button_bottom_link.url
					: ''}
				class="mt-16"
			/>
		{/if}
	</ContentWidth>
</section>
