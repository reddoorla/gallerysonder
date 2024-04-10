<script lang="ts">
    import { FontAwesomeIcon} from '@fortawesome/svelte-fontawesome'
    import { faBars, faPlayCircle, faQuoteLeft, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
	import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';

    import { onMount } from 'svelte';
    
    import backgroundImage from "$lib/assets/images/sonderIntroArt/sonderIntroPiece9.jpg";
    import logo from "$lib/assets/icons/sonderBaseLogo.svg"
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

	import GridImage from '$lib/components/GridImage.svelte';
    import ContentWidth from "$lib/components/ContentWidth.svelte";
    import LinkArrowButton from '$lib/components/LinkArrowButton.svelte';
	import RotatingLogo from '$lib/components/RotatingLogo.svelte';


 


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
    

   
const checkPosition = () => {
  const onViewHatTop = sectionOnViewHat?.getBoundingClientRect().top;
  const onViewBottomBottom = sectionOnViewBottom?.getBoundingClientRect().bottom;
  const forthcomingHatTop = sectionForthcomingHat?.getBoundingClientRect().top;
  const forthcomingBottomBottom = sectionForthcomingBottom?.getBoundingClientRect().bottom;
  const exploreHatTop = sectionExplore?.getBoundingClientRect().top;
  const exploreBottomBottom = sectionExplore.getBoundingClientRect().bottom;

  const viewportHeight = window.innerHeight;

  isSectionTop = onViewHatTop > 0;
  isSectionOnView = onViewHatTop < viewportHeight && onViewBottomBottom > 0;
  isSectionForthcoming = forthcomingHatTop < viewportHeight && forthcomingBottomBottom > viewportHeight;
  isSectionExplore = forthcomingBottomBottom < viewportHeight ;
  isNavShown = (onViewHatTop < 0 && onViewBottomBottom > viewportHeight) || (forthcomingHatTop < 0 && exploreBottomBottom > viewportHeight - 120)
  isLogoBlack = isNavShown;

  console.log(forthcomingBottomBottom);


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
  
  <div class="background-container">
    <img
      src={backgroundImage}
      class="absolute"
      style="width: {backgroundScaleInVW}%; max-width: {backgroundScaleInVW}%; left: {backgroundLeft}vw; top:{backgroundTop}vh"
      alt="background"
    />
  </div>

  <div class="fixed w-screen h-screen-50 bottom-0">
    <ContentWidth class="h-full flex flex-col justify-center items-start transition-opacity {isSectionTop ? "" : "opacity-0"}">
        <h1>Devin</h1>
        <h1 class="mb-16">Dejardin</h1>

    </ContentWidth>

  </div>

  <div class="w-screen fixed h-24 top-0 py-8 z-30">
        <ContentWidth class="flex flex-row justify-between items-center">
            <button class="scale-105 text-white hover:text-accent-pink filter-to-accent-pink-on-hover active:invert transition-all {isLogoBlack ? "brightness-0" : ""}">
                <FontAwesomeIcon icon={faBars} size="2x"/>
            </button>
            <a href="/" class="filter-to-accent-pink-on-hover transition-all bump brightness-0 {isLogoBlack ? "" : "invert"}">
                <RotatingLogo class="h-6" />
            </a>
        </ContentWidth>
  </div>
  <div class="fixed w-screen h-screen z-30 pointer-events-none">
    <ContentWidth class='h-full relative'>
  
    <div class="absolute top-1/2 -left-2 xl:-left-8 -translate-x-1/2 rotate-90 flex flex-row transition-opacity duration-700 ease-fast-slow gap-4 pointer-events-auto {isNavShown?'':'pointer-events-none opacity-0'}">
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
        <ContentWidth class='h-full flex flex-col items-left pl-12'>
            <h5>Devon Desjardin</h5>
            <h3 class='mt-6'>To the garden</h3>
            <h3 class="mb-6">we return</h3>
            <h6 class='mb-6'>03.15 to 05.06.24</h6>
            <LinkArrowButton text="EXPLORE"/>
        </ContentWidth>
        <div class='w-full bg-subtle-primary py-16'>
            <ContentWidth class="pl-12">
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

    <div bind:this={sectionExplore} class="w-full bg-subtle-tan" id="#explore">
        <ContentWidth class="pl-20">
            <div class="flex flex-col gap-16 my-16">
                <h2>CORRIVEAU</h2>
                <h2>CUTLER</h2>
                <h2>DEJARDIN</h2>
                <h2>GEBBIA-RICHARDS</h2>
                <h2>JAMES</h2>
            </div>
            <LinkArrowButton text="artists" class="mt-16"/>
        </ContentWidth>
    </div>
    
    <img  src={exploreBottomShape} aria-hidden alt='non-semantic shape' class="w-full -z-10 bg-black bg-opacity-45 -mt-[40vw]" />

    <div class="w-full bg-black bg-opacity-45 h-30vw">
        <ContentWidth class="h-full flex flex-col justify-between">
            <div class="pl-20 -mt-[20vw] relative">
                <h2 class="text-white w-2/3">Weaving Together the Stories that Shape Us</h2>
                <LinkArrowButton text="Subscribe to our newsletter" class="brightness-0 invert ml-2 mt-10" />
                <div class="absolute -left-3 top-3 flex flex-col justify-center items-center gap-3">
                    <a href="#" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faInstagram} size='2x'/>
                    </a>
                    <a href="#" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faLinkedinIn} size='2x'/>
                    </a>
                    <a href="#" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump">
                        <FontAwesomeIcon icon={faXTwitter} size='2x'/>
                    </a>
                    <a href="#" class="w-6 text-subtle-blue hover:text-accent-pink active:text-black transition-colors bump translate-x-1">
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