<!-- SplitContent.svelte -->
<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { getAppState } from '$lib/contexts/appState.svelte';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	const appState = getAppState();

	interface HTMLElementWithOuterHTML extends HTMLElement {
		outerHTML: string;
	}

	let {
		showFullBody = $bindable(false),
		maxHeight = 400
	}: {
		showFullBody?: boolean;
		maxHeight?: number;
	} = $props();

	let contentDiv = $state<HTMLElement | null>(null);
	let visibleContent = $state<HTMLElementWithOuterHTML[]>([]);
	let hiddenContent = $state<HTMLElementWithOuterHTML[]>([]);
	let shouldShowGradient = $state(false);

	function splitContent(): void {
		if (!contentDiv) return;

		let elements = Array.from(contentDiv.children) as HTMLElementWithOuterHTML[];
		const visibleElements: HTMLElementWithOuterHTML[] = [];
		const hiddenElements: HTMLElementWithOuterHTML[] = [];
		let _currentHeight = 0;
		if (elements.length > 0) visibleElements.push(elements.shift() as HTMLElementWithOuterHTML);

		for (const element of elements) {
			const { offsetTop, offsetHeight } = element;
			if (offsetTop + offsetHeight <= maxHeight) {
				visibleElements.push(element);
				_currentHeight = offsetTop + offsetHeight;
			} else {
				hiddenElements.push(element);
			}
		}

		shouldShowGradient = hiddenElements.length > 0;
		visibleContent = visibleElements;
		hiddenContent = hiddenElements;
	}

	onNavigate(() => splitContent());
	onMount(() => {
		setTimeout(() => splitContent(), 25);
	});

	$effect(function splitContentWhenDivLoads() {
		if (contentDiv) splitContent();
	});
</script>

<div class="relative">
	<!-- Measurement div (hidden) -->
	<div bind:this={contentDiv} class="absolute invisible" aria-hidden="true">
		<slot />
	</div>

	<!-- Actual content -->
	{#if visibleContent}
		<!-- Always visible content -->
		<div class="space-y-4">
			{#each visibleContent as element, i (i)}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html element.outerHTML}
			{/each}
		</div>

		<!-- Expandable content -->
		{#if showFullBody && hiddenContent}
			<div transition:slide={{ duration: 400, easing: cubicOut }} class="space-y-4">
				{#each hiddenContent as element, i (i)}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html element.outerHTML}
				{/each}
			</div>
		{/if}

		<!-- Gradient overlay -->
		{#if shouldShowGradient && !showFullBody}
			<div
				class="absolute bottom-0 left-0 w-full"
				transition:slide={{ duration: 300, easing: cubicOut }}
			>
				<div
					class="h-12 w-full transition-opacity duration-300"
					style="background: linear-gradient(to top, {appState.backgroundColor} 20%, rgba(255, 255, 255, 0) 100%)"
				></div>
			</div>
		{/if}
	{/if}
</div>
