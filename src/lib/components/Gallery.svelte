<script lang="ts">
    import type { ImageGallerySlice } from "../../prismicio-types";
    import GridImage from "./GridImage.svelte";
    import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";
    import * as prismicHelpers from "@prismicio/helpers"



    export let slice:ImageGallerySlice;

    export let willBlur = false;
    export let isRegular = true;
    export let isList = false;

    let isHoverArray= new Array(slice.items.length).fill(false);
    let viewportWidth=1024;
    

function handleHover(event: CustomEvent<boolean>, index: number) {
  isHoverArray[index] = event.detail;
}

</script>
<svelte:window bind:innerWidth={viewportWidth} />

{#if isList&& viewportWidth>768}
<div class="w-full flex flex-col gap-16 mb-8">
    {#each slice.items as item, i (i)}
        <div class="flex flex-row no-underline">
            <button class="w-1/2 pr-16 no-underline pointer-events-none">
                <GridImage class="w-full aspect-[8/5]" src={item.image.url||""} alt={item.piece_title||""}/>
            </button>
        
            <div class="w-1/2 h-full flex flex-col gap-4">
                <h6>{item.artist_name || ""}</h6>
                <h3>{item.piece_title || ""}</h3>
                <span class="tracking-widest">{item.piece_subtitle}</span>
                <LinkArrowButton  text="explore" href={(prismicHelpers.isFilled.link(item.link) ? item.link.url : "#")}/>
            </div>

        </div>
    {/each}
</div>
{:else}
<div class="w-full flex flex-row flex-wrap {$$props.class || ""}">
    {#each slice.items as item, i (i)} 
        <div class="w-full md:w-1/2 p-6 xl:p-10 use-gpu flex items-end transition duration-700 delay-700 justify-center relative {isHoverArray.some(Boolean) && !isHoverArray[i] && willBlur ? "blur" : ""}">
            <GridImage 
                class="{(i%4==0||i%3==0) && !isRegular  ? "w-11/12" : "w-9/12"}" 
                src={item.image.url||""} 
                text={item.piece_title||""}
                subtitle={(item.artist_name ? item.artist_name +" / "+item.piece_subtitle : item.piece_subtitle||"")}
                alt={item.piece_title||""}
                bind:isHover={isHoverArray[i]}
                on:hover={(event) => handleHover(event, i)}
            />
        </div>
    {/each}
</div>
{/if}