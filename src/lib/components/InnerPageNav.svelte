<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import ContentWidth from './ContentWidth.svelte';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import { preventDefault } from 'svelte/legacy';

	const appState = getAppState();

	let sliceRefs = $state<HTMLElement[]>([]);

	let {
		sections = [],
		slicesSections
	}: {
		sections?: string[];
		slicesSections: string[];
	} = $props();

	const formattedSections = sections.map(section => section);
	const formattedSlicesSections = slicesSections.map(section => section);

	let fixedNav = $state<HTMLElement | undefined>(undefined);

	let isFixedNavShown = $state(false);
	let activeSection = $state('');
	let viewportWidth = $state(0);

	const findTopOfSection = (section: string) => {
		for (let i = 0; i < sliceRefs.length; i++) {
			if (formattedSlicesSections[i] === section) return sliceRefs[i];
		}

		console.log('find top of section error looking for ' + section);
		return sliceRefs[0];
	};

	const checkPosition = () => {
		activeSection =
			formattedSlicesSections[
				sliceRefs.findIndex(
					(slice) => slice.getBoundingClientRect().bottom > window.innerHeight / 2
				)
			];
		if (fixedNav && sliceRefs[0] && sliceRefs[sliceRefs.length - 1]) {
			isFixedNavShown =
				fixedNav.getBoundingClientRect().top > sliceRefs[0].getBoundingClientRect().top &&
				fixedNav.getBoundingClientRect().bottom <
					sliceRefs[sliceRefs.length - 1].getBoundingClientRect().bottom;
		}
	};

	onMount(() => {
		let contentContainer;
		setTimeout(() => {
			contentContainer = document.getElementById('content-container');
			sliceRefs = [...(contentContainer?.getElementsByTagName('section') ?? [])];
			window.addEventListener('scroll', checkPosition);
		}, 500);

		return () => {
			window.removeEventListener('scroll', checkPosition);
		};
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="fixed w-screen h-screen z-10 pointer-events-none">
	<ContentWidth
		class="h-full relative pointer-events-none flex flex-row items-center justify-center"
	>
		<div
			bind:this={fixedNav}
			class="absolute top-2 lg:top-1/2 lg:-translate-y-4 lg:left-[7px] lg:-translate-x-1/2 lg:rotate-90 flex flex-row gap-4 transition {isFixedNavShown && !appState.isModalActive
				? 'pointer-events-auto transition-opacity'
				: 'pointer-events-none opacity-0'}"
		>
			{#each sections as section, i (i)}
				{#if viewportWidth > 1024}
					<a
						class="floating-links no-underline uppercase
                    {isFixedNavShown ? '' : 'pointer-events-none'}"
						class:active={section === activeSection}
						href="#{section}"
						onclick={(e) => {e.preventDefault();
							findTopOfSection(section).scrollIntoView({ behavior: 'smooth' })}}
					>
						{section}
					</a>
				{:else if section === activeSection}
					<a
						class="floating-links active no-underline uppercase transition-opacity fixed h-24 mx-auto top-6 -translate-x-1/2 {isFixedNavShown
							? ''
							: 'opacity-0 pointer-events-none'}"
						href="#{section}"
						transition:fade
					>
						{section}
					</a>
				{/if}
			{/each}
		</div>
	</ContentWidth>
</div>

<style>
	.floating-links {
		color: #b8ccca;

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

	.floating-links.active {
		color: #e8587c;
	}

	.floating-links:hover {
		color: #e8587c;
		opacity: 0.8;
	}

	.floating-links:active {
		color: #e8587c;
		opacity: 1;
	}
</style>
