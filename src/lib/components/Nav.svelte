<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import type { NavDocumentDataLinksItem } from '../../prismicio-types';
	import { isFilled } from '@prismicio/client';

	import ContentWidth from './ContentWidth.svelte';
	import RotatingLogo from './RotatingLogo.svelte';
	import NameRevealOnHover from './NameRevealOnHover.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';
	import { trapFocus } from '$lib/utils/trapFocus';
	import { X } from '@lucide/svelte';

	const appState = getAppState();

	interface Props {
		isLogoBlack: boolean;
		navProps: NavDocumentDataLinksItem[];
	}

	let { isLogoBlack, navProps }: Props = $props();

	let showNav = $state(false);
	let viewportWidth = $state(1024);

	// Lock body scroll while the full-screen menu is open.
	$effect(() => {
		if (showNav) appState.lockBodyScroll();
		else appState.unlockBodyScroll();
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div
	class=" w-screen fixed h-16 top-0 z-30 pointer-events-none {!showNav && viewportWidth > 768
		? 'mix-blend-difference'
		: 'mix-blend-normal'} "
	transition:fade={{ duration: 300 }}
>
	<ContentWidth class="flex flex-row justify-between items-center h-full">
		<button
			class="scale-105 text-white hover:text-accent-pink hover:mix-blend-normal pointer-events-auto filter-to-accent-pink-on-hover active:invert transition-all {isLogoBlack ||
			showNav
				? 'brightness-0'
				: ''}"
			onclick={() => (showNav = !showNav)}
			aria-label="Toggle navigation menu"
			aria-expanded={showNav}
			aria-controls="main-nav"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class=""
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20ZM20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H20ZM3 7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44772 3 7Z"
					fill="white"
					class=""
				/>
			</svg>
		</button>
		<a
			href="/"
			class="filter-to-accent-pink-on-hover transition pointer-events-auto bump brightness-0 hover:mix-blend-normal {isLogoBlack ||
			showNav
				? ''
				: 'invert'}"
		>
			<RotatingLogo class="h-6" />
		</a>
	</ContentWidth>
</div>

{#if showNav}
	<div
		id="main-nav"
		class="h-screen w-screen fixed top-0 left-0 z-30 transition-colors duration-1000 ease-fast-slow"
		style="background-color:{appState.backgroundColor}"
		transition:slide
		use:trapFocus={{ onEscape: () => (showNav = false) }}
		role="dialog"
		aria-modal="true"
		aria-label="Main navigation"
		tabindex="-1"
	>
		<ContentWidth
			class="flex flex-col gap-12 lg:gap-20 pb-16 pt-48 items-start justify-start h-full relative"
		>
			<button
				onclick={() => (showNav = false)}
				class="absolute top-6 left-0.5 text-black bump hover:opacity-40"
				aria-label="Close navigation menu"
			>
				<X class="size-[2em] text-black hover:opacity-80 transition" strokeWidth={1.5} />
			</button>

			<!-- Same rotating logo as the top bar, in the same spot, so it stays
			     visible while the menu (which paints over the top bar) is open. -->
			<a
				href="/"
				onclick={() => setTimeout(() => (showNav = false))}
				class="absolute top-5 right-0 brightness-0 filter-to-accent-pink-on-hover hover:mix-blend-normal transition bump"
			>
				<RotatingLogo class="h-6" />
			</a>

			<div class="absolute md:hidden justify-center items-center gap-4 hidden translate-y-1">
				<a
					href="https://www.instagram.com/gallerysonder/"
					class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75"
					aria-label="Visit Gallery Sonder on Instagram"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[2em]"
						><path
							d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
						/></svg
					>
				</a>
			</div>
			{#each navProps as link, i (i)}
				<NameRevealOnHover
					activeImage={link.active_link.url || ''}
					onmouseover={() => {
						appState.backgroundColor = link.active_color || '#E4EEEA';
					}}
					onmouseout={() => (appState.backgroundColor = '#E4EEEA')}
					href={isFilled.link(link.link) ? link.link.url : '#'}
					class="h-4 sm:h-6 md:h-10 lg:h-12"
					onclick={() => {
						setTimeout(() => (showNav = false));
					}}
				/>
			{/each}

			<LinkArrowButton
				class=""
				onclick={() => {
					appState.hasNewsletterBeenCleared = false;
					appState.isNewsletterActive = true;
				}}
				text="Subscribe to our newsletter"
			/>
		</ContentWidth>
	</div>
{/if}
