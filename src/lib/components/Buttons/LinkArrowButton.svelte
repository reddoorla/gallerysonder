<script lang="ts">
	import linkArrow from '$lib/assets/icons/sonderArrowRight.svg';
	export let text = '';
	export let href = '';
	export let click = () => {};
	export let opensNewTab = false;

	let isLinkArrowActive = false;
</script>

{#if href}
	<a
		onmouseenter={() => (isLinkArrowActive = true)}
		onmouseleave={() => (isLinkArrowActive = false)}
		onclick={() => {
			isLinkArrowActive = false;
			click();
		}}
		
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {$$props.class ||
			''}"
		target="{opensNewTab?'_blank':""}"
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
			isLinkArrowActive = false;
			click();
		}}
		class="relative flex flex-row items-center text-center no-underline justify-center transition-all duration-300 active:-translate-y-2 w-fit {$$props.class ||
			''}"
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

		/* Button - all caps */
		font-family: 'commuters-sans';
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		line-height: 150%; /* 21px */
		letter-spacing: 1.5px;
		text-transform: uppercase;
	}
</style>
