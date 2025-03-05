<script lang="ts">
	import linkArrow from '$lib/assets/icons/sonderArrowRight.svg';
	import { onMount } from 'svelte';
	export let text = '';
	export let href = '';
	export let click = () => {};
	export let togglable = true;
	export let startsActive = false;

	let isLinkArrowActive = false;
	let isRotated = false;

	onMount(()=>isRotated = startsActive)
</script>

{#if href}
	<a
		on:mouseenter={() => (isLinkArrowActive = true)}
		on:mouseleave={() => (isLinkArrowActive = false)}
		on:click={() => {
			isLinkArrowActive = false;
			isRotated = !isRotated;
			click();
		}}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {$$props.class ||
			''}"
		{href}
	>
		<span class="h-5 uppercase no-underline">{text}</span>
	
		<i
			class="fa-sharp fa-bold fa-plus fa text-black ml-[10px] transition-transform duration-300 {isRotated && togglable
				? 'rotate-45 scale-125'
				: ''} {isLinkArrowActive ? '-translate-y-[1px]' : ''}"
		>
		</i>
	</a>
{:else}
	<button
		on:mouseenter={() => (isLinkArrowActive = true)}
		on:mouseleave={() => (isLinkArrowActive = false)}
		on:click={() => {
			isLinkArrowActive = false;
			isRotated = !isRotated;
			click();
		}}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {$$props.class ||
			''}"
	>
		<span class="h-5 uppercase no-underline">{text}</span>
		<i
			class="fa-sharp fa-bold fa-plus fa text-black ml-[10px] transition-transform duration-300 {isRotated && togglable
				? 'rotate-45 scale-125'
				: ''} {isLinkArrowActive ? '-translate-y-[1px]' : ''}"
		>
		</i></button
	>
{/if}

<style>
	span {
		color: var(--Black, #000);
		leading-trim: both;
		text-edge: cap;
		font-feature-settings:
			'clig' off,
			'liga' off;

		/* Button - all caps */
		font-family: 'commuters-sans';
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: 150%; /* 21px */
		letter-spacing: 1.5px;
		text-transform: uppercase;
	}
</style>
