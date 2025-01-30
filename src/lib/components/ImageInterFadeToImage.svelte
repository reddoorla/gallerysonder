<script lang="ts">
	import { fade } from 'svelte/transition';

	import SonderLogoInactive from '$lib/assets/icons/sonderBaseLogo.svg';
	import SonderLogoInter from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import SonderLogoActive from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';

	export let inactiveImage = SonderLogoInactive;
	export let intermediateImage = SonderLogoInter;
	export let activeImage = SonderLogoActive;
	export let href = '/';
	export let activeBackgroundColor = 'inherit';
	export let setBackgroundColor = 'inherit';

	let hovered = false;
	let showIntermediate = false;

	$: {
		if (hovered) {
			activeBackgroundColor = setBackgroundColor;
		} else {
			activeBackgroundColor = 'inherit';
		}

		showIntermediate = true;
		setTimeout(() => (showIntermediate = false), 100);
	}
</script>

<a
	class="relative z-40 {$$props.class || ''}"
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:mouseover
	on:mouseout
	on:focus
	on:blur
	{href}
>
	{#key hovered}
		<img
			src={intermediateImage}
			alt="sonder logo"
			class="absolute top-0 left-0 transition-opacity duration-200 {$$props.class || ''} "
			style="opacity:{hovered ? 1 : 0}; transform: scaleX(0.975) scaleY(0.98) translateX(-1%);"
		/>

		<img
			src={activeImage}
			alt="sonder logo"
			class="absolute top-0 left-0 transition-opacity duration-400 {$$props.class || ''} {hovered
				? ''
				: 'opacity-[1%]'}"
			in:fade={{ duration: 400 }}
			out:fade={{ duration: 400 }}
		/>
		<img
			src={inactiveImage}
			alt="sonder logo"
			class="{$$props.class || ''} {!hovered ? '' : 'opacity-0'}"
			in:fade={{ duration: 400, delay: 400 }}
			out:fade={{ duration: 400 }}
		/>
	{/key}
</a>
