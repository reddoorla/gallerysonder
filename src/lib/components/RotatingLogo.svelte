<script lang="ts">
  
    import sonderS from "$lib/assets/icons/sonderAlphabet/normal/S.svg"
    import logoExtendedO from "$lib/assets/icons/sonderAlphabet/extended/SONDER_O.svg"
    import logoExtendedN from "$lib/assets/icons/sonderAlphabet/extended/SONDER_N.svg"
    import logoExtendedD from "$lib/assets/icons/sonderAlphabet/extended/SONDER_D.svg"
    import logoExtendedE from "$lib/assets/icons/sonderAlphabet/extended/SONDER_E.svg"
    import logoExtendedR from "$lib/assets/icons/sonderAlphabet/extended/SONDER_R.svg"

    import { fade } from 'svelte/transition';

	import { onMount } from "svelte";

    let innerWidth:number;
    const logoArray = [logoExtendedO, logoExtendedN, logoExtendedD, logoExtendedE, logoExtendedR]

    let activeLogoIndex = 0;


    onMount(()=>{
            setInterval(()=>{
                    if(activeLogoIndex<logoArray.length-1&&innerWidth>768){
                        activeLogoIndex++;
                    }else{
                        activeLogoIndex = 0;
                    }


                },4000)
                
               
        }
        
    )
</script>
<svelte:window bind:innerWidth={innerWidth} />
<div class="relative {$$props.class || ''}">
{#key activeLogoIndex}
<img
    src={innerWidth>768?logoArray[activeLogoIndex]:sonderS}
    alt="sonder logo"
    class={$$props.class || ''}
    in:fade={{duration:400, delay:400}}
    out:fade={{duration:400}}
/>
{/key}
    <img
        src={logoArray[activeLogoIndex]}
        alt="sonder logo"
        class="absolute top-0 left-0 hidden md:flex {$$props.class || ''}"
    />
</div>


