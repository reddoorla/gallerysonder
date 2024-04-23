<script lang="ts">
    import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";
    import onShowOne from "$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg"
	import { onMount, createEventDispatcher } from "svelte";

    export let src = onShowOne;
    export let href = '#'
    export let text = "AWAITING THE RETURN"
    export let alt = "gallery image"
    export let subtitle = ""
    export let isHover = false;


    let insetPercent = 25;
    let linkRef:HTMLElement;

    const checkPosition = () =>{
        const linkHeight = linkRef?.getBoundingClientRect().top;

        if(linkRef&&linkHeight<=window.innerHeight&&insetPercent!=5)
            insetPercent = 25 - 20 * ((window.innerHeight-linkHeight)/(window.innerHeight/2));

        if(insetPercent<5)
            insetPercent=5;
        console.log("lH: "+linkHeight)
        console.log(insetPercent)
    }

    onMount(()=>{
        window.addEventListener('scroll', checkPosition);
        console.log("vH: "+window.innerHeight)
    })

    const dispatch = createEventDispatcher();

    function onHover(state: boolean) {
    isHover = state;
    dispatch('hover', isHover);
  }

    

</script>

<style>
    .clipOpen{
        clip-path: inset(0 0 0 0);
        -webkit-clip-path: inset(0 0 0 0);
        
    }
    
    .clipClose{
        clip-path: inset(0 5% 0 5%);
        -webkit-clip-path: inset(0 0 0 0);
    }

    .clip-transition{
        transition: clip-path 0.75s ease-in, -webkit-clip-path 0.75s ease-in, ;
    }
</style>

<a bind:this={linkRef} {href} class="flex-grow-0 flex flex-col items-left w-fit h-fit clip-transition no-underline {$$props.class || ''}"  
    aria-hidden 
    on:mouseenter={() => onHover(true)}
    on:mouseleave={() => onHover(false)}
>
    <img {src} {alt} class="clip-transition"  style="{isHover ? "clip-path: inset(0 0 0 0);-webkit-clip-path: inset(0 0 0 0);": "clip-path: inset(0 "+insetPercent+"% 0 "+insetPercent+"%);-webkit-clip-path: inset(0 "+insetPercent+"% 0 "+insetPercent+"%);"}"/>
    <h6 class="mt-3 ml-[5%] text-nowrap transition-opacity duration-500 {insetPercent<9 ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}">{text}</h6>
    <span class="mt-2 ml-[5%] text-nowrap transition-opacity duration-500 {insetPercent<9 ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}">{subtitle}</span>
    <LinkArrowButton text="EXPLORE" class="mt-4 ml-[5%] translate-x-[1px] transition-opacity duration-500 {isHover ? "opacity-100  delay-[750ms]":"opacity-0 pointer-events-none delay-0"}"/>
    
</a>