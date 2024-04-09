<script lang="ts">
    import LinkArrowButton from "./LinkArrowButton.svelte";
    import onShowOne from "$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg"

    export let src = onShowOne;
    export let href = '#'
    export let text = "AWAITING THE RETURN"
    export let alt = "gallery image"
    export let subtitle = ""
   
    let isHover = false;
    

</script>

<style>
    .clipOpen{
        clip-path: inset(0 0 0 0);
        
    }
    
    .clipClose{
        clip-path: inset(0 5% 0 5%);
    }

    .clip-transition{
        
        transition: clip-path 0.75s ease-in;
    }
</style>

<a {href} class="flex-grow-0 flex flex-col items-left w-fit h-fit clip-transition no-underline {$$props.class || ''}"  aria-hidden on:mouseenter={()=>isHover=true} on:mouseleave={()=>isHover=false}>
    <img {src} {alt} class="clip-transition  {isHover ? "clipOpen" : "clipClose"}"/>
    <LinkArrowButton {text} class="mt-4 transition-opacity duration-500 {isHover ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}"/>
    <span class="mt-2 transition-opacity duration-500 {isHover ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}">{subtitle}</span>
</a>