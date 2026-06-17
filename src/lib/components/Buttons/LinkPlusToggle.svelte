<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus } from '@lucide/svelte';

	let {
		text = '',
		href = '',
		onclick = () => {},
		togglable = true,
		startsActive = false,
		class: className = ''
	}: {
		text?: string;
		href?: string;
		onclick?: () => void;
		togglable?: boolean;
		startsActive?: boolean;
		class?: string;
	} = $props();

	let isLinkArrowActive = $state(false);
	let isRotated = $state(false);

	onMount(() => (isRotated = startsActive));
</script>

{#if href}
	<a
		onmouseenter={() => (isLinkArrowActive = true)}
		onmouseleave={() => (isLinkArrowActive = false)}
		onclick={() => {
			isLinkArrowActive = false;
			isRotated = !isRotated;
			onclick();
		}}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {className}"
		{href}
	>
		<span class="h-5 uppercase no-underline">{text}</span>

		<Plus
			class="size-[1em] text-black ml-[10px] transition-transform duration-300 {isRotated &&
			togglable
				? 'rotate-45 scale-125'
				: ''} {isLinkArrowActive ? '-translate-y-[1px]' : ''}"
			strokeWidth={2}
		/>
	</a>
{:else}
	<button
		onmouseenter={() => (isLinkArrowActive = true)}
		onmouseleave={() => (isLinkArrowActive = false)}
		onclick={() => {
			isLinkArrowActive = false;
			isRotated = !isRotated;
			onclick();
		}}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {className}"
	>
		<span class="h-5 uppercase no-underline">{text}</span>
		<Plus
			class="size-[1em] text-black ml-[10px] transition-transform duration-300 {isRotated &&
			togglable
				? 'rotate-45 scale-125'
				: ''} {isLinkArrowActive ? '-translate-y-[1px]' : ''}"
			strokeWidth={2}
		/></button
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

		font-family: 'commuters-sans';
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: 150%;
		letter-spacing: 1.5px;
		text-transform: uppercase;
	}
</style>
