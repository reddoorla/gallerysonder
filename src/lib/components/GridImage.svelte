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
		subtitleItalic = '',
		subtitleText = '',
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
		subtitleItalic?: string;
		subtitleText?: string;
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

	let imgEl: HTMLImageElement | undefined = $state();
	let imageLoaded = $state(false);
	const markLoaded = () => (imageLoaded = true);

	// Catch images already complete when bound (cached / bfcache / client-side
	// nav), where the `load` event may never fire.
	$effect(() => {
		if (imgEl?.complete && imgEl.naturalWidth > 0) imageLoaded = true;
	});

	// Hold the clip "curtain" reveal (and the text fade that trails it) until the
	// image has actually decoded, so the curtain never opens onto a blank frame and
	// the image never pops in. Closed (25%) until loaded; once loaded it tracks
	// hover / scroll exactly as before.
	const effectiveInset = $derived(!imageLoaded ? 25 : isHover ? 0 : insetPercent);
	const revealed = $derived(imageLoaded && insetPercent < 8);

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
			appState.lightboxImageAlt = alt;
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
		// Hovering signals intent to open the lightbox — warm the artwork doc +
		// image now so the modal opens instantly.
		if (state && artworkUID) appState.prefetchArtwork(artworkUID);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#snippet subtitleBlock()}
	{#if subtitleItalic || subtitleText}
		<p
			class="transition-opacity use-gpu duration-500 {revealed
				? 'opacity-100 delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		>
			{#if subtitleItalic}<i>{subtitleItalic}</i>{/if}{#if subtitleItalic && subtitleText},
			{/if}{subtitleText}
		</p>
	{/if}
	{#if subtitleTwo}
		<p
			class="whitespace-pre-line transition-opacity use-gpu duration-500 {revealed
				? 'opacity-100 delay-[750ms]'
				: 'opacity-0 pointer-events-none delay-0'}"
		>
			{subtitleTwo}
		</p>
	{/if}
{/snippet}

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
			bind:this={imgEl}
			onload={markLoaded}
			onerror={markLoaded}
			{src}
			srcset={srcset(src)}
			sizes="(min-width: 768px) 50vw, 100vw"
			{alt}
			{width}
			{height}
			loading="lazy"
			decoding="async"
			class="clip-transition use-gpu w-full h-auto"
			style="clip-path: inset(0 {effectiveInset}% 0 {effectiveInset}%); -webkit-clip-path: inset(0 {effectiveInset}% 0 {effectiveInset}%);"
		/>
		{#if innerWidth > 768}
			{#if text}
				<h6
					aria-level="2"
					class="mt-3 transition-opacity use-gpu duration-500 {revealed
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>
						{text}
					</b>
				</h6>
			{/if}
			{@render subtitleBlock()}
		{:else}
			{#if text}
				<h5
					aria-level="2"
					class="mt-4 translate-x-[1px] transition-opacity duration-500 uppercase {revealed
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>{text}</b>
				</h5>
			{/if}
			{@render subtitleBlock()}
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
			bind:this={imgEl}
			onload={markLoaded}
			onerror={markLoaded}
			{src}
			srcset={srcset(src)}
			sizes="(min-width: 768px) 50vw, 100vw"
			{alt}
			{width}
			{height}
			loading="lazy"
			decoding="async"
			class="clip-transition use-gpu w-full h-auto"
			style="clip-path: inset(0 {effectiveInset}% 0 {effectiveInset}%); -webkit-clip-path: inset(0 {effectiveInset}% 0 {effectiveInset}%);"
		/>
		{#if innerWidth > 768}
			{#if text}
				<h6
					aria-level="2"
					class="mt-3 transition-opacity use-gpu duration-500 {revealed
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>
						{text}
					</b>
				</h6>
			{/if}
			{@render subtitleBlock()}
			{#if artworkUID}
				<div
					class="  transition-opacity use-gpu duration-500 {revealed
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
					class="mt-4 translate-x-[1px] transition-opacity duration-500 uppercase {revealed
						? 'opacity-100  delay-[750ms]'
						: 'opacity-0 pointer-events-none delay-0'}"
				>
					<b>{text}</b>
				</h5>
			{/if}
			{@render subtitleBlock()}
			{#if artworkUID}
				<div
					class="  transition-opacity use-gpu duration-500 {revealed
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
