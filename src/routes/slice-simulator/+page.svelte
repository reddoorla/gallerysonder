<script>
	import { SliceSimulator } from '@slicemachine/adapter-sveltekit/simulator';
	import { SliceZone } from '@prismicio/svelte';
	import { components } from '$lib/slices';
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<SliceSimulator let:slices>
	<SliceZone {slices} {components} />
</SliceSimulator>
