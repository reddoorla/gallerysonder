<script lang="ts">


	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import ScaleTextToContainer from '$lib/components/ScaleTextToContainer.svelte';

	import { components } from '$lib/slices';
	import { SliceZone } from '@prismicio/svelte';
	


	import S from "$lib/assets/icons/sonderAlphabet/normal/S.svg"
    import O from "$lib/assets/icons/sonderAlphabet/normal/O.svg"
    import N from "$lib/assets/icons/sonderAlphabet/normal/N.svg"
    import D from "$lib/assets/icons/sonderAlphabet/normal/D.svg"
    import E from "$lib/assets/icons/sonderAlphabet/normal/E.svg"
    import R from "$lib/assets/icons/sonderAlphabet/normal/R.svg"
	import Footer from '$lib/components/Footer.svelte';
	import InnerPageNav from '$lib/components/InnerPageNav.svelte';

    import { isIntroFinished } from '$lib/stores/isIntroFinished.js';



	import { fade } from 'svelte/transition';



	export let data;

	let innerWidth:number;

	const IMAGE_ARRAY_WITH_BG_SHIFTS = data.intro.data.images;

	const backgroundScaleInVW = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].scale||100;
    const backgroundLeft = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].left||0;
    const backgroundTop = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].top||0;
	const backgroundImage = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].image.url;


	let percentLoaded = 0.0;


	let isIntroComplete = false;
    let showContent = false;
    let showPresentedArtist = false;
    let showSonderPresents = false;

    let theBottomOfTheTop:HTMLElement;
    let contentContainer:HTMLElement|null;
    let sliceRefs:HTMLElement[]=[];

    let slicesSections:string[]=[];
    data.page.data.slices.forEach((slice)=>slicesSections.push(slice.primary?.sectionLabel || ""))

    let sections:string[] =[];
    data.page.data.sections.forEach((section)=>sections.push(section.section||""))



	let isFixedNavShown = false;
    let isLogoBlack = false;
	let isBackgroundDark = false;



	let imagesToPreload: string[]=[];

	IMAGE_ARRAY_WITH_BG_SHIFTS.forEach((item)=>{
		if(item.image.url)
			imagesToPreload.push(item.image.url);
	});



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
                isIntroComplete = true;
                checkPosition();
                setTimeout(() => showContent = true, 20);
                setTimeout(() => showPresentedArtist = true, 500);
                setTimeout(() => showSonderPresents = true, 1000);
            }
        });

        window.addEventListener('scroll', checkPosition);

        return () => {
   
            unsubscribe();
        };

    });



</script>

<svelte:window bind:innerWidth={innerWidth} />


<div class="background-container">
    <img
      src={backgroundImage}
      class="absolute object-cover {isBackgroundDark ? "blur-sm md:blur-none":""}"
      style={innerWidth > 768 ? "width: "+backgroundScaleInVW+"%; max-width: "+backgroundScaleInVW+"%; left: "+backgroundLeft+"vw; top:"+backgroundTop+"vh" : "height:"+backgroundScaleInVW+"vh; top: -"+((backgroundScaleInVW||0-100)/2||0)+"%;"}
      alt="background"
    />
    <div class="absolute w-screen h-screen transition-opacity duration-700 backdrop-blur md:backdrop-blur-none bg-black  {isBackgroundDark ? 'opacity-45' : 'opacity-0'}" transition:fade />
</div>

<div class="fixed w-screen h-screen-50 bottom-0" >
    <ContentWidth class="h-full flex flex-col justify-end items-start transition-opacity">
        <h5 class="text-white translate-y-[22%] lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow {showSonderPresents&&!isBackgroundDark ? "" : "opacity-0"}">SONDER PRESENTS</h5>
        <ScaleTextToContainer class="transition-opacity duration-500 ease-fast-slow {showPresentedArtist&&!isBackgroundDark ? "":"opacity-0"}">
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >Devon</h1>
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >Dejardin</h1>
        </ScaleTextToContainer>
    </ContentWidth>
</div>

<Nav {isLogoBlack} navProps = {data.nav.data.links}/>

<InnerPageNav {slicesSections} {sections}/>

<div class="flex flex-col" id="content-container" on:scroll={checkPosition}>

    <div class="h-screen" />
    <div class="h-1" bind:this={theBottomOfTheTop}/>

<SliceZone slices={data.page.data.slices} {components} />

<Footer />

</div>



