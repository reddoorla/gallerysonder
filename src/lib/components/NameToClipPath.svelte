<script lang="ts">
    import { fade } from 'svelte/transition';

    import SonderLogoInactive from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"
    import SonderLogoActive from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"


    export let inactiveImage = SonderLogoInactive;
    export let activeImage = SonderLogoActive;
    export let href = "/";
    export let activeBackgroundColor = "inherit"
    export let setBackgroundColor = "inherit"

    let hovered = false;

    $:{
        if(hovered){
            activeBackgroundColor=setBackgroundColor
        } else {
            activeBackgroundColor="inherit"
        }
    }


</script>


<a class="relative w-fit {$$props.class || ''}" 
    on:mouseenter={()=>hovered=true} 
    on:mouseleave={()=>hovered=false}
    on:mouseover
    on:mouseout
    on:focus
    on:blur
    {href}
>


    <img
    src={activeImage}
    alt="sonder logo"
    class="absolute top-0 left-0 translate-x-[1.05%] scale-[1.02] transition-opacity duration-500 {hovered ? "opacity-1" : "opacity-0"} {$$props.class || ''}"

    />

    <img
    src={inactiveImage}
    alt="sonder logo"
    class="{$$props.class || ''}"

    />


    
</a>