<script lang="ts">
    import logo from "$lib/assets/icons/sonderBaseLogo.svg"
    import logoExtendedO from "$lib/assets/icons/sonderLogosExtended/SONDER_O.svg"
    import logoExtendedN from "$lib/assets/icons/sonderLogosExtended/SONDER_N.svg"
    import logoExtendedD from "$lib/assets/icons/sonderLogosExtended/SONDER_D.svg"
    import logoExtendedE from "$lib/assets/icons/sonderLogosExtended/SONDER_E.svg"
    import logoExtendedR from "$lib/assets/icons/sonderLogosExtended/SONDER_R.svg"

    import { fade } from 'svelte/transition';

	import { onMount } from "svelte";

    const logoArray = [logoExtendedO, logoExtendedN, logoExtendedD, logoExtendedE, logoExtendedR]

    let activeLogoIndex = 0;


    onMount(()=>{
            let logoInterval = setInterval(()=>{
                    if(activeLogoIndex<logoArray.length-1){
                        activeLogoIndex++;
                    }else{
                        activeLogoIndex = 0;
                    }
                },4000)
                
               
        }
        
    )
</script>
<div class="relative {$$props.class || ''}">
{#key activeLogoIndex}
<img
    src={logoArray[activeLogoIndex]}
    alt="sonder logo"
    class={$$props.class || ''}
    in:fade={{duration:400, delay:400}}
    out:fade={{duration:400}}
/>
{/key}
    <img
        src={logoArray[activeLogoIndex]}
        alt="sonder logo"
        class="absolute top-0 left-0  {$$props.class || ''}"
    />
</div>


