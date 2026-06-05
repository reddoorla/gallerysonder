<script lang="ts">
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';

	let {
		activeImage = SonderLogoActive,
		href = '',
		onclick = () => {},
		onmouseover = () => {},
		onmouseout = () => {},
		class: className = ''
	}: {
		activeImage?: string;
		href?: string;
		onclick?: () => void;
		onmouseover?: () => void;
		onmouseout?: () => void;
		class?: string;
	} = $props();

	let viewportWidth = $state<number>(0);
	let viewportHeight = $state<number>(0);

	let active = $state(false);
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

{#if href}
	<a
		class="relative transition duration-500 ease-fast-slow w-fit {active
			? 'brightness-100'
			: 'brightness-0'} {className}"
		onmouseenter={() => (active = true)}
		onmouseleave={() => (active = false)}
		onfocus={() => {
			active = true;
			onmouseover();
		}}
		onblur={() => {
			active = false;
			onmouseout();
		}}
		{onmouseover}
		{onmouseout}
		{onclick}
		{href}
	>
		<img src={activeImage} alt="link to name" class={className} />
	</a>
{:else}
	<button
		class="relative transition duration-500 ease-fast-slow w-fit cursor-default {active
			? 'brightness-100'
			: 'brightness-0'} {className}"
		onmouseenter={() => (active = true)}
		onmouseleave={() => (active = false)}
		onfocus={() => {
			active = true;
			onmouseover();
		}}
		onblur={() => {
			active = false;
			onmouseout();
		}}
		{onmouseover}
		{onmouseout}
		{onclick}
	>
		<img src={activeImage} alt="link to name" class={className} />
	</button>
{/if}
