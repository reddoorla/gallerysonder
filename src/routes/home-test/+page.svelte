<script lang="ts">
    import  FontAwesomeIcon from 'svelte-fa'
    import { faPlayCircle, faQuoteLeft, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
	import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from '@fortawesome/free-brands-svg-icons';



    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';

 
    import backgroundImage from "$lib/assets/images/sonderIntroArt/sonderIntroPiece9.jpg";
    import logoExtendedE from "$lib/assets/icons/sonderLogosExtended/SONDER_E.svg"
    
    import onViewTopShape from "$lib/assets/shapes/homePageOnViewTop.svg"
    import onViewBottomShape from "$lib/assets/shapes/homePageOnViewBottom.svg"
    
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

    import exhibitionsActive from '$lib/assets/icons/nav_images/exhibitions_active.png'
    import newsActive from "$lib/assets/icons/nav_images/news_active.png"
    import artistsActive from "$lib/assets/icons/nav_images/artists_active.png"
    import aboutActive from "$lib/assets/icons/nav_images/about_active.png"
    import contactActive from "$lib/assets/icons/nav_images/contact_active.png"

    import ContentWidth from "$lib/components/ContentWidth.svelte";
    import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';
	import RotatingLogo from '$lib/components/RotatingLogo.svelte';
    import NameToClipPath from '$lib/components/NameToClipPath.svelte';
    import NameRevealOnHover from '$lib/components/NameRevealOnHover.svelte';

    import S from "$lib/assets/icons/sonderAlphabet/normal/S.svg"
    import O from "$lib/assets/icons/sonderAlphabet/normal/O.svg"
    import N from "$lib/assets/icons/sonderAlphabet/normal/N.svg"
    import D from "$lib/assets/icons/sonderAlphabet/normal/D.svg"
    import E from "$lib/assets/icons/sonderAlphabet/normal/E.svg"
    import R from "$lib/assets/icons/sonderAlphabet/normal/R.svg"

    import image1 from "$lib/assets/images/introImages/intro-1.jpg"
    import image2 from "$lib/assets/images/introImages/intro-2.jpg"
    import image3 from "$lib/assets/images/introImages/intro-3.jpg"
    import image4 from "$lib/assets/images/sonderIntroArt/sonderIntroPiece9.jpg"
    import image5 from "$lib/assets/images/introImages/intro-5.jpg"
    import image6 from "$lib/assets/images/introImages/intro-6.jpg"
    import image7 from "$lib/assets/images/introImages/intro-7.jpg"
    import image8 from "$lib/assets/images/introImages/intro-8.jpg"
    import image9 from "$lib/assets/images/introImages/intro-9.jpg"
    import image18 from "$lib/assets/images/introImages/intro-18.jpg"
    import image19 from "$lib/assets/images/introImages/intro-19.jpg"
	
    import Intro from '$lib/components/Home/Intro.svelte';
    import ScaleTextToContainer from '$lib/components/ScaleTextToContainer.svelte';
    import Gallery from '$lib/components/Gallery.svelte';

    import { backgroundColor } from '$lib/stores/backgroundColor';


    const IMAGE_ARRAY_WITH_BG_SHIFTS = [
      {
        image:image1,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image2,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image3,
        left:100,
        top:0,
        scale:150
      },
      {
        image:image19,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image7,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image8,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image9,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image18,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image5,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image6,
        left:0,
        top:0,
        scale:150
      },
      {
        image:image4,
        left:-8,
        top:-30,
        scale:140
      }
    ];

    const backgroundScaleInVW = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].scale;
    const backgroundLeft = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].left;
    const backgroundTop = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].top;


    const ON_VIEW_GALLERY = [
        {
            image: onShowOne,
            title: "awaiting the return",
            subtitle: "2023, Oil on canvas"
        },
        {
            image: onShowTwo,
            title: "mind body and spirit",
            subtitle: "2023, Oil on canvas"
        },
        {
            image: onShowThree,
            title: "in the shadows",
            subtitle: "2023, Oil on canvas"
        },
        {
            image: onShowFour,
            title: "before the fall",
            subtitle: "2023, Oil on canvas"
        }
    ];

    const FORTHCOMING_GALLERY = [
        {
            image: forthcomingOne,
            title: "The Fall of Adam and Eve",
            subtitle: "08.23.24",
            artist: "Julia Gould",
            link:"#"
        },
        {
            image: forthcomingTwo,
            title: "Take it Easy",
            subtitle: "08.23.24",
            artist:"Alex Cutler",
            link:"#"
        },
        {
            image: forthcomingThree,
            title: "Earthly Delights",
            subtitle: "08.23.24",
            artist: "Dylan Gebbia-Richards",
            link:"#"
        },
        {
            image: forthcomingFour,
            title: "Morte Ecranique",
            subtitle: "08.23.24",
            artist: "Maude Corriveau",
            link:"#"
        }
    ];
    let percentLoaded = 0.0;



    let coverImagesPromises: Promise<void>[] = [];
    let imagesToPreload: string[] = [backgroundImage, exhibitionsActive, artistsActive, aboutActive, newsActive, contactActive];

    IMAGE_ARRAY_WITH_BG_SHIFTS.forEach((item)=>imagesToPreload.push(item.image));
    FORTHCOMING_GALLERY.forEach((item)=>imagesToPreload.push(item.image));
    ON_VIEW_GALLERY.forEach((item)=>imagesToPreload.push(item.image));

    const preloadImage = (src: string) => {
        return new Promise<void>((resolve) => {
            let img = new Image();
            img.onload = () => resolve();
            img.src = src;
            percentLoaded += 1/imagesToPreload.length;
        });
    };


    const createAndResolvePromises = async () => {
        
        coverImagesPromises = imagesToPreload.map((image) => preloadImage(image));
        return await Promise.all(coverImagesPromises);
    };



    let isIntroComplete = false;
    let showContent = false;
    let showPresentedArtist = false;
    let showSonderPresents=false;

    let showNav = false;
    let navTopItem:HTMLElement;

    let innerWidth:number;


    let isSectionTop=true;
    let isSectionOnView = false;
    let isSectionForthcoming = false;
    let isSectionExplore =  false;
    let isFixedNavShown = false;
    let isLogoBlack = false;
    let isBackgroundDark = false;

    let sectionOnViewHat:HTMLElement;
    let sectionOnViewBottom:HTMLElement;
    let sectionForthcomingBottom:HTMLElement;
    let sectionForthcomingHat:HTMLElement;
    let sectionExplore:HTMLElement;
    let fixedNav:HTMLElement;
    let firstContent:HTMLElement;

    let firstContentOffsetTop:number;

    let corriveauBG="inherit";
    let cutlerBG="inherit";
    let dejardinBG="inherit";
    let gebbiaBG="inherit";
    let jamesBG="inherit";
    let exploreActiveBackgroundColor = "#F2E8D9"

    const checkExploreColor = () => {

      

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
            if(isSectionExplore){
                exploreActiveBackgroundColor="#F2E8D9";
            } else{
                exploreActiveBackgroundColor="#E4EEEA";
            }
        }

        
    }

