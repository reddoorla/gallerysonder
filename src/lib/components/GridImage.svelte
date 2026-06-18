<script lang="ts">
	import onShowOne from '$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import { srcset } from '$lib/utils/image';

	const appState = getAppState();

	let {
		src = onShowOne,
		href = '',
		text = '',
		alt = 'gallery image',
		subtitle = '',
		subtitleTwo = '',
		width = undefined,
		height = undefined,
		isHover = $bindable(false),
		onHoverChange = undefined as ((value: boolean) => void) | undefined,
		willOpen = false,
		artworkUID = '',
		class: className = 'w-full'
	}: {
		src?: string;
		href?: string;
		text?: string;
		alt?: string;
		subtitle?: string;
		subtitleTwo?: string;
		width?: number;
		height?: number;
		isHover?: boolean;
		onHoverChange?: ((value: boolean) => void) | undefined;
		willOpen?: boolean;
		artworkUID?: string;
		class?: string;
	} = $props();

	let innerWidth = $state<number>(0);
	let innerHeight = $state<number>(0);

	let insetPercent = $state(25);
	let linkRef: HTMLElement | undefined = $state();

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
		if (artworkUID) {
			appState.activeArtworkUid = artworkUID;
		} else {
			appState.lightboxImageUrl = src;
		}

		appState.isLightboxActive = true;

		setTimeout(() => {
			appState.lockBodyScroll();
		}, 500);
	};

	$effect(function attachScrollListenerForInsetAnimation() {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', checkPosition);

			return () => {
				window.removeEventListener('scroll', checkPosition);
			};
		}
	});

	function onHover(state: boolean) {
		isHover = state;
		onHoverChange?.(isHover);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if href || !willOpen}
	<a
		bind:this={linkRef}
		{href}
		class="flex-grow-0 flex flex-col items-left clip-transition no-underline {href
			? ''
			: 'pointer-events-none'} {className}"
		aria-hidden={href ? false : true}
		onmouseenter={() => onHover(true)}
		onmouseleave={() => onHover(false)}
	>
		<img
			{src}
			srcset={srcset(src)}
			sizes="(min-width: 768px) 50vw, 100vw"
			{alt}
			{width}
			{height}
			loading="lazy"
			decoding="async"
			class="clip-transition use-gpu w-full h-auto"
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
					aria-level="2"
					class="mt-3 transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>
						{text}
					</b>
				</h6>
			{/if}
			{#if subtitle}
				<p
					class=" transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitle}
				</p>
			{/if}
			{#if subtitleTwo}
				<p
					class=" transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitleTwo}
				</p>
			{/if}
		{:else}
			{#if text}
				<h5
					aria-level="2"
					class="mt-4 translate-x-[1px] transition-opacity duration-500 uppercase {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>{text}</b>
				</h5>
			{/if}
			{#if subtitle}
				<p
					class=" transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitle}
				</p>
			{/if}
			{#if subtitleTwo}
				<p
					class="  transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitleTwo}
				</p>
			{/if}
		{/if}
	</a>
{:else}
	<button
		bind:this={linkRef}
		class="flex-grow-0 flex flex-col items-start text-left clip-transition no-underline {className}"
		onmouseenter={() => onHover(true)}
		onmouseleave={() => onHover(false)}
		onclick={openModal}
	>
		<img
			{src}
			srcset={srcset(src)}
			sizes="(min-width: 768px) 50vw, 100vw"
			{alt}
			{width}
			{height}
			loading="lazy"
			decoding="async"
			class="clip-transition use-gpu w-full h-auto"
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
					aria-level="2"
					class="mt-3 transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>
						{text}
					</b>
				</h6>
			{/if}
			{#if subtitle}
				<p
					class=" transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitle}
				</p>
			{/if}
			{#if subtitleTwo}
				<p
					class=" transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitleTwo}
				</p>
			{/if}
			{#if artworkUID}
				<div
					class="  transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<LinkArrowButton
						text="INQUIRE"
						class="origin-left scale-75 mt-1"
						onclick={() => {
							openModal();
							appState.showInquiryForm = true;
						}}
					/>
				</div>
			{/if}
		{:else}
			{#if text}
				<h5
					aria-level="2"
					class="mt-4 translate-x-[1px] transition-opacity duration-500 uppercase {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>{text}</b>
				</h5>
			{/if}
			{#if subtitle}
				<p
					class=" transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitle}
				</p>
			{/if}
			{#if subtitleTwo}
				<p
					class="  transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html subtitleTwo}
				</p>
			{/if}
			{#if artworkUID}
				<div
					class="  transition-opacity use-gpu duration-500 {insetPercent < 8
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<LinkArrowButton
						text="INQUIRE"
						class="scale-75 origin-left mt-1 "
						onclick={() => {
							openModal();
							appState.showInquiryForm = true;
						}}
					/>
				</div>
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
	p {
		font-size: 11px;
		line-height: 18px;
	}
</style>
