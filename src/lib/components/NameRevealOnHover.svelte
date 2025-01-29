<script lang="ts">
	import { goto } from "$app/navigation";
    import SonderLogoActive from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"

    export let activeImage = SonderLogoActive;
    export let href = "/";
    export let click = ()=>{};

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
    on:click={()=>{goto(href);click(); }}
    {href}
>


    <img
    src={activeImage}
    alt="link to name"
    class={$$props.class || ''}

    />


    
</a>