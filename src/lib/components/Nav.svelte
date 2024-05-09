<script lang='ts'>
    import { fade, slide } from "svelte/transition"

    import  FontAwesomeIcon from 'svelte-fa'
	import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';
    import type { NavDocumentDataLinksItem } from "../../prismicio-types";
    import * as prismicH from '@prismicio/helpers'

    import ContentWidth from "./ContentWidth.svelte";
    import RotatingLogo from "./RotatingLogo.svelte";
    import NameRevealOnHover from "./NameRevealOnHover.svelte";
    import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";


    export let isLogoBlack:boolean;
    export let navProps:NavDocumentDataLinksItem[];
    
    let showNav = false;
    let backgroundColor="#E4EEEA";
    let activatedBackgroundColor="inherit";

    let navTopItem:HTMLElement;

    const checkColor = () => {
        setTimeout(()=>{
        if(activatedBackgroundColor==="inherit"){
            backgroundColor="#E4EEEA"
        }else{
            backgroundColor=activatedBackgroundColor;
        }},5);
    }
</script>

<div class=" w-screen fixed h-24 top-0 py-8 z-50 pointer-events-none" transition:fade={{ duration: 300 }}>
    <ContentWidth class="flex flex-row justify-between items-center">
        <button class="scale-105 text-white hover:text-accent-pink pointer-events-auto filter-to-accent-pink-on-hover active:invert transition-all {isLogoBlack||showNav ? "brightness-0" : ""}" on:click={()=>showNav = !showNav}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20ZM20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H20ZM3 7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44772 3 7Z" fill="white"/>                        
            </svg>
        </button>
        <a href="/" class="filter-to-accent-pink-on-hover transition-colors pointer-events-auto bump brightness-0 {isLogoBlack||showNav ? "" : "invert"}">
            <RotatingLogo class="h-6" />
        </a>
    </ContentWidth>
</div>

{#if showNav}
<div class="h-screen w-screen fixed top-0 left-0 z-40 transition ease-fast-slow" style="background-color: {backgroundColor}" transition:slide>
  <ContentWidth class="flex flex-col gap-12 lg:gap-20 pb-16 justify-end h-full relative">

      <div class="absolute -left-24 md:flex-col justify-center items-center gap-4 hidden xl:flex lg:bottom-[564px] md:bottom-[524px]">
          <a href="https://www.instagram.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
              <FontAwesomeIcon icon={faInstagram} size='2x'/>
          </a>
          <a href="https://www.linkedin.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
              <FontAwesomeIcon icon={faLinkedinIn} size='2x'/>
          </a>
          <a href="https://www.twitter.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
              <FontAwesomeIcon icon={faXTwitter} size='2x'/>
          </a>
          <a href="https://www.facebook.com/" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump translate-x-1 scale-75">
              <FontAwesomeIcon icon={faFacebookF} size='2x'/>
          </a>
      </div>
    {#each navProps as link}
  
    <NameRevealOnHover 
      activeImage={link.active_link.url||""} 
      setBackgroundColor={link.active_color||"white"}
      bind:activeBackgroundColor={activatedBackgroundColor} 
      on:mouseover={checkColor}
      on:mouseout={checkColor}   
      href={(prismicH.isFilled.link(link.link) ? link.link.url : "#")} 
      class="h-4 sm:h-6 md:h-10 lg:h-12"
     />
  {/each}



  <LinkArrowButton href="" text="Subscribe to our newsletter"/>
  
  </ContentWidth>
</div>
{/if}
