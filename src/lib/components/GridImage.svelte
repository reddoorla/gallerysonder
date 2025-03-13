<script lang="ts">
	import onShowOne from '$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg';
	import { onMount, createEventDispatcher } from 'svelte';
	import { isModalActive } from '$lib/stores/isModalActive';
	import { activeArtworkUid, isLightboxActive, lightboxImageUrl } from '$lib/stores/lightbox';

	export let src = onShowOne;
	export let href = '';
	export let text = '';
	export let alt = 'gallery image';
	export let subtitle = '';
	export let subtitleTwo =''
	export let isHover = false;
	export let willOpen = false;
	export let artworkUID = '';


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


const openModal = () => {
	lightboxImageUrl.set(src);
	activeArtworkUid.set(artworkUID);

	isModalActive.set(true);
		isLightboxActive.set(true);
	
	if (document.getElementsByTagName('body'))
		(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'hidden';
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

{#if href||!willOpen}
<a
	bind:this={linkRef}
	{href}
	class="flex-grow-0 flex flex-col items-left clip-transition no-underline {href?"":"pointer-events-none"} {$$props.class || 'w-full'}"
	aria-hidden={href?false:true}
	on:mouseenter={() => onHover(true)}
	on:mouseleave={() => onHover(false)}
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
	{#if text}
		<h6
			class="mt-3  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		><b>
			{text}
			</b>
		</h6>
		{/if}
		{#if subtitle}
		<p
			class="mt-1  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitle}</p
		>
		{/if}
		{#if subtitleTwo}
		<p
			class="mt-1  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitleTwo}</p
		>
		{/if}
	
	{:else}
		{#if text}
		<h5
		
			class="mt-4 translate-x-[1px] transition-opacity duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		><b>{text}</b></h5>
		{/if}
		{#if subtitle}
		<p
			class="mt-1  transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitle}</p
		>
		{/if}
		{#if subtitleTwo}
		<p
			class="mt-1   transition-opacity use-gpu duration-500 {insetPercent < 8
				? 'opacity-100  delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}">{subtitleTwo}</p
		>
		{/if}
	{/if}
</a>
{:else}
	<button 
		bind:this={linkRef}
		class="flex-grow-0 flex flex-col items-start text-left clip-transition no-underline {$$props.class || 'w-full'}"
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
		{#if text}
			<h6
				class="mt-3  transition-opacity use-gpu duration-500 {insetPercent < 8
					? 'opacity-100  delay-[750ms]'
					: 'opacity-0 pointer-events-none delay-0'}"
			><b>
				{text}
				</b>
			</h6>
			{/if}
			{#if subtitle}
			<p
				class="mt-1  transition-opacity use-gpu duration-500 {insetPercent < 8
					? 'opacity-100  delay-[750ms]'
					: 'opacity-0 pointer-events-none delay-0'}">{subtitle}</p
			>
			{/if}
			{#if subtitleTwo}
			<p
				class="mt-1  transition-opacity use-gpu duration-500 {insetPercent < 8
					? 'opacity-100  delay-[750ms]'
					: 'opacity-0 pointer-events-none delay-0'}">{subtitleTwo}</p
			>
			{/if}
			
		{:else}
			{#if text}
			<h5
			
				class="mt-4 translate-x-[1px] transition-opacity duration-500 {insetPercent < 8
					? 'opacity-100  delay-[750ms]'
					: 'opacity-0 pointer-events-none delay-0'}"
			><b>{text}</b></h5>
			{/if}
			{#if subtitle}
			<p
				class="mt-1  transition-opacity use-gpu duration-500 {insetPercent < 8
					? 'opacity-100  delay-[750ms]'
					: 'opacity-0 pointer-events-none delay-0'}">{subtitle}</p
			>
			{/if}
			{#if subtitleTwo}
			<p
				class="mt-1   transition-opacity use-gpu duration-500 {insetPercent < 8
					? 'opacity-100  delay-[750ms]'
					: 'opacity-0 pointer-events-none delay-0'}">{subtitleTwo}</p
			>
			{/if}
		{/if}
	</button>
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
	p{
		font-size: 11px;
		line-height: 13px;
	}
</style>

