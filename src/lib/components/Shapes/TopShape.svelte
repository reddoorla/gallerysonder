<script lang="ts">
	import { backgroundColor } from '$lib/stores/backgroundColor';

	let viewportWidth: number;

	export let shapeNumber = '0';
</script>

<svelte:window bind:innerWidth={viewportWidth} />


{#if shapeNumber === '1'}
<svg fill="none" viewBox="0 22.704 1324.5729303547962 416.24" xmlns="http://www.w3.org/2000/svg" class="use-gpu w-screen transition-all duration-1000 -mb-[120px] md:-mb-[240px] lg:-mb-[400px] xl:-mb-[600px] xxl:-mb-[800px]">
	<path fill={$backgroundColor} class="transition-all duration-1000 use-gpu" d="M0 946V0C0 119.057 88.2714 156.271 500.067 193.896C1244.87 264.342 1514.09 428.714 1542 852.622V946H0Z"/>
  </svg>
{:else if shapeNumber === '2'}
	<svg
		class="use-gpu w-screen transition-all duration-1000 "
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 1440 214"
		fill="none"
	>
		<path
			d="M-70 -27.1159L-69.9999 -542.084L2012 -542.084L2012 98.0816C1816.53 174.725 1543.66 213.916 1195.42 213.916C678.079 213.916 253.735 130.986 -69.8142 -27.1159L-70 -27.1159Z"
			fill={$backgroundColor}
			class="transition-all duration-1000 use-gpu"
		/>
	</svg>
{:else if shapeNumber === '3'}
<svg  viewBox="-518 0 1968 206.5289256198347" xmlns="http://www.w3.org/2000/svg" class="use-gpu w-screen transition-all duration-1000  -mb-24">
	<path fill={$backgroundColor} class="transition-all duration-1000 use-gpu" d="M1450 143.557V714.277H-518V174.008C-320.779 59.0298 -5.64624 0.277344 422.66 0.277344C821.314 0.277344 1165.05 49.1745 1450 143.557Z"/>
</svg>
{:else if shapeNumber === '4'}
	
<svg class="use-gpu w-screen transition-all duration-1000  md:-mb-[320px] -mb-[60px] lg:-mb-[320px] xl:-mb[500px] xxl:-mb-[600px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 259.4548302872063 1200 250.7388825065274" fill="none">
	<path fill={$backgroundColor} class="transition-all duration-1000 use-gpu" d="M-563 1384V0C-563 174.18 -433.913 228.624 168.292 283.671C1257.49 386.732 1651.18 627.21 1692 1247.39V1384H-563Z"/>
</svg>
{:else if shapeNumber === '5'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 1440 245"
		fill="none"
		class=" w-screen   -mb-[60px] md:-mb-[120px]  lg:-mb-[200px] xl:-mb[240px] xxl:-mb-[320px]"
	>
		<path
			d="M-51 129.383V807H1553V587.649C1553 201.215 1251.96 0 671.343 0C394.19 0 152.646 44.1272 -50.8569 129.383H-51Z"
			fill={$backgroundColor}
			class="transition-all duration-1000 use-gpu"
		/>
	</svg>
{:else if shapeNumber === '6'}

		<svg fill="none" viewBox="0 0 1429.8387096774193 196.02" xmlns="http://www.w3.org/2000/svg" class="use-gpu w-screen transition-all duration-1000  -mb-[60px] md:-mb-[120px]  lg:-mb-[200px] xl:-mb[240px] xxl:-mb-[320px]">
			<path fill={$backgroundColor} class="transition-all duration-1000 use-gpu" d="M1440 145.592V725.521H0V176.534C144.308 59.7004 374.893 0 688.288 0C979.986 0 1231.5 49.6862 1440 145.592Z"/>
		  </svg>
	 
{/if}
