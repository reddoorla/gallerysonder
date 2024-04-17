<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte'
    import { browser } from '$app/environment';
    import { tweened } from "svelte/motion";
    import { cubicOut, linear } from 'svelte/easing';
    import { interpolateString as interpolate } from 'd3-interpolate';

    //TODO: center sonder not the O, just let  it open

    //TODO: fix the flicker

    //TODO: added a 100ms crossfade

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


    
    const SCALE_UP_PHASE_DURATION_IN_MS = 1000;
    const TICK_DURATION = 10;
    const IMAGE_ARRAY_WITH_BG_SHIFTS = [
      {
        image:image1,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image2,
        left:0,
        top:0
      },
      {
        image:image3,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image19,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image7,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image8,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image9,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image18,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image5,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image6,
        left:0,
        top:0,
        scale:100
      },
      {
        image:image4,
        left:-8,
        top:-30,
        scale:120
      }
    ];

    export let imageAndPositionArray = IMAGE_ARRAY_WITH_BG_SHIFTS

    let innerWidth:number;
  
    let currentPathIndex = 0;
    let currentImageIndex = 0;

    let originalS:HTMLElement;
    let originalO:HTMLElement;
    let originalR:HTMLElement;
    let animatedO:HTMLElement;
    let verticalOpenWindow:HTMLElement;
  
    let animatedOOffestLeft = 0
    let originalSOffsetLeft=0;
    let NDERwidth = 720;
    let animatedOWidth:number;
    let isOCentered = false;
    let bgPosition = '0px 0px';
    let hideO = false;

    let isMounted = false;
    let isGrowPhase = false;
    let isHorizontalOpenPhase = false;
    let isVerticalOpenPhase = false;
    export let isComplete = false;


    
       

    //hide tail by transitioning to the image with a black in between
    let O_paths:string[]=[];

    const basePath =  ".44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h";
       

    for( let i = 1 ; i<400 ; i++){
        O_paths.push("M"+(70+i*15)+basePath+(70+i*15)+".95Z");
    }
  
    let tweenedPath = tweened(O_paths, {
      duration: TICK_DURATION,
      easing: linear,
      interpolate: interpolate,
      
    });

    function calculatePathWidth(path: string) {
        if(browser){
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    svgElement.appendChild(pathElement);
    document.body.appendChild(svgElement);
    const bbox = pathElement.getBBox();
    document.body.removeChild(svgElement);
    return bbox.width;
        }
        return 0;
  }

  let pathWidth=48;

  $: {
    pathWidth = calculatePathWidth($tweenedPath);
    if(originalO){
      const rect = originalO.getBoundingClientRect();
      animatedOOffestLeft = rect.left;
      animatedOWidth = rect.width;
    }

      // console.log("animatedOOffsetLeft: "+animatedOOffestLeft +" | innerWidth: "+innerWidth+" | animatedOWidth: "+animatedOWidth)
     if( originalO && animatedOOffestLeft > (innerWidth - animatedOWidth)/2 )
       isOCentered=true;
       
       if (currentImageIndex < imageAndPositionArray.length)
        bgPosition = `calc(${-animatedOOffestLeft}px + ${imageAndPositionArray[currentImageIndex].left}vw) calc( ${imageAndPositionArray[currentImageIndex].top}vh)`;
       
        currentImageIndex = Math.floor(imageAndPositionArray.length*currentPathIndex/O_paths.length);
        if(currentImageIndex>=imageAndPositionArray.length)
            currentImageIndex=imageAndPositionArray.length-1

       if(Math.floor(imageAndPositionArray.length*currentPathIndex/O_paths.length)!=Math.floor(imageAndPositionArray.length*(currentPathIndex+1)/O_paths.length)){
        hideO = true;
       }  else{
        hideO = false;
       }

       if(pathWidth > innerWidth){
        isVerticalOpenPhase=true;
        isHorizontalOpenPhase = false;
      }

      if(currentImageIndex==imageAndPositionArray.length-1){
        setTimeout(()=>{
            isComplete=true;
        }, 1000)
      }

       
  }

  
    onMount(() => {

      isMounted = true;
      isGrowPhase = true;

      originalSOffsetLeft = originalS.offsetLeft;

      let ticker:NodeJS.Timeout;
      setTimeout(()=>{
        
        isGrowPhase = false;
        isHorizontalOpenPhase = true;
      
        ticker = setInterval(() => {

          currentPathIndex++;
          tweenedPath.set(O_paths[currentPathIndex]);
          if(currentImageIndex==O_paths.length-1)
            clearInterval(ticker);

        }, TICK_DURATION);

    },SCALE_UP_PHASE_DURATION_IN_MS);
  
      if(originalO)
            animatedOOffestLeft=originalO.offsetLeft;

      return () => {
        clearInterval(ticker);
      };
    });

    const dispatch = createEventDispatcher();

  $: {
    if (currentImageIndex == imageAndPositionArray.length - 1) {
      setTimeout(() => {
        isComplete = true;
        dispatch('complete');
      }, 1000);
    }
  }
  </script>
  
  <style>
    .clip-by-logo {
    clip-path: url(#oClipPath);
  }

  </style>
  <svelte:window bind:innerWidth/> 

  {#if !isComplete}

  <svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="oClipPath">
      <path d={$tweenedPath} />
    </clipPath>
  </svg>
  
  <div class="w-screen h-screen bg-black">
    <div 
      
      class="h-24 w-[120%] clip-by-logo absolute top-[40vh] bg-subtle-primary {isGrowPhase||!isMounted ? 'opacity-0' : ''}" 
      style="left: {animatedOOffestLeft}px" 
    />
   
    <div
        bind:this={animatedO}
        class="h-24 scale-y-110 w-[120%] clip-by-logo absolute top-[40vh] transition-opacity {hideO ? "opacity-0 duration-1000":"duration-50"} {isGrowPhase||!isMounted ? 'opacity-0' : ''}" 
        style="background-image: url({imageAndPositionArray[currentImageIndex].image}); background-size: {imageAndPositionArray[currentImageIndex].scale}vw; background-position: {bgPosition}; left: {animatedOOffestLeft}px" 
    />

    <div 
        bind:this={verticalOpenWindow}
        class=" absolute w-[120%] bg-black transition-opacity h-full {isVerticalOpenPhase ? "max-h-full":"opacity-0 max-h-24 translate-y-[40vh]"}"
        style="background-image: url({imageAndPositionArray[currentImageIndex].image}); background-size: {imageAndPositionArray[currentImageIndex].scale}vw; background-position: {bgPosition}; left: {animatedOOffestLeft}px; transition: max-height 1s ease-out, transform 1s ease-out; "
    />
 
    <div class="h-24 w-[120%] absolute top-[40vh] flex flex-row items-center gap-4 justify-center transition-transform duration-[750ms] {isMounted ? "scale-100" : "scale-50"} {isVerticalOpenPhase ? "hidden" : ""}">
        <img src={S} alt="s"  
          bind:this={originalS} 
          style="margin-left: calc(  { pathWidth/2 - NDERwidth  }px - 10%)"
          class={isOCentered ? "transition-all duration-[5000ms]":""}
          />
        <img src={O} bind:this={originalO} alt="s" class="{isGrowPhase||!isMounted ? '' : 'opacity-0'} max-h-screen transition-opacity" style="width: {pathWidth}px" />
        <img src={N} alt="n" />
        <img src={D} alt="d" />
        <img src={E} alt="e" />
        <img src={R} alt="r" bind:this={originalR} style="margin-right:-{NDERwidth}px;"/>
    </div>
  </div>

{/if}