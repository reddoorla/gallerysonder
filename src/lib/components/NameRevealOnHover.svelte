<script lang="ts">
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';

	export let activeImage = SonderLogoActive;
	export let href = '';
	export let click = () => {};
	export let onmouseover = () => {};
	export let onmouseout = () => {};
	let viewportWidth: number;
	let viewportHeight: number;

	let active = false;
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

{#if href}
	<a
		class="relative transition duration-500 ease-fast-slow w-fit {active
			? 'brightness-100'
			: 'brightness-0'} {$$props.class || ''}"
		onmouseenter={() => (active = true)}
		onmouseleave={() => (active = false)}
		{onmouseover}
		{onmouseout}
		onclick={click}
		{href}
	>
		<img src={activeImage} alt="link to name" class={$$props.class || ''} />
	</a>
{:else}
	<button
		class="relative transition duration-500 ease-fast-slow w-fit cursor-default {active
			? 'brightness-100'
			: 'brightness-0'} {$$props.class || ''}"
		onmouseenter={() => (active = true)}
		onmouseleave={() => (active = false)}
		{onmouseover}
		{onmouseout}
		onclick={click}
	>
		<img src={activeImage} alt="link to name" class={$$props.class || ''} />
	</button>
{/if}
