<script lang="ts">
	import { fade } from 'svelte/transition';

	import SonderLogoInactive from '$lib/assets/icons/sonderBaseLogo.svg';
	import SonderLogoInter from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';

	let {
		inactiveImage = SonderLogoInactive,
		intermediateImage = SonderLogoInter,
		activeImage = SonderLogoActive,
		href = '/',
		activeBackgroundColor = $bindable('inherit'),
		setBackgroundColor = 'inherit',
		class: className = ''
	}: {
		inactiveImage?: string;
		intermediateImage?: string;
		activeImage?: string;
		href?: string;
		activeBackgroundColor?: string;
		setBackgroundColor?: string;
		class?: string;
	} = $props();

	let hovered = $state(false);
	let showIntermediate = $state(false);

	$effect(function updateBackgroundAndIntermediateOnHover() {
		if (hovered) {
			activeBackgroundColor = setBackgroundColor;
		} else {
			activeBackgroundColor = 'inherit';
		}

		showIntermediate = true;
		setTimeout(() => (showIntermediate = false), 100);
	});
</script>

<a
	class="relative z-40 {className}"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	{href}
>
	{#key hovered}
		<img
			src={intermediateImage}
			alt="sonder logo"
			class="absolute top-0 left-0 transition-opacity duration-200 {className} "
			style="opacity:{hovered ? 1 : 0}; transform: scaleX(0.975) scaleY(0.98) translateX(-1%);"
		/>

		<img
			src={activeImage}
			alt="sonder logo"
			class="absolute top-0 left-0 transition-opacity duration-400 {className} {hovered
				? ''
				: 'opacity-[1%]'}"
			in:fade={{ duration: 400 }}
			out:fade={{ duration: 400 }}
		/>
		<img
			src={inactiveImage}
			alt="sonder logo"
			class="{className} {!hovered ? '' : 'opacity-0'}"
			in:fade={{ duration: 400, delay: 400 }}
			out:fade={{ duration: 400 }}
		/>
	{/key}
</a>
