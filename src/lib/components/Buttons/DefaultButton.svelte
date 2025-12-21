<script lang="ts">
	let {
		text = 'BUTTON',
		onclick = () => {},
		class: className = '',
		filled = true
	}: {
		text?: string;
		onclick?: () => void;
		class?: string;
		filled?: boolean;
	} = $props();
</script>

<button
	{onclick}
	class="{filled
		? 'bg-primary-light bg-opacity-80 hover:bg-opacity-100 active:bg-dark-primary  text-black'
		: 'hover:bg-dark-primary text-dark hover:text-white active:bg-black '} border-2 border-dark-primary w-full md:w-auto text-center mb-5 sm:mb-0 uppercase cursor-pointer text-nowrap transition-all duration-300 active:-translate-y-2 {className}"
>
	{text}
</button>

<style>
	button {
		display: inline-flex;
		height: 40px;
		padding: 13px 30px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}
</style>
