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
{/if}
 