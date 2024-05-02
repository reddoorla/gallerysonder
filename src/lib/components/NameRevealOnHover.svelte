<script lang="ts">
    import { fade } from 'svelte/transition';

    import SonderLogoInactive from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"
    import SonderLogoActive from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"
	import { onMount } from 'svelte';



    export let activeImage = SonderLogoActive;
    export let href = "/";
    export let activeBackgroundColor = "inherit"
    export let setBackgroundColor = "inherit"

    let linkRef:HTMLElement;
    let viewportWidth:number;
    let viewportHeight:number;

    let active = false;

    $:{
        if(active){
            activeBackgroundColor=setBackgroundColor
        } else {
            activeBackgroundColor="inherit"
        }
    }



</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight}/>

<a bind:this={linkRef} class="relative transition duration-500 ease-fast-slowb w-fit {active ? "" : "brightness-0"} {$$props.class || ''}" 
    on:mouseenter={()=>active=true} 
    on:mouseleave={()=>active=false}
    on:mouseover
    on:mouseout
    on:focus
    on:blur
    {href}
>


    <img
    src={activeImage}
    alt="link to name"
    class="translate-x-[1.05%] scale-[1.02] {$$props.class || ''}"

    />


    
</a>