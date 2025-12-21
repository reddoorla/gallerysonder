<script lang="ts">
	import logo from '$lib/assets/icons/sonderBaseLogo.svg';
	import sonderS from '$lib/assets/icons/sonderAlphabet/normal/S.svg';
	import logoExtendedO from '$lib/assets/icons/sonderLogosExtended/SONDER_O.svg';
	import logoExtendedN from '$lib/assets/icons/sonderLogosExtended/SONDER_N.svg';
	import logoExtendedD from '$lib/assets/icons/sonderLogosExtended/SONDER_D.svg';
	import logoExtendedE from '$lib/assets/icons/sonderLogosExtended/SONDER_E.svg';
	import logoExtendedR from '$lib/assets/icons/sonderLogosExtended/SONDER_R.svg';

	import { fade } from 'svelte/transition';

	import { onMount } from 'svelte';

	let { class: className = '' } = $props();

	let innerWidth = $state<number>(0);
	const logoArray = [logoExtendedO, logoExtendedN, logoExtendedD, logoExtendedE, logoExtendedR];

	let activeLogoIndex = $state(0);

	onMount(() => {
		let logoInterval = setInterval(() => {
			if (activeLogoIndex < logoArray.length - 1 && innerWidth > 768) {
				activeLogoIndex++;
			} else {
				activeLogoIndex = 0;
			}
		}, 4000);
	});
</script>

<svelte:window bind:innerWidth />
<div class="relative {className}">
	{#key activeLogoIndex}
		<img
			src={innerWidth > 768 ? logoArray[activeLogoIndex] : sonderS}
			alt="sonder logo"
			class={className}
			in:fade={{ duration: 400, delay: 400 }}
			out:fade={{ duration: 400 }}
		/>
	{/key}
	<img
		src={logoArray[activeLogoIndex]}
		alt="sonder logo"
		class="absolute top-0 left-0 hidden md:flex {className}"
	/>
</div>
