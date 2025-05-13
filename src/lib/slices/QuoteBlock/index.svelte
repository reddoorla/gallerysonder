<script lang="ts">
	import type { QuoteBlockSlice } from '../../../prismicio-types';

	import ContentWidth from '$lib/components/ContentWidth.svelte';

	import TopShape from '$lib/components/Shapes/TopShape.svelte';

	import { backgroundColor } from '$lib/stores/backgroundColor';
	import { PrismicRichText } from '@prismicio/svelte';
	import * as prismicH from '@prismicio/helpers';

	export let slice: QuoteBlockSlice;
</script>
{#if !slice.primary.hide}
	<TopShape shapeNumber={slice.primary.shape_top} />
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class="w-full py-64">
			<ContentWidth class="md:pl-20 flex flex-col justify-center items-center">
				{#if prismicH.isFilled.image(slice.primary.signature)}
					<div class="text-subtle-primary mb-16 mx-16">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M11.5915 8.41463C9.57247 8.89024 8.15915 10.2073 7.83611 11.8171C9.73397 11.8537 11.1473 13.1707 11.1473 14.8902C11.1473 16.6463 9.69361 18 7.75537 18C5.37294 18 4 16.5 4 13.9024C4 9.95122 6.66508 6.80488 10.7031 6L11.5915 8.41463ZM17.2447 11.8171C19.1425 11.8537 20.5558 13.1707 20.5558 14.8902C20.5558 16.6463 19.1021 18 17.1639 18C14.7815 18 13.4086 16.5 13.4086 13.9024C13.4086 9.95122 16.0737 6.80488 20.1117 6L21 8.41463C18.981 8.89024 17.5677 10.2073 17.2447 11.8171Z"
								fill={$backgroundColor}
							/>
						</svg>
					</div>
				{/if}
				<div class="md:mx-16 quote">
					<PrismicRichText field={slice.primary.quotation} />
				</div>
				{#if prismicH.isFilled.image(slice.primary.signature)}
					<img src={slice.primary.signature.url} alt="quote signature" class="h-8 mt-16" />
				{/if}
			</ContentWidth>
		</div>
	</section>
{/if}