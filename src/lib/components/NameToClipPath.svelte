<script lang="ts">
	import { fade } from 'svelte/transition';

	import SonderLogoInactive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import { onMount } from 'svelte';

	let {
		inactiveImage = SonderLogoInactive,
		activeImage = SonderLogoActive,
		href = '/',
		activeBackgroundColor = $bindable('inherit'),
		setBackgroundColor = 'inherit',
		class: className = ''
	}: {
		inactiveImage?: string;
		activeImage?: string;
		href?: string;
		activeBackgroundColor?: string;
		setBackgroundColor?: string;
		class?: string;
	} = $props();

	let linkRef = $state<HTMLElement | undefined>(undefined);
	let viewportWidth = $state<number>(0);
	let viewportHeight = $state<number>(0);

	let active = $state(false);

	$effect(function updateBackgroundColorOnActive() {
		if (active) {
			activeBackgroundColor = setBackgroundColor;
		} else {
			activeBackgroundColor = 'inherit';
		}
	});

	const checkActive = () => {
		const linkRect = linkRef?.getBoundingClientRect();
		if (linkRect && (
			linkRect.top - linkRect.height / 2 < viewportHeight / 2 &&
			linkRect.bottom + linkRect.height / 2 > viewportHeight / 2
		)) {
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
		: ''} {className}"
	onmouseenter={() => (active = true)}
	onmouseleave={() => (active = false)}
	{href}
>
	<img
		src={activeImage}
		alt="sonder logo"
		class="absolute top-0 left-0 translate-x-[1.05%] scale-[1.02] transition-opacity duration-500 {active
			? 'opacity-1'
			: 'md:opacity-0'} {className}"
	/>

	<img
		src={inactiveImage}
		alt="sonder logo"
		class="{className} opacity-0 md:opacity-100"
	/>
</a>
