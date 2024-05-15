<script lang='ts'>
    import { fade, slide } from "svelte/transition"

    import type { NavDocumentDataLinksItem } from "../../prismicio-types";
    import * as prismicH from '@prismicio/helpers'

    import ContentWidth from "./ContentWidth.svelte";
    import RotatingLogo from "./RotatingLogo.svelte";
    import NameRevealOnHover from "./NameRevealOnHover.svelte";
    import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";

    import { backgroundColor } from "$lib/stores/backgroundColor";


    export let isLogoBlack:boolean;
    export let navProps:NavDocumentDataLinksItem[];
    
    let showNav = false;



</script>

<div class=" w-screen fixed h-24 top-0 py-8 z-50 pointer-events-none {!showNav ? "mix-blend-difference":"mix-blend-normal"} " transition:fade={{ duration: 300 }}>
    <ContentWidth class="flex flex-row justify-between items-center">
        <button class="scale-105 text-white hover:text-accent-pink hover:mix-blend-normal pointer-events-auto filter-to-accent-pink-on-hover active:invert transition-all {isLogoBlack||showNav ? "brightness-0" : ""}" on:click={()=>showNav = !showNav}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20ZM20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H20ZM3 7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44772 3 7Z" fill="white"/>                        
            </svg>
        </button>
        <a href="/" class="filter-to-accent-pink-on-hover transition-colors pointer-events-auto bump brightness-0 hover:mix-blend-normal {isLogoBlack||showNav ? "" : "invert"}">
            <RotatingLogo class="h-6" />
        </a>
    </ContentWidth>
</div>

{#if showNav}
<div class="h-screen w-screen fixed top-0 left-0 z-40 transition ease-fast-slow" style="background-color:{$backgroundColor}" transition:slide>
  <ContentWidth class="flex flex-col gap-12 lg:gap-20 pb-16 pt-48 justify-start h-full relative">

      <div class="absolute  md:flex-col justify-center items-center gap-4 hidden md:flex translate-y-1">
          <a href="https://www.instagram.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
            <i class="fa-brands fa-instagram fa-2xl"></i>
          </a>
          <a href="https://www.linkedin.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
            <i class="fa-brands fa-linkedin-in fa-2xl"></i>
          </a>
          <a href="https://www.twitter.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
            <i class="fa-brands fa-x-twitter fa-2xl"></i>
          </a>
          <a href="https://www.facebook.com/" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump translate-x-1 scale-75">
            <i class="fa-brands fa-facebook-f fa-2xl"></i>
          </a>
      </div>
    {#each navProps as link}
  
    <NameRevealOnHover 
      activeImage={link.active_link.url||""} 
      on:mouseover={()=>backgroundColor.set(link.active_color||"#E4EEEA")}
      on:mouseout={()=>backgroundColor.set("#E4EEEA")}   
      href={(prismicH.isFilled.link(link.link) ? link.link.url : "#")} 
      class="ml-12 h-4 sm:h-6 md:h-10 lg:h-12"
     />
  {/each}



  <LinkArrowButton class="ml-24" href="" text="Subscribe to our newsletter"/>
  
  </ContentWidth>
</div>
{/if}