$: {
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
    if(isSectionExplore){
                exploreActiveBackgroundColor="#F2E8D9";
            } else{
                exploreActiveBackgroundColor="#E4EEEA";
            }
  }
}

    

   
const checkPosition = () => {

  const onViewHatTop = sectionOnViewHat?.getBoundingClientRect().top;
  const onViewBottomBottom = sectionOnViewBottom?.getBoundingClientRect().bottom;
  const forthcomingHatTop = sectionForthcomingHat?.getBoundingClientRect().top;
  const forthcomingBottomBottom = sectionForthcomingBottom?.getBoundingClientRect().bottom;
  const exploreTop = sectionExplore?.getBoundingClientRect().top;
  const exploreBottom = sectionExplore?.getBoundingClientRect().bottom;


  const viewportHeight = window.innerHeight;

  firstContentOffsetTop=firstContent?.getBoundingClientRect().top;

  isSectionTop = onViewHatTop >= 0;
  isSectionOnView = onViewHatTop < 60 && onViewBottomBottom > viewportHeight*0.1 ;
  isSectionForthcoming = forthcomingHatTop < 180 && forthcomingBottomBottom > viewportHeight;
  isSectionExplore = forthcomingBottomBottom < viewportHeight ;
  isFixedNavShown = (fixedNav?.getBoundingClientRect().top >= firstContentOffsetTop && exploreBottom > fixedNav?.getBoundingClientRect().bottom)
  isLogoBlack = (onViewHatTop < 0 && onViewBottomBottom > 60) || (forthcomingHatTop < 0);
  isBackgroundDark = onViewBottomBottom < viewportHeight + 60;



}

