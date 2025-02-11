<script lang="ts">
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import onShowOne from '$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg';
	import { onMount, createEventDispatcher } from 'svelte';
	import { isModalActive } from '$lib/stores/isModalActive';
	import { fade } from 'svelte/transition';

	export let src = onShowOne;
	export let href = '';
	export let text = '';
	export let alt = 'gallery image';
	export let subtitle = '';
	export let subtitleTwo =''
	export let isHover = false;


	let innerWidth: number;
	let innerHeight: number;

	let insetPercent = 25;
	let linkRef: HTMLElement;

	const checkPosition = () => {
		if (linkRef) {
			const linkTop = linkRef?.getBoundingClientRect().top;

			if (linkTop >= (innerHeight * 4) / 5) {
				insetPercent = 25;
			} else {
				insetPercent = 0;
			}
		}
	};


	let showModal = false;

const openModal = () => {
	showModal = true;
	isModalActive.set(true);
	if (document.getElementsByTagName('body'))
		(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'hidden';
};

const closeModal = () => {
	showModal = false;
	isModalActive.set(false)
	if (document.getElementsByTagName('body'))
		(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'auto';
};

	onMount(() => {
		window.addEventListener('scroll', checkPosition);
	});

	const dispatch = createEventDispatcher();

	function onHover(state: boolean) {
		isHover = state;
		dispatch('hover', isHover);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<a
	bind:this={linkRef}
	{href}
	class="flex-grow-0 flex flex-col items-left clip-transition no-underline pointer-events-none {$$props.class || 'w-full'}"
	aria-hidden
	on:mouseenter={() => onHover(true)}
	on:mouseleave={() => onHover(false)}
	on:click={openModal}
>
	<img
		{src}
		{alt}
		class="clip-transition use-gpu w-full"
		style={isHover
			? 'clip-path: inset(0 0 0 0);-webkit-clip-path: inset(0 0 0 0);'
			: 'clip-path: inset(0 ' +
				insetPercent +
				'% 0 ' +
				insetPercent +
				'%); -webkit-clip-path: inset(0 ' +
				insetPercent +
				'% 0 ' +
				insetPercent +
				'%);'}
	/>
	{#if innerWidth > 768}
		<h6
			class="mt-3  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		><b>
			{text}
			</b>
		</h6>
		<div
			class="mt-2  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitle}</div
		>
		<div
			class="mt-2  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitleTwo}</div
		>
		<LinkArrowButton
			text={'EXPLORE'}
			class="mt-4 translate-x-[1px] transition-opacity duration-500 {isHover
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		/>
	{:else}
		<h6
		
			class="mt-4 translate-x-[1px] transition-opacity duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		><b>{text}</b></h6>
		<div
			class="mt-2 mb-16  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitle}</div
		>
		<div
			class="mt-2 mb-16  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitleTwo}</div
		>
	{/if}
</a>

{#if showModal}
<div
		class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
		transition:fade
	>
		<button class="absolute w-full h-full" on:click={closeModal}> </button>
		<button class="w-4/5 aspect-video relative">
			<img
				{src}
				alt="video thumbnail placeholder"
				class="w-full h-full object-cover"
			/>
			<div
				class="bottom-4 md:bottom-8 left-4 w-24 md:left-8 absolute flex flex-row justify-between gap-4"
			>
				<button
					class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump"
				>
					<i class="fa-solid fa-circle-play fa-2xl"></i>
				</button>
				<button
					class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump"
				>
					<i class="fa-solid fa-volume-high fa-2xl"></i>
				</button>
			</div>
		</button>
	</div>
{/if}

<style>
	.clip-transition {
		transition:
			clip-path 2.5s cubic-bezier(0.5, 0, 0, 1),
			-webkit-clip-path 2.5s cubic-bezier(0.5, 0, 0, 1);
		-webkit-transition: -webkit-clip-path 2.5s cubic-bezier(0.5, 0, 0, 1);
		transform: translateZ(1px);
		-webkit-transform: translateZ(1px);
	}
</style>

