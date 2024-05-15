<script lang='ts'>
	import type { NameListSlice } from "../../../prismicio-types";
	import * as prismicHelpers from "@prismicio/helpers"

	import NameRevealOnHover from "$lib/components/NameRevealOnHover.svelte";
	import ContentWidth from "$lib/components/ContentWidth.svelte";
	import LinkArrowButton from "$lib/components/Buttons/LinkArrowButton.svelte";
	
	import { backgroundColor } from "$lib/stores/backgroundColor";

	export let slice:NameListSlice;
</script>

<section class="w-full use-gpu transition-all duration-1000 ease-fast-slow pt-16" id="explore" style="background-color:{$backgroundColor};">
        <ContentWidth class="lg:pl-20 relative flex flex-col gap-16 my-16">

               
                {#each slice.items as item}
					<NameRevealOnHover		 
						activeImage={item.artist_active_image.url||""} 
						on:mouseover={()=>backgroundColor.set(item.artist_color||"#E4EEEA")}
						on:mouseout={()=>backgroundColor.set("#E4EEEA")}   
						href={(prismicHelpers.isFilled.link(item.artist_page) ? item.artist_page.url : "#")} 
						class="h-4 sm:h-6 md:h-10 lg:h-12"
					/>
				{/each}
                
     
            <LinkArrowButton text={slice.primary.bottom_button_text||""} class="mt-16"/>
        </ContentWidth>
       
   
</section>
