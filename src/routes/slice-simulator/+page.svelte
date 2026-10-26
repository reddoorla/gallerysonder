<script>
	import { SliceSimulator, SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- @prismicio/svelte 3 hands the slices to a `children` snippet; it has no slot. -->
<SliceSimulator>
	{#snippet children({ slices })}
		<SliceZone {slices} {components} />
	{/snippet}
</SliceSimulator>
