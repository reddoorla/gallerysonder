<script lang="ts">
    import SonderLogoActive from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"

    export let activeImage = SonderLogoActive;
    export let href = "/";

    let viewportWidth:number;
    let viewportHeight:number;

    let active = false;

</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight}/>

<a class="relative transition duration-500 ease-fast-slow w-fit {active ? "" : "brightness-0"} {$$props.class || ''}" 
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
    class={$$props.class || ''}

    />


    
</a>