<script>
	import { PrismicRichText } from '@prismicio/svelte';
	import Label from './Label.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import { backgroundColor } from '$lib/stores/backgroundColor';

	/** @type {import("@prismicio/client").Content.RichTextSlice} */
	export let slice;
</script>

<section style="background-color:{$backgroundColor}" class="w-screen">
	<ContentWidth class="w-full lg:pl-20 sm:w-{slice.primary.desktop_width}">
		<PrismicRichText
			field={slice.primary.content}
			components={{
				label: Label
			}}
		/>
	</ContentWidth>
</section>
