<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDown } from '@lucide/svelte';

	let {
		value = $bindable(''),
		options = [],
		placeholder = 'Select…',
		ariaLabel = '',
		class: className = ''
	}: {
		value?: string;
		options?: { value: string; label: string }[];
		placeholder?: string;
		ariaLabel?: string;
		class?: string;
	} = $props();

	let open = $state(false);
	let container = $state<HTMLDivElement | undefined>(undefined);

	const selectedLabel = $derived(options.find((o) => o.value === value)?.label ?? '');

	function choose(v: string) {
		value = v;
		open = false;
	}

	// Close on outside click / Escape while open.
	$effect(() => {
		if (!open) return;

		const onDocClick = (e: MouseEvent) => {
			if (container && !container.contains(e.target as Node)) open = false;
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};

		document.addEventListener('click', onDocClick);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('click', onDocClick);
			document.removeEventListener('keydown', onKey);
		};
	});
</script>

<div bind:this={container} class="relative w-full mb-4 {className}">
	<button
		type="button"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label={ariaLabel || undefined}
		onclick={() => (open = !open)}
		class="w-full border-1 border-mid p-2 bg-white/40 rounded-xs text-left flex items-center justify-between gap-2 cursor-pointer"
	>
		<span class={value ? '' : 'text-black/50'}>{selectedLabel || placeholder}</span>
		<ChevronDown
			class="size-[1em] transition-transform duration-200 {open ? 'rotate-180' : ''}"
			strokeWidth={1.5}
		/>
	</button>

	{#if open}
		<ul
			transition:slide={{ duration: 200 }}
			role="listbox"
			class="absolute top-full left-0 right-0 z-20 mt-1 bg-white border-1 border-mid rounded-xs overflow-hidden shadow-[0_8px_32px_rgba(156,192,188,0.3)]"
		>
			{#each options as option (option.value)}
				<li role="option" aria-selected={option.value === value}>
					<button
						type="button"
						onclick={() => choose(option.value)}
						class="w-full text-left p-2 cursor-pointer transition-colors {option.value === value
							? 'bg-black text-white'
							: 'hover:bg-mid-primary'}"
					>
						{option.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* Match the text inputs (app.css: `p, input, textarea, form button`) rather than the
	   global commuters-sans button style, so the trigger and options read as form fields. */
	button {
		font-family: 'rig-sans';
		font-size: 18px;
		font-weight: 400;
		line-height: 150%;
		letter-spacing: 0.25px;
		text-transform: none;
	}
</style>
