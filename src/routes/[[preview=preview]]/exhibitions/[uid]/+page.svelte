<script lang="ts">


	import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';
	import Nav from '$lib/components/Nav.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import ScaleTextToContainer from '$lib/components/ScaleTextToContainer.svelte';

	import { components } from '$lib/slices';
	import { PrismicImage, SliceZone } from '@prismicio/svelte';

	import Footer from '$lib/components/Footer.svelte';
	import InnerPageNav from '$lib/components/InnerPageNav.svelte';

    import { isIntroFinished } from '$lib/stores/isIntroFinished.js';



	import { fade } from 'svelte/transition';



	export let data;


    let content = data.page.data;


	let viewportWidth:number;
    let viewportHeight:number;





	let isIntroComplete = false;

    let showPresentedArtist = false;
    let showSonderPresents = false;

    let theBottomOfTheTop:HTMLElement;
    let contentContainer:HTMLElement|null;
    let sliceRefs:HTMLElement[]=[];

    let slicesSections:string[]=[];
    data.page.data.slices.forEach((slice)=>slicesSections.push(slice.primary?.sectionLabel || ""))

    let sections:string[] =[];
    data.page.data.sections.forEach((section)=>sections.push(section.section||""))



    let isLogoBlack = false;
	let isBackgroundDark = false;




	const checkPosition = () => {

        if(theBottomOfTheTop&&theBottomOfTheTop.getBoundingClientRect().bottom<0){
            isBackgroundDark=true;
        } else {
            isBackgroundDark=false;
        }


	};

    



	onMount(() => {
        const unsubscribe = isIntroFinished.subscribe(value => {
            if (value) {
                checkPosition();
                setTimeout(() => showPresentedArtist = true, 500);
                setTimeout(() => showSonderPresents = true, 1000);
            }
        });

        window.addEventListener('scroll', checkPosition);

        return () => {
   
            unsubscribe();
        };

    });

    afterNavigate(() => {
    data = { ...data };
    content = data.page.data
    slicesSections=[];
    sections=[];
    data.page.data.slices.forEach((slice)=>slicesSections.push(slice.primary?.sectionLabel || ""))
    data.page.data.sections.forEach((section)=>sections.push(section.section||""))
  });




</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

<div class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip min-h-full min-w-full aspect-video fixed -z-10">
			
    <img src={content.background_image.url} alt={content.background_image.alt}  class="absolute bottom-0 left-0 h-full w-full object-cover -z-10"/>
    <div class="absolute w-screen h-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 backdrop-blur md:backdrop-blur-none bg-black  {isBackgroundDark ? 'opacity-55' : 'opacity-20'}" transition:fade />

</div>


<!-- <div class="background-container">
    <PrismicImage
      field={data.page.data.background_image}
      class="absolute object-cover  {isBackgroundDark ? "blur-sm md:blur-none":""}"

    />
    </div> -->

<div class="fixed w-screen h-screen-50 bottom-0" >
    <ContentWidth class="h-full flex flex-col justify-center items-start transition-opacity {!isBackgroundDark&& showSonderPresents? "" : "opacity-0"}">
 
            <span class="text-white translate-y-[22%] lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow {showSonderPresents&&!isBackgroundDark ? "" : "opacity-0"}">{content.dates||''}</span>
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >{content.title_line_one||''}</h1>
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >{content.title_line_two||''}</h1>
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >{content.title_line_three||''}</h1>
       
    </ContentWidth>
</div>


<InnerPageNav {slicesSections} {sections}/>


<div class="flex flex-col" id="content-container" on:scroll={checkPosition}>

    <div class="h-screen mb-[40vw]" />
    <div class="h-1" bind:this={theBottomOfTheTop}/>

<SliceZone slices={data.page.data.slices} {components} />

<Footer />

</div>



