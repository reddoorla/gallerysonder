<script lang="ts">
    import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";
    import onShowOne from "$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg"
	import { onMount, createEventDispatcher } from "svelte";

    export let src = onShowOne;
    export let href = '#'
    export let text = ""
    export let alt = "gallery image"
    export let subtitle = ""
    export let isHover = false;

    let innerWidth:number;
    let innerHeight:number;

    let insetPercent = 25;
    let linkRef:HTMLElement;

    const checkPosition = () =>{
        const linkTop = linkRef?.getBoundingClientRect().top;

        if(linkRef&&linkTop<=innerHeight&&insetPercent!=5)
            insetPercent = 25 - 25 * ((innerHeight-linkTop)/(innerHeight/2));

        if(insetPercent<5)
            insetPercent=0;

        if(linkRef&&linkTop<=innerHeight&&innerWidth<769){
            insetPercent = 20 * (1-(innerHeight-linkTop)/(innerHeight/2));
        }
    }

    onMount(()=>{
        window.addEventListener('scroll', checkPosition);

    })

    const dispatch = createEventDispatcher();

    function onHover(state: boolean) {
    isHover = state;
    dispatch('hover', isHover);
  }

    

</script>

<style>
    
    .clip-transition{
        transition: clip-path 0.75s ease-in, -webkit-clip-path 0.75s ease-in;
        -webkit-transition: -webkit-clip-path 0.75s ease-in;
        transform: translateZ(1px);
        -webkit-transform: translateZ(1px);
    }
</style>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>

<a bind:this={linkRef} {href} class="flex-grow-0 flex flex-col items-left clip-transition no-underline {$$props.class || ''}"  
    aria-hidden 
    on:mouseenter={() => onHover(true)}
    on:mouseleave={() => onHover(false)}
>
    <img {src} {alt} class="clip-transition use-gpu"  style="{isHover ? "clip-path: inset(0 0 0 0);-webkit-clip-path: inset(0 0 0 0);": "clip-path: inset(0 "+insetPercent+"% 0 "+insetPercent+"%); -webkit-clip-path: inset(0 "+insetPercent+"% 0 "+insetPercent+"%);"}"/>
    {#if innerWidth>768}
    <h6 class="mt-3 text-nowrap transition-opacity use-gpu duration-500 {insetPercent<8 ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}">{text}</h6>
    <span class="mt-2 text-nowrap transition-opacity use-gpu duration-500 {insetPercent<8 ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}">{subtitle}</span>
    <LinkArrowButton text={"EXPLORE"} class="mt-4 translate-x-[1px] transition-opacity duration-500 {isHover ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}"/>
    {:else}
    <LinkArrowButton {text} class="mt-4 translate-x-[1px] transition-opacity duration-500 {insetPercent<8 ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}"/>
    <span class="mt-2 mb-16 text-nowrap transition-opacity use-gpu duration-500 {insetPercent<8 ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}">{subtitle}</span>
    {/if}
</a>