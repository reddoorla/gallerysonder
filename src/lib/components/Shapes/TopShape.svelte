<script lang='ts'>
    import { backgroundColor } from "$lib/stores/backgroundColor";

    let viewportWidth:number;

    export let shapeNumber = "0";
</script>

<svelte:window bind:innerWidth={viewportWidth} />

{#if shapeNumber === "0"}
<div />
{:else if shapeNumber === "1"}
<svg class="w-screen" xmlns="http://www.w3.org/2000/svg"viewBox="0 0 1440 946" style={viewportWidth>768 ? "margin-bottom:-40vw":"margin-bottom:-25vw"}>
    <path d="M0 946V0C0 119.057 88.2714 156.271 500.067 193.896C1244.87 264.342 1514.09 428.714 1542 852.622V946H0Z" fill={$backgroundColor}/>
</svg>
{:else if shapeNumber === "2"}
<svg class="w-screen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 214" fill="none">
    <path d="M-70 -27.1159L-69.9999 -542.084L2012 -542.084L2012 98.0816C1816.53 174.725 1543.66 213.916 1195.42 213.916C678.079 213.916 253.735 130.986 -69.8142 -27.1159L-70 -27.1159Z" fill={$backgroundColor}/>
</svg>
{:else if shapeNumber === "3"}
<svg xmlns="http://www.w3.org/2000/svg" class="w-screen transition-all duration-1000 ease-fast-slow" viewBox="-518 0 1968 714" style="margin-bottom:-26vw">
    <path d="M1450 143.557V714.277H-518V174.008C-320.779 59.0298 -5.64624 0.277344 422.66 0.277344C821.314 0.277344 1165.05 49.1745 1450 143.557Z" fill="{$backgroundColor}"/>
  </svg>
{/if}
 
