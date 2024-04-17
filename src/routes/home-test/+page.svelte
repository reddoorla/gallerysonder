<script lang="ts">
    import  FontAwesomeIcon from 'svelte-fa'
    import { faBars, faPlayCircle, faQuoteLeft, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
	import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';

    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    
    import backgroundImage from "$lib/assets/images/sonderIntroArt/sonderIntroPiece9.jpg";
    import logoExtendedE from "$lib/assets/icons/sonderLogosExtended/SONDER_E.svg"
    
    import onViewTopShape from "$lib/assets/shapes/homePageOnViewTop.svg"
    import onViewBottomShape from "$lib/assets/shapes/homePageOnViewBottom.svg"
    import forthcomingTopShape from "$lib/assets/shapes/homePageForthcomingTop.svg"
    import exploreBottomShape from "$lib/assets/shapes/homePageExploreBottom.svg"
    
    import videoPLaceholderImage from "$lib/assets/images/homeImages/galleryImage.jpg"
    
    import onShowOne from '$lib/assets/images/homeImages/onShow/sonderOnShow1.jpg'
    import onShowTwo from '$lib/assets/images/homeImages/onShow/sonderOnShow2.jpg'
    import onShowThree from '$lib/assets/images/homeImages/onShow/sonderOnShow3.jpg'
    import onShowFour from '$lib/assets/images/homeImages/onShow/sonderOnShow4.jpg'
    import devonSignature from '$lib/assets/signatures/devon-signature.png'

    import forthcomingOne from '$lib/assets/images/homeImages/forthcoming/deniereOne.jpg'
    import forthcomingTwo from '$lib/assets/images/homeImages/forthcoming/deniereTwo.jpg'
    import forthcomingThree from '$lib/assets/images/homeImages/forthcoming/deniereThree.jpg'
    import forthcomingFour from '$lib/assets/images/homeImages/forthcoming/deniereFour.jpg'

    import corriveauStart from '$lib/assets/icons/names/corriveau_inter.svg'
    import cutlerStart from '$lib/assets/icons/names/cutler_inter.svg'
    import dejardinStart from '$lib/assets/icons/names/dejardin_inter.svg'
    import gebbiaStart from '$lib/assets/icons/names/gebbia-richards_inter.svg'
    import jamesStart from '$lib/assets/icons/names/james_inter.svg'

    import corriveauActive from '$lib/assets/icons/names/corriveau_clippath.png'
    import cutlerActive from '$lib/assets/icons/names/cutler_clippath.png'
    import dejardinActive from '$lib/assets/icons/names/dejardin_clippath.png'
    import gebbiaActive from '$lib/assets/icons/names/gebbia-richards_clippath.png'
    import jamesActive from '$lib/assets/icons/names/james_clippath.png'


	import GridImage from '$lib/components/GridImage.svelte';
    import ContentWidth from "$lib/components/ContentWidth.svelte";
    import LinkArrowButton from '$lib/components/LinkArrowButton.svelte';
	import RotatingLogo from '$lib/components/RotatingLogo.svelte';
    import NameToClipPath from '$lib/components/NameToClipPath.svelte';



    const preloadImage = (src: string) => {
        return new Promise<void>((resolve) => {
            let img = new Image();
            img.onload = () => resolve();
            img.src = src;
        });
    };

    let coverImagesPromises: Promise<void>[] = [];
    let imagesToPreload: string[] = [onShowOne, onShowTwo, onShowThree, onShowFour, backgroundImage];

    const createAndResolvePromises = async () => {
        coverImagesPromises = imagesToPreload.map((image) => preloadImage(image));
        return await Promise.all(coverImagesPromises);
    };


    const backgroundScaleInVW = 120;
    const backgroundLeft = -8;
    const backgroundTop = -30;


    let isSectionTop=true;
    let isSectionOnView = false;
    let isSectionForthcoming = false;
    let isSectionExplore =  false;
    let isNavShown = false;
    let isLogoBlack = false;

    let sectionOnViewHat:HTMLElement;
    let sectionOnViewBottom:HTMLElement;
    let sectionForthcomingHat:HTMLElement;
    let sectionForthcomingBottom:HTMLElement;
    let sectionExplore:HTMLElement;

    let corriveauBG="inherit";
    let cutlerBG="inherit";
    let dejardinBG="inherit";
    let gebbiaBG="inherit";
    let jamesBG="inherit";
    let exploreActiveBackgroundColor = "#F2E8D9"

    const checkExploreColor = () => {

        console.log(exploreActiveBackgroundColor)

        if(corriveauBG!="inherit"){
            exploreActiveBackgroundColor=corriveauBG;
        }else if(cutlerBG!="inherit"){
            exploreActiveBackgroundColor=cutlerBG;
        }else if(dejardinBG!="inherit"){
            exploreActiveBackgroundColor=dejardinBG;
        }else if(gebbiaBG!="inherit"){
            exploreActiveBackgroundColor=gebbiaBG;
        }else if(jamesBG!="inherit"){
            exploreActiveBackgroundColor=jamesBG;
        } else{
            exploreActiveBackgroundColor="#F2E8D9";
        }

        
    }

    $: {
  console.log("Updating exploreActiveBackgroundColor:", exploreActiveBackgroundColor);
  if (corriveauBG != "inherit") {
    exploreActiveBackgroundColor = corriveauBG;
  } else if (cutlerBG != "inherit") {
    exploreActiveBackgroundColor = cutlerBG;
  } else if (dejardinBG != "inherit") {
    exploreActiveBackgroundColor = dejardinBG;
  } else if (gebbiaBG != "inherit") {
    exploreActiveBackgroundColor = gebbiaBG;
  } else if (jamesBG != "inherit") {
    exploreActiveBackgroundColor = jamesBG;
  } else {
    exploreActiveBackgroundColor = "#F2E8D9";
  }
}

    

   
const checkPosition = () => {
  const onViewHatTop = sectionOnViewHat?.getBoundingClientRect().top;
  const onViewBottomBottom = sectionOnViewBottom?.getBoundingClientRect().bottom;
  const forthcomingHatTop = sectionForthcomingHat?.getBoundingClientRect().top;
  const forthcomingBottomBottom = sectionForthcomingBottom?.getBoundingClientRect().bottom;
  const exploreHatTop = sectionExplore?.getBoundingClientRect().top;
  const exploreBottomBottom = sectionExplore?.getBoundingClientRect().bottom;

  const viewportHeight = window.innerHeight;

  isSectionTop = onViewHatTop > 0;
  isSectionOnView = onViewHatTop < viewportHeight && onViewBottomBottom > 0;
  isSectionForthcoming = forthcomingHatTop < viewportHeight && forthcomingBottomBottom > viewportHeight;
  isSectionExplore = forthcomingBottomBottom < viewportHeight ;
  isNavShown = (onViewHatTop < 0 && onViewBottomBottom > viewportHeight) || (forthcomingHatTop < 0 && exploreBottomBottom > viewportHeight - 120)
  isLogoBlack = isNavShown;



}
    
onMount(() => {
    window.addEventListener('scroll', checkPosition);
    checkPosition();
  });


  </script>
  
  <style>
    .background-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: -1;
      overflow: hidden;
    }
  
    .content-container {
      position: relative;
      z-index: 1;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;
      /* Add any additional styles for the content container */
    }

    .floating-links{
        color: var(--9-cc-0-bc, #9CC0BC);

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

    h1{
        color: var(--ffffff, #FFF);

font-family: "commuters-sans";
font-size: 160px;
font-style: normal;
font-weight: 700;
line-height: 180px; /* 112.5% */
text-transform: uppercase;
    }
  </style>
  
  <svelte:head>
    <title>Home Test</title>
  </svelte:head>
  {#await createAndResolvePromises()}
    <div class="w-screen h-screen flex justify-center items-center">
        <h1>
            loading
        </h1>
    </div>
  {:then} 
    

  <div class="background-container">
    <img
      src={backgroundImage}
      class="absolute"
      style="width: {backgroundScaleInVW}%; max-width: {backgroundScaleInVW}%; left: {backgroundLeft}vw; top:{backgroundTop}vh"
      alt="background"
    />
  </div>

  <div class="fixed w-screen h-screen-50 bottom-0">
    <ContentWidth class="h-full flex flex-col justify-end items-start transition-opacity {isSectionTop ? "" : "opacity-0"}">
        <h1 class="mb-0 pb-0 translate-y-10">Devin</h1>
        <h1 class="mb-0 pb-0 translate-y-10">Dejardin</h1>

    </ContentWidth>

  </div>

  <div class="w-screen fixed h-24 top-0 py-8 z-30 pointer-events-none">
        <ContentWidth class="flex flex-row justify-between items-center">
            <button class="scale-105 text-white hover:text-accent-pink pointer-events-auto filter-to-accent-pink-on-hover active:invert transition-all {isLogoBlack ? "brightness-0" : ""}">
                <FontAwesomeIcon icon={faBars} size="2x"/>
            </button>
            <a href="/" class="filter-to-accent-pink-on-hover transition-all pointer-events-auto bump brightness-0 {isLogoBlack ? "" : "invert"}">
                <RotatingLogo class="h-6" />
            </a>
        </ContentWidth>
  </div>
  <div class="fixed w-screen h-screen z-30 pointer-events-none">
    <ContentWidth class='h-full relative'>
  
    <div class="absolute top-1/2 -translate-y-4 left-2 -translate-x-1/2 rotate-90 flex flex-row transition-opacity duration-700 ease-fast-slow gap-4 pointer-events-auto {isNavShown?'':'pointer-events-none opacity-0'}">
        <a class="floating-links no-underline" class:active={isSectionOnView} href="#onview" on:click|preventDefault={()=>sectionOnViewHat.scrollIntoView({behavior:'smooth'})}>ON VIEW</a>
        <a class="floating-links no-underline" class:active={isSectionForthcoming} href="#forthcoming" on:click|preventDefault={()=>sectionForthcomingHat.scrollIntoView({behavior:'smooth'})}>FORTHCOMING</a>
        <a class="floating-links no-underline" class:active={isSectionExplore} href="#explore" on:click|preventDefault={()=>sectionExplore.scrollIntoView({behavior:'smooth'})}>EXPLORE</a>
    </div> 
    </ContentWidth>
    </div>


  
  <div class="content-container flex flex-col" on:scroll={checkPosition}>

    <div class="h-screen" />

    <img bind:this={sectionOnViewHat} src={onViewTopShape} aria-hidden alt='non-semantic shape' class="w-full" style="margin-bottom:-40vw" id="onview"/>
    <div id="on-view-start" class="w-full" >
        <ContentWidth class='h-full flex flex-col items-left pl-20'>
            <h5>Devon Desjardin</h5>
            <h3 class='mt-6'>To the garden</h3>
            <h3 class="mb-6">we return</h3>
            <h6 class='mb-6'>03.15 to 05.06.24</h6>
            <LinkArrowButton text="EXPLORE"/>
        </ContentWidth>
        <div class='w-full bg-subtle-primary py-16'>
            <ContentWidth class="pl-20">
                <div class="w-full aspect-video relative pt-16">
                    <img src={videoPLaceholderImage} alt='gallery' class="w-full h-full object-cover"/>
                    <div class="bottom-8 left-8 absolute flex flex-row justify-between gap-8">
                    <button class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faPlayCircle} size="2x"/>
                    </button>
                    <button  class="text-subtle-primary hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faVolumeHigh} size="2x"/>
                    </button>
                    </div>
                </div>
            </ContentWidth>
        </div>
        <div class="w-full bg-subtle-primary pb-16">
            <ContentWidth class="pl-20">
                <h5>Selected Works</h5>
                <div class="w-full flex flex-row flex-wrap">
                    <div class="w-1/2 aspect-square flex justify-start items-center">
                        <GridImage class="ml-10" src={onShowOne} alt="awaiting the return"/>
                    </div>
                    <div class="w-1/2 aspect-square flex justify-end items-center">
                        <GridImage src={onShowTwo} alt="mind body and spirit" text="MIND BODY AND SPIRIT"/>
                    </div>
                    <div class="w-1/2 aspect-square flex justify-start items-center">
                        <GridImage src={onShowThree} alt="in the shadows" text="IN THE SHADOWS"/>
                    </div>
                    <div class="w-1/2 aspect-square flex justify-end items-center">
                        <GridImage src={onShowFour} alt="before the fall" text="BEFORE THE FALL" class="mr-10"/>
                    </div>
                </div>
                <LinkArrowButton text="show more" class="mt-16"/>
            </ContentWidth>

        </div>
    </div>
    <img bind:this={sectionOnViewBottom} src={onViewBottomShape} aria-hidden alt='non-semantic shape' class="w-full z-0 bg-black bg-opacity-45" />
    <div class="bg-black bg-opacity-45 w-full py-12">
        <ContentWidth class="pl-20 flex flex-col justify-center items-center">
            <div class="text-subtle-primary mb-16 mx-16">
                <FontAwesomeIcon icon={faQuoteLeft} size="2x"/>
            </div>
            <div class="mx-16 quote">
                There is something beyond what we see in the human realm in these little windows
            </div>

            <img src={devonSignature} alt="devon signature" class="h-8 mt-16"/>
        </ContentWidth>
    </div>
    <img bind:this={sectionForthcomingHat} src={forthcomingTopShape} aria-hidden alt='non-semantic shape' class="w-full z-0 bg-black bg-opacity-45" id="forthcoming" />
    <div bind:this={sectionForthcomingBottom} class="w-full bg-subtle-primary py-8">
        <ContentWidth class="pl-20">
            <h5 class="mb-8">Forthcoming</h5>
            <div class="w-full flex flex-row flex-wrap">
                <div class="w-1/2 aspect-square flex justify-start items-center">
                    <GridImage class="" src={forthcomingOne} alt="The fall of adam and eve" text="The fall of adam and eve" subtitle="Julia Gould / Opening 08.23.24"/>
                </div>
                <div class="w-1/2 aspect-square flex justify-end items-center">
                    <GridImage src={forthcomingTwo} alt="take it easy" text="take it easy" subtitle="Alex Cutler / Opening 08.23.24"/>
                </div>
                <div class="w-1/2 aspect-square flex justify-start items-center">
                    <GridImage src={forthcomingThree} alt="earthly delights" text="earthly delights" subtitle="Dylan Gebbia-Richards / Opening 08.23.24"/>
                </div>
                <div class="w-1/2 aspect-square flex justify-end items-center">
                    <GridImage src={forthcomingFour} alt="morte ecranique" text="morte ecranique" subtitle="maude corriveau / Opening 08.23.24" class=""/>
                </div>
            </div>

        
            <LinkArrowButton text="all exhibitions" class="mt-16"/>
            <h2 class="font-normal mt-8">Celebrating the Diverse <br /> Stories that Define Us</h2>
        </ContentWidth>
    </div>

    <div bind:this={sectionExplore} class="w-full transition-all duration-1000 ease-fast-slow" id="explore" style="background-color:{exploreActiveBackgroundColor};">
        <ContentWidth class="pl-20">
            <div class="flex flex-col gap-16 my-16">
                <NameToClipPath 
                    inactiveImage={corriveauStart} 
                    activeImage={corriveauActive} 
                    setBackgroundColor="#C1E2FC" 
                    bind:activeBackgroundColor={corriveauBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-10"
                />
                <NameToClipPath 
                    inactiveImage={cutlerStart} 
                    activeImage={cutlerActive} 
                    setBackgroundColor="#E8E9E9" 
                    bind:activeBackgroundColor={cutlerBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-10"
                />
                <NameToClipPath 
                    inactiveImage={dejardinStart} 
                    activeImage={dejardinActive} 
                    setBackgroundColor="#B5D8E2" 
                    bind:activeBackgroundColor={dejardinBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-10"
                />
                <NameToClipPath 
                    inactiveImage={gebbiaStart} 
                    activeImage={gebbiaActive} 
                    setBackgroundColor="#FEF8EC" 
                    bind:activeBackgroundColor={gebbiaBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-10"
                />
                <NameToClipPath 
                    inactiveImage={jamesStart} 
                    activeImage={jamesActive} 
                    setBackgroundColor="#E6CCDC" 
                    bind:activeBackgroundColor={jamesBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}  
                    href="#" 
                    class="h-10"
                />
                
                
            </div>
            <LinkArrowButton text="artists" class="mt-16"/>
        </ContentWidth>
    </div>
    


    <div aria-hidden class="w-full -z-10 bg-black bg-opacity-45 -mt-[40vw] object-cover" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1081" >
            <path class="transition-all duration-1000 ease-fast-slow" d="M-8.40312e-05 645.743L-2.76537e-05 0.859371L1440 0.859497L1440 1080.86C1294.79 870.352 987.176 769.073 431.897 716.51C212.097 696.382 78.5734 676.511 -8.40312e-05 645.743Z" fill={exploreActiveBackgroundColor}/>

          </svg>
    </div>

    <div class="w-full bg-black bg-opacity-45 h-30vw">
        <ContentWidth class="h-full flex flex-col justify-between">
            <div class="pl-20 -mt-[20vw] relative">
                <h2 class="text-white w-2/3">Weaving Together the Stories that Shape Us</h2>
                <LinkArrowButton text="Subscribe to our newsletter" class="brightness-0 invert ml-2 mt-10" />
                <div class="absolute -left-3 top-3 flex flex-col justify-center items-center gap-3">
                    <a href="https://www.instagram.com" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faInstagram} size='2x'/>
                    </a>
                    <a href="https://www.linkedin.com" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faLinkedinIn} size='2x'/>
                    </a>
                    <a href="https://www.twitter.com" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faXTwitter} size='2x'/>
                    </a>
                    <a href="https://www.facebook.com/" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump translate-x-1">
                        <FontAwesomeIcon icon={faFacebookF} size='2x'/>
                    </a>
                </div>
            </div>
            <div class="pl-20 flex flex-row justify-between w-full mb-12">
                <a href="/" class="h-3 ml-2">
                    <img src={logoExtendedE} alt="logo" class="h-full brightness-0 invert"/>
                </a>
                <span class="text-white">©2024  |   All Rights Reserved</span>
            </div>
        </ContentWidth>
    </div>
  </div>
  {/await}