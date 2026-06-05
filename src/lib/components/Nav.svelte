<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import type { NavDocumentDataLinksItem } from '../../prismicio-types';
	import * as prismicH from '@prismicio/helpers';

	import ContentWidth from './ContentWidth.svelte';
	import RotatingLogo from './RotatingLogo.svelte';
	import NameRevealOnHover from './NameRevealOnHover.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';

	import { getAppState } from '$lib/contexts/appState.svelte';
	import { trapFocus } from '$lib/utils/trapFocus';

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
				<i class="text-black fa-sharp fa-light fa-close fa-2xl hover:opacity-80 transition"></i>
			</button>

			<div class="absolute md:hidden justify-center items-center gap-4 hidden translate-y-1">
				<a
					href="https://www.instagram.com/gallerysonder/"
					class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75"
					aria-label="Visit Gallery Sonder on Instagram"
				>
					<i class="fa-brands fa-instagram fa-2xl"></i>
				</a>
			</div>
			{#each navProps as link, i (i)}
				<NameRevealOnHover
					activeImage={link.active_link.url || ''}
					onmouseover={() => {
						appState.backgroundColor = link.active_color || '#E4EEEA';
					}}
					onmouseout={() => (appState.backgroundColor = '#E4EEEA')}
					href={prismicH.isFilled.link(link.link) ? link.link.url : '#'}
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
