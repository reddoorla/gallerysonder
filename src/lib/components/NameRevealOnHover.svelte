<script lang="ts">
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';

	let {
		activeImage = SonderLogoActive,
		href = '',
		label = '',
		onclick = () => {},
		onmouseover = () => {},
		onmouseout = () => {},
		class: className = ''
	}: {
		activeImage?: string;
		href?: string;
		/** Accessible name — the link/name image is the control's only content. */
		label?: string;
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
		<img src={activeImage} alt={label} loading="lazy" decoding="async" class={className} />
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
		<img src={activeImage} alt={label} loading="lazy" decoding="async" class={className} />
	</button>
{/if}
