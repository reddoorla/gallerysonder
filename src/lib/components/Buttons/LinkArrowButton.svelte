<script lang="ts">
	import linkArrow from '$lib/assets/icons/sonderArrowRight.svg';

	let {
		text = '',
		href = '',
		onclick = () => {},
		opensNewTab = false,
		disabled = false,
		class: className = ''
	}: {
		text?: string;
		href?: string;
		onclick?: () => void;
		opensNewTab?: boolean;
		disabled?: boolean;
		class?: string;
	} = $props();

	let isLinkArrowActive = $state(false);
</script>

{#if href}
	<a
		onmouseenter={() => (isLinkArrowActive = true)}
		onmouseleave={() => (isLinkArrowActive = false)}
		onclick={() => {
			isLinkArrowActive = false;
			onclick();
		}}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {className}"
		target={opensNewTab ? '_blank' : ''}
		{href}
	>
		<span class="h-5 uppercase no-underline">{text}</span>
		<img
			src={linkArrow}
			alt="link arrow"
			class="h-5 w-5 ml-[10px] transition-transform duration-300 {isLinkArrowActive
				? 'translate-x-2'
				: ''}"
		/>
		<div class="absolute h-[1.5px] bg-black w-5 top-[9px] right-1"></div>
	</a>
{:else}
	<button
		onmouseenter={() => (isLinkArrowActive = true)}
		onmouseleave={() => (isLinkArrowActive = false)}
		onclick={() => {
			if (disabled) return;
			isLinkArrowActive = false;
			onclick();
		}}
		{disabled}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed {className}"
	>
		<span class="h-5 uppercase no-underline">{text}</span>
		<img
			src={linkArrow}
			alt="link arrow"
			class="h-5 w-5 ml-[10px] transition-transform duration-300 {isLinkArrowActive
				? 'translate-x-2'
				: ''}"
		/>
		<div class="absolute h-[1.5px] bg-black w-5 top-[9px] right-1"></div>
	</button>
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
