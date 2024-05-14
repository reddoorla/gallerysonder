<script lang="ts">
	import { onMount } from "svelte";
    import ContentWidth from "./ContentWidth.svelte";

    let sliceRefs:HTMLElement[];
    export let sections:string[]=[];
    export let slicesSections:string[];

    let fixedNav:HTMLElement;

    let isFixedNavShown = false;
    let activeSection = "";

    const findTopOfSection = (section:string) => {
        for( let i = 0 ; i < sliceRefs.length ; i++ ){
            if(slicesSections[i]===section)
                return sliceRefs[i];
        }

        console.log('find top of section error looking for '+section)
        return sliceRefs[0];
    }

    const checkPosition = () => {
        activeSection=slicesSections[sliceRefs.findIndex((slice)=>slice.getBoundingClientRect().bottom > window.innerHeight/2)]
        isFixedNavShown = (fixedNav?.getBoundingClientRect().top>sliceRefs[0]?.getBoundingClientRect().top) && (fixedNav?.getBoundingClientRect().bottom<sliceRefs[sliceRefs.length-1]?.getBoundingClientRect().bottom)
    }

    onMount(()=>{
        let contentContainer = document.getElementById('content-container');
        sliceRefs=[...contentContainer?.getElementsByTagName('section') ?? []];
        
        window.addEventListener('scroll', checkPosition);


    })
</script>

<style>
   

    .floating-links{
        color: #B8CCCA;

        font-feature-settings: 'clig' off, 'liga' off;

        /* Button - all caps */
        font-family: "commuters-sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 150%; /* 21px */
        letter-spacing: 1.5px;
        text-transform: uppercase;
    }

    .floating-links.active{
        color: #E8587C;
    }

    .floating-links:hover{
        color: #E8587C;
        opacity: 0.8;
    }

    .floating-links:active{
        color: #E8587C;
        opacity: 1;
    }
    </style>

<div class="fixed w-screen h-screen z-30 pointer-events-none opacity-0 lg:opacity-100">
    <ContentWidth class='h-full relative pointer-events-none' >
        <div bind:this={fixedNav} class="absolute top-1/2 -translate-y-4 -lef-0 -translate-x-1/2 rotate-90 flex flex-row gap-4 transition  {isFixedNavShown?'pointer-events-auto transition-opacity':'pointer-events-none opacity-0'}">
            {#each sections as section, i (i)}
                <a 
                    class="floating-links no-underline uppercase 
                    {isFixedNavShown?'':'pointer-events-none'}" 
                    class:active={section===activeSection} 
                    href="#{section}" 
                    on:click|preventDefault={()=>findTopOfSection(section).scrollIntoView({behavior:'smooth'})}
                >
                    {section}
                </a>
            {/each}
        </div> 
    </ContentWidth>
</div>