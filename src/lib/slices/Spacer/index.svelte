<script lang='ts'>
	import { backgroundColor } from "$lib/stores/backgroundColor";
	
	export let slice;
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="w-screen" style="background-color:{$backgroundColor}; height:{slice.primary.height}">
</section>
