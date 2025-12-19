<script lang="ts">
	import { fade } from 'svelte/transition';

	import SonderLogoInactive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import { onMount } from 'svelte';

	export let inactiveImage = SonderLogoInactive;
	export let activeImage = SonderLogoActive;
	export let href = '/';
	export let activeBackgroundColor = 'inherit';
	export let setBackgroundColor = 'inherit';

	let linkRef: HTMLElement;
	let viewportWidth: number;
	let viewportHeight: number;

	let active = false;

	$: {
		if (active) {
			activeBackgroundColor = setBackgroundColor;
		} else {
			activeBackgroundColor = 'inherit';
		}
	}

	const checkActive = () => {
		const linkRect = linkRef?.getBoundingClientRect();
		if (
			linkRect.top - linkRect.height / 2 < viewportHeight / 2 &&
			linkRect.bottom + linkRect.height / 2 > viewportHeight / 2
		) {
			active = true;
		} else {
			active = false;
		}
	};

	onMount(() => {
		window.addEventListener('scroll', checkActive);
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

<a
	bind:this={linkRef}
	class="relative w-fit transition-transform duration-500 ease-fast-slow {active
		? 'scale-[1.4] translate-x-[20%] md:translate-x-0 md:scale-100'
		: ''} {$$props.class || ''}"
	onmouseenter={() => (active = true)}
	onmouseleave={() => (active = false)}
	{href}
>
	<img
		src={activeImage}
		alt="sonder logo"
		class="absolute top-0 left-0 translate-x-[1.05%] scale-[1.02] transition-opacity duration-500 {active
			? 'opacity-1'
			: 'md:opacity-0'} {$$props.class || ''}"
	/>

	<img
		src={inactiveImage}
		alt="sonder logo"
		class="{$$props.class || ''} opacity-0 md:opacity-100"
	/>
</a>
