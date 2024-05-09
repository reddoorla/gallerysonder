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
            <a class="w-1/2 pr-16 no-underline" href={(prismicHelpers.isFilled.link(item.link) ? item.link.url : "#")}>
                <img class="w-full aspect-[8/5] object-cover" src={item.image.url} alt={item.title}/>
            </a>
        
            <div class="w-1/2 h-full flex flex-col gap-4">
                <h6>{item.artist_name || ""}</h6>
                <h3>{item.title || ""}</h3>
                <span class="tracking-widest">{item.subtitle}</span>
                <LinkArrowButton  text="explore" href={(prismicHelpers.isFilled.link(item.link) ? item.link.url : "#")}/>
            </div>

        </div>
    {/each}
</div>
{:else}
<div class="w-full flex flex-row flex-wrap {$$props.class || ""}">
    {#each slice.items as item, i (i)} 
        <div class="w-full md:w-1/2 aspect-square use-gpu flex items-center transition duration-700 delay-700 justify-{i%2 == 0 ? "start":"end"} {isHoverArray.some(Boolean) && !isHoverArray[i] && willBlur ? "blur" : ""}">
            <GridImage 
                class="{i%4==0 && !isRegular  ? "ml-10" : ""} {i%3==0 && !isRegular ? "mr-10" : ""}" 
                src={item.image.url||""} 
                text={item.title||""}
                subtitle={(item.artist_name ? item.artist_name +" / "+item.subtitle : item.subtitle||"")}
                alt={item.title||""}
                bind:isHover={isHoverArray[i]}
                on:hover={(event) => handleHover(event, i)}
            />
        </div>
    {/each}
</div>
{/if}