const handleIntroComplete = () => {
    isIntroComplete=true;
    checkPosition();
    setTimeout(()=>showContent=true, 20);
    setTimeout(()=>showPresentedArtist=true, 500);
    setTimeout(()=>showSonderPresents=true, 1000);

    }
onMount(() => {
    
    window.addEventListener('scroll', checkPosition);

});

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




@media screen and ( max-width: 1024px ) {
    h1{
        color: var(--ffffff, #FFF);
        font-family: "commuters-sans";
        font-size: 48px;
        font-style: normal;
        font-weight: 700;
        line-height: 125%; /* 60px */
        text-transform: uppercase;
    }
}
  </style>
  
  <svelte:head>
    <title>Home Test</title>
  </svelte:head>

  <svelte:window bind:innerWidth={innerWidth} />
  {#await createAndResolvePromises()}

        <div class="h-24 w-[200%] -left-[50%] absolute top-[40vh] flex flex-row items-center gap-4 justify-center transition-transform duration-[750ms] scale-50">
            <img src={S} alt="s" />
            <img src={O} alt="o" />
            <img src={N} alt="n" />
            <img src={D} alt="d" />
            <img src={E} alt="e" />
            <img src={R} alt="r" />
        </div>

        <div class="w-full h-16 fixed bottom-0 flex flex-row justify-start items-start overflow-hidden">
            <div class="h-ful w-full bg-subtle-primary" style="transform: translateX({percentLoaded*100-100}%);"/>
        </div>
  {:then} 
  {#if !isIntroComplete}
  <div transition:fade>
  <Intro on:complete={handleIntroComplete} imageAndPositionArray={IMAGE_ARRAY_WITH_BG_SHIFTS}/>
  </div>
    
  {:else}

  {#key isIntroComplete}
  <div class="background-container">
    <img
      src={backgroundImage}
      class="absolute object-cover {isBackgroundDark ? "blur-sm md:blur-none":""}"
      style={innerWidth > 768 ? "width: "+backgroundScaleInVW+"%; max-width: "+backgroundScaleInVW+"%; left: "+backgroundLeft+"vw; top:"+backgroundTop+"vh" : "height:"+backgroundScaleInVW+"vh; top: -"+((backgroundScaleInVW-100)/2||0)+"%;"}
      alt="background"
    />
    <div class="absolute w-screen h-screen backdrop-blur md:backdrop-blur-none {isBackgroundDark?"bg-black opacity-45":"opacity-0"} "/>
  </div>

  <div class="fixed w-screen h-screen-50 bottom-0" >
    <ContentWidth class="h-full flex flex-col justify-end items-start transition-opacity {isSectionTop ? "" : "opacity-0"}">
        <h5 class="text-white translate-y-[22%] lg:translate-y-[18%] translate-x-1 lg:translate-x-3 xl:translate-x-4 transition-opacity duration-500 ease-fast-slow {showSonderPresents ? "" : "opacity-0"}">SONDER PRESENTS</h5>
        <ScaleTextToContainer class="transition-opacity duration-500 ease-fast-slow {showPresentedArtist ? "":"opacity-0"}">
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >Devon</h1>
            <h1 class="mb-0 pb-0 translate-y-[22%] lg:translate-y-[18%] w-fit text-white" >Dejardin</h1>
        </ScaleTextToContainer>
    </ContentWidth>
  </div>
  <div class=" w-screen fixed h-24 top-0 py-8 z-50 pointer-events-none" transition:fade={{ duration: 300 }}>
        <ContentWidth class="flex flex-row justify-between items-center">
            <button class="scale-105 text-white hover:text-accent-pink pointer-events-auto filter-to-accent-pink-on-hover active:invert transition-all {isLogoBlack||showNav ? "brightness-0" : ""}" on:click={()=>showNav = !showNav}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20ZM20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H20ZM3 7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44772 3 7Z" fill="white"/>                        
                </svg>
            </button>
            <div>
                <a class="floating-links no-underline md:hidden pointer-events-auto transition-opacity duration-200 {isSectionOnView&&!isSectionTop ? "active":"hidden opacity-0"}" transition:fade href="#onview" on:click|preventDefault={()=>sectionOnViewHat.scrollIntoView({behavior:'smooth'})}>ON VIEW</a>
                <a class="floating-links no-underline md:hidden pointer-events-auto transition-opacity duration-200 {isSectionForthcoming? "active":"hidden opacity-0"}" transition:fade href="#forthcoming" on:click|preventDefault={()=>sectionForthcomingHat.scrollIntoView({behavior:'smooth'})}>FORTHCOMING</a>
                <a class="floating-links no-underline md:hidden pointer-events-auto transition-opacity duration-200 {isSectionExplore? "active":"hidden opacity-0"}" transition:fade href="#explore" on:click|preventDefault={()=>sectionExplore.scrollIntoView({behavior:'smooth'})}>EXPLORE</a>
            </div>
            <a href="/" class="filter-to-accent-pink-on-hover transition-colors pointer-events-auto bump brightness-0 {isLogoBlack||showNav ? "" : "invert"}">
                <RotatingLogo class="h-6" />
            </a>
        </ContentWidth>
  </div>
  {#if showNav}
  <div class="h-screen w-screen fixed top-0 left-0 z-40 transition ease-fast-slow" style="background-color: {exploreActiveBackgroundColor}" transition:slide>
    <ContentWidth class="flex flex-col gap-12 lg:gap-20 pb-16 justify-end h-full relative">

        <div class="absolute -left-24 md:flex-col justify-center items-center gap-4 hidden xl:flex lg:bottom-[564px] md:bottom-[524px]">
            <a href="https://www.instagram.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
                <FontAwesomeIcon icon={faInstagram} size='2x'/>
            </a>
            <a href="https://www.linkedin.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
                <FontAwesomeIcon icon={faLinkedinIn} size='2x'/>
            </a>
            <a href="https://www.twitter.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
                <FontAwesomeIcon icon={faXTwitter} size='2x'/>
            </a>
            <a href="https://www.facebook.com/" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump translate-x-1 scale-75">
                <FontAwesomeIcon icon={faFacebookF} size='2x'/>
            </a>
        </div>
    <div bind:this={navTopItem}>
    <NameRevealOnHover 
        activeImage={exhibitionsActive} 
        setBackgroundColor="#D4D0DD" 
        bind:activeBackgroundColor={corriveauBG}
        on:mouseover={checkExploreColor}
        on:mouseout={checkExploreColor}   
        href="#" 
        class="h-4 sm:h-6 md:h-10 lg:h-12"
    />
    </div>
    <NameRevealOnHover 
        activeImage={artistsActive} 
        setBackgroundColor="#B4C6E1" 
        bind:activeBackgroundColor={corriveauBG}
        on:mouseover={checkExploreColor}
        on:mouseout={checkExploreColor}   
        href="#" 
        class="h-4 sm:h-6 md:h-10 lg:h-12"
    />
    
    <NameRevealOnHover 
        activeImage={aboutActive} 
        setBackgroundColor="#D6B6CA" 
        bind:activeBackgroundColor={corriveauBG}
        on:mouseover={checkExploreColor}
        on:mouseout={checkExploreColor}   
        href="#" 
        class="h-4 sm:h-6 md:h-10 lg:h-12"
    />

    <NameRevealOnHover 
        activeImage={newsActive} 
        setBackgroundColor="#9ED2D1" 
        bind:activeBackgroundColor={corriveauBG}
        on:mouseover={checkExploreColor}
        on:mouseout={checkExploreColor}   
        href="#" 
        class="h-4 sm:h-6 md:h-10 lg:h-12"
    />

    <NameRevealOnHover 
        activeImage={contactActive} 
        setBackgroundColor="#FBF0C3" 
        bind:activeBackgroundColor={corriveauBG}
        on:mouseover={checkExploreColor}
        on:mouseout={checkExploreColor}   
        href="#" 
        class="h-4 sm:h-6 md:h-10 lg:h-12"
    />
  
    <LinkArrowButton href="" text="Subscribe to our newsletter"/>
    
    </ContentWidth>
  </div>
  {/if}
  <div class="fixed w-screen h-screen z-30 pointer-events-none hidden lg:block">
    <ContentWidth class='h-full relative pointer-events-none'>
        <div bind:this={fixedNav} class="absolute top-1/2 -translate-y-4 -lef-0 -translate-x-1/2 rotate-90 flex flex-row gap-4 transition  {isFixedNavShown?'pointer-events-auto transition-opacity':'pointer-events-none opacity-0'}">
            <a class="floating-links no-underline {isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionOnView} href="#onview" on:click|preventDefault={()=>sectionOnViewHat.scrollIntoView({behavior:'smooth'})}>ON VIEW</a>
            <a class="floating-links no-underline {isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionForthcoming} href="#forthcoming" on:click|preventDefault={()=>sectionForthcomingHat.scrollIntoView({behavior:'smooth'})}>FORTHCOMING</a>
            <a class="floating-links no-underline {isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionExplore} href="#explore" on:click|preventDefault={()=>sectionExplore.scrollIntoView({behavior:'smooth'})}>EXPLORE</a>
        </div> 
    </ContentWidth>
    </div>


  
  <div class="content-container flex flex-col" on:scroll={checkPosition}>

    <div class="h-screen" />
    <div class="h-1" />

    <img bind:this={sectionOnViewHat} src={onViewTopShape} aria-hidden alt='non-semantic shape' class="w-full {showContent ? "":"hidden"}" style={innerWidth>768 ? "margin-bottom:-45vw":"margin-bottom:-25vw"} id="onview"/>
    <div id="on-view-start" class="w-full bg-subtle-primary md:bg-transparent" >
        <ContentWidth class='h-full flex flex-col items-left lg:pl-20 relative' >
            <h5 bind:this={firstContent}>Devon Dejardin</h5>
            <h3 class='mt-6'>To the garden we return</h3>
                <h6 class='mb-6'>03.15 to 05.06.24</h6>
                <LinkArrowButton text="EXPLORE"/>

                <div class="absolute top-0 translate-y-[168px] left-0 -translate-x-1/2 rotate-90  flex-row gap-4 hidden lg:flex transition  {!isFixedNavShown?'pointer-events-auto':'pointer-events-none opacity-0'}">
                    <a class="floating-links no-underline active {!isFixedNavShown?'':'pointer-events-none'}" href="#onview" on:click|preventDefault={()=>sectionOnViewHat.scrollIntoView({behavior:'smooth'})}>ON VIEW</a>
                    <a class="floating-links no-underline {!isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionForthcoming} href="#forthcoming" on:click|preventDefault={()=>sectionForthcomingHat.scrollIntoView({behavior:'smooth'})}>FORTHCOMING</a>
                    <a class="floating-links no-underline {!isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionExplore} href="#explore" on:click|preventDefault={()=>sectionExplore.scrollIntoView({behavior:'smooth'})}>EXPLORE</a>
                </div> 
            </ContentWidth>
       
        <div class='w-full py-16 bg-subtle-primary xl:bg-transparent xl:-mb-[540px]'>
            <ContentWidth class="lg:pl-20">
                <div class="w-full aspect-video relative mt-16">
                    <img src={videoPLaceholderImage} alt='gallery' class="w-full h-full object-cover"/>
                    <div class="bottom-4 md:bottom-8 left-4 md:left-8 absolute flex flex-row justify-between gap-4">
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
        <div class="w-full bg-subtle-primary pb-16 xl:pt-[540px]"  bind:this={sectionOnViewBottom}>
            <ContentWidth class="lg:pl-20">
                <h5>Selected Works</h5>
                <Gallery items={ON_VIEW_GALLERY}/>
                
                <h2 class="font-normal mt-16 sm:w-2/3">The Complete Catalogue of <span class="font-bold">To the Garden We Return</span></h2>
                <LinkArrowButton text="explore" class="mt-8"/>
            </ContentWidth>

        </div>
    </div>
    <img src={onViewBottomShape} aria-hidden alt='non-semantic shape' class="w-full z-0 " />
    <div class="w-full py-64">
        <ContentWidth class="md:pl-20 flex flex-col justify-center items-center">
            <div class="text-subtle-primary mb-16 mx-16">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5915 8.41463C9.57247 8.89024 8.15915 10.2073 7.83611 11.8171C9.73397 11.8537 11.1473 13.1707 11.1473 14.8902C11.1473 16.6463 9.69361 18 7.75537 18C5.37294 18 4 16.5 4 13.9024C4 9.95122 6.66508 6.80488 10.7031 6L11.5915 8.41463ZM17.2447 11.8171C19.1425 11.8537 20.5558 13.1707 20.5558 14.8902C20.5558 16.6463 19.1021 18 17.1639 18C14.7815 18 13.4086 16.5 13.4086 13.9024C13.4086 9.95122 16.0737 6.80488 20.1117 6L21 8.41463C18.981 8.89024 17.5677 10.2073 17.2447 11.8171Z" fill={exploreActiveBackgroundColor}/>
                </svg>     
            </div>
            <div class="md:mx-16 quote">
                There is something beyond what we see in the human realm in these little windows
            </div>

            <img src={devonSignature} alt="devon signature" class="h-8 mt-16"/>
        </ContentWidth>
    </div>
    <div bind:this={sectionForthcomingHat} class="w-screen use-gpu">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-screen transition-all duration-1000 ease-fast-slow" viewBox="-518 0 1968 714" style="margin-bottom:-26vw">
            <path d="M1450 143.557V714.277H-518V174.008C-320.779 59.0298 -5.64624 0.277344 422.66 0.277344C821.314 0.277344 1165.05 49.1745 1450 143.557Z" fill="{exploreActiveBackgroundColor}"/>
          </svg>
    </div>
      
    <div bind:this={sectionForthcomingBottom} class="w-full pt-8 pb-20 transition-all duration-1000 use-gpu ease-fast-slow" style="background-color:{exploreActiveBackgroundColor};">
        <ContentWidth class="lg:pl-20">
            <h5 class="mb-8">Forthcoming</h5>
            <Gallery isList items={FORTHCOMING_GALLERY}/>

            <h2 class="font-normal mt-8 lg:w-2/3">Celebrating the Diverse Stories that Define Us</h2>

            <LinkArrowButton text="all exhibitions" class="mt-8"/>
        </ContentWidth>
    </div>

    <div bind:this={sectionExplore} class="w-full use-gpu transition-all duration-1000 ease-fast-slow pt-20" id="explore" style="background-color:{exploreActiveBackgroundColor};">
        <ContentWidth class="lg:pl-20 relative">
            <div class="flex flex-col gap-16 my-16">
                <NameToClipPath 
                    inactiveImage={corriveauStart} 
                    activeImage={corriveauActive} 
                    setBackgroundColor="#C1E2FC" 
                    bind:activeBackgroundColor={corriveauBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-4 sm:h-6 md:h-10 lg:h-12 xl:h-16"
                />
                <NameToClipPath 
                    inactiveImage={cutlerStart} 
                    activeImage={cutlerActive} 
                    setBackgroundColor="#E8E9E9" 
                    bind:activeBackgroundColor={cutlerBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class=" h-4 sm:h-6 md:h-10 lg:h-12 xl:h-16"
                />
                <NameToClipPath 
                    inactiveImage={dejardinStart} 
                    activeImage={dejardinActive} 
                    setBackgroundColor="#B5D8E2" 
                    bind:activeBackgroundColor={dejardinBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-4 sm:h-6 md:h-10 lg:h-12 xl:h-16"
                />
                <NameToClipPath 
                    inactiveImage={gebbiaStart} 
                    activeImage={gebbiaActive} 
                    setBackgroundColor="#FEF8EC" 
                    bind:activeBackgroundColor={gebbiaBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}   
                    href="#" 
                    class="h-4 sm:h-6 md:h-10 lg:h-12 xl:h-16"
                />
                <NameToClipPath 
                    inactiveImage={jamesStart} 
                    activeImage={jamesActive} 
                    setBackgroundColor="#E6CCDC" 
                    bind:activeBackgroundColor={jamesBG}
                    on:mouseover={checkExploreColor}
                    on:mouseout={checkExploreColor}  
                    href="#" 
                    class="h-4 sm:h-6 md:h-10 lg:h-12 xl:h-16"
                />
                
                
            </div>
            <LinkArrowButton text="artists" class="mt-16"/>
            <div class="absolute bottom-0 -translate-y-[172px] left-0 -translate-x-1/2 rotate-90 flex flex-row gap-4  {!isFixedNavShown&&!showNav?'pointer-events-auto':'pointer-events-none opacity-0'}">
                <a class="floating-links no-underline {!isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionOnView} href="#onview" on:click|preventDefault={()=>sectionOnViewHat.scrollIntoView({behavior:'smooth'})}>ON VIEW</a>
                <a class="floating-links no-underline {!isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionForthcoming} href="#forthcoming" on:click|preventDefault={()=>sectionForthcomingHat.scrollIntoView({behavior:'smooth'})}>FORTHCOMING</a>
                <a class="floating-links no-underline {!isFixedNavShown?'':'pointer-events-none'}" class:active={isSectionExplore} href="#explore" on:click|preventDefault={()=>sectionExplore.scrollIntoView({behavior:'smooth'})}>EXPLORE</a>
            </div> 
        </ContentWidth>
       
    </div>
    


    <div aria-hidden class="w-full -z-10 -mt-[40vw] object-cover use-gpu" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1081" >
            <path class="transition-all duration-1000 ease-fast-slow" d="M-8.40312e-05 645.743L-2.76537e-05 0.859371L1440 0.859497L1440 1080.86C1294.79 870.352 987.176 769.073 431.897 716.51C212.097 696.382 78.5734 676.511 -8.40312e-05 645.743Z" fill={exploreActiveBackgroundColor}/>
        </svg>
    </div>

    <div class="w-full h-[80vh] sm:h-[30vw] xl:h-[20vw]">
        <ContentWidth class="h-full flex flex-col justify-between pt:16 md:pt-32">
            <div class="sm:pl-20 -mt-[20vw] relative">
                <h2 class="text-white font-normal mt-64 md:mt-16 sm:w-2/3">Weaving Together the Stories that Shape Us</h2>
                <LinkArrowButton text="Subscribe to our newsletter" class="brightness-0 invert ml-0 md:ml-2 mt-4 text-left md:mt-10" />
                <div class="absolute md:-left-3 top-16 md:top-20 md:-translate-1 flex md:flex-col justify-center items-center gap-4">
                    <a href="https://www.instagram.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
                        <FontAwesomeIcon icon={faInstagram} size='2x'/>
                    </a>
                    <a href="https://www.linkedin.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
                        <FontAwesomeIcon icon={faLinkedinIn} size='2x'/>
                    </a>
                    <a href="https://www.twitter.com" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75">
                        <FontAwesomeIcon icon={faXTwitter} size='2x'/>
                    </a>
                    <a href="https://www.facebook.com/" class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump translate-x-1 scale-75">
                        <FontAwesomeIcon icon={faFacebookF} size='2x'/>
                    </a>
                </div>
            </div>
            <div class="sm:pl-20 flex flex-row justify-between w-full mb-12">
                <a href="/" class="h-3 ml-2">
                    <img src={logoExtendedE} alt="logo" class="h-full brightness-0 invert"/>
                </a>
                <span class="text-white">©2024  |   All Rights Reserved</span>
            </div>
        </ContentWidth>
    </div>
  </div>
  {/key}
  {/if}
  {/await}