<script lang="ts">
    import { onMount } from 'svelte'
    import { browser } from '$app/environment';
    import { tweened } from "svelte/motion";
    import { cubicOut, linear } from 'svelte/easing';
    import { interpolateString as interpolate } from 'd3-interpolate';

    import S from "$lib/assets/sonderAlphabet/normal/S.svg"
    import O from "$lib/assets/sonderAlphabet/normal/O.svg"
    import N from "$lib/assets/sonderAlphabet/normal/N.svg"
    import D from "$lib/assets/sonderAlphabet/normal/D.svg"
    import E from "$lib/assets/sonderAlphabet/normal/E.svg"
    import R from "$lib/assets/sonderAlphabet/normal/R.svg"


    import image1 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece1.jpg'
    import image2 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece2.jpg'
    import image3 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece3.png'
    import image4 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece4.jpg'
    import image5 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece5.jpg'
    import image6 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece6.jpg'
    import image7 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece7.png'
    import image8 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece8.jpg'
    import image9 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece9.jpg'


    
  
    const TRANSITION_DURATION = 500;

    const IMAGE_ARRAY_WITH_BG_SHIFTS = [
      {
        image:image1,
        left:0,
        top:0
      },
      {
        image:image2,
        left:0,
        top:0
      },
      {
        image:image3,
        left:0,
        top:0
      },
      {
        image:image4,
        left:0,
        top:0
      },
      {
        image:image5,
        left:0,
        top:0
      },
      {
        image:image6,
        left:0,
        top:0
      },
      {
        image:image7,
        left:0,
        top:0
      },
      {
        image:image8,
        left:0,
        top:0
      },
      {
        image:image9,
        left:0,
        top:0
      }
    ];

    let innerWidth:number;
  
    let currentPathIndex = 0;
    let currentImageIndex = 0;

    let originalS:HTMLElement;
    let originalO:HTMLElement;
    let originalR:HTMLElement;
    let animatedO:HTMLElement;
  
    let animatedOOffestLeft = 0
    let originalSOffsetLeft=0;
    let NDERwidth = 720;
    let animatedOWidth:number;
    let isOCentered = false;
    let bgPosition = '0px 0px';


    
       

    //hide tail by transitioning to the image with a black in between
    let O_paths:string[]=[];

    const basePath =  ".44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h";
       

    for( let i = 1 ; i<35 ; i++){
        O_paths.push("M"+i*70+basePath+i*70+".95Z");
    }
  
    let tweenedPath = tweened(O_paths, {
      duration: TRANSITION_DURATION,
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

       bgPosition = `${-animatedOOffestLeft}px 50%`;
      
       currentImageIndex = Math.floor(IMAGE_ARRAY_WITH_BG_SHIFTS.length*currentPathIndex/O_paths.length);
  }

  
    onMount(() => {

      originalSOffsetLeft = originalS.offsetLeft;

      
      const ticker = setInterval(() => {

        currentPathIndex = (currentPathIndex + 1) % O_paths.length;
        tweenedPath.set(O_paths[currentPathIndex]);

      }, TRANSITION_DURATION);
  
      if(originalO)
            animatedOOffestLeft=originalO.offsetLeft;

      return () => {
        clearInterval(ticker);
      };
    });
  </script>
  
  <style>
    .clip-by-logo {
    clip-path: url(#oClipPath);
  }

  </style>
  <svelte:head>
    <title>Gallery Sonder Intro</title>
  </svelte:head>
  <svelte:window bind:innerWidth/> 

  <svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="oClipPath">
      <path d={$tweenedPath} />
    </clipPath>
  </svg>
  
  <div class="w-screen h-screen absolute flex justify-center items-center">
    <div 
        bind:this={animatedO}
        class="h-24 w-[120%] clip-by-logo absolute top-[30vh]" 
        style="background-image: url({IMAGE_ARRAY_WITH_BG_SHIFTS[currentImageIndex].image}); background-size: cover; background-position: {bgPosition}; left: {animatedOOffestLeft}px" 
 />
    <div class="h-24 w-[120%] absolute top-[30vh] flex flex-row items-center gap-4 justify-center">
        <img src={S} alt="s"  
          bind:this={originalS} 
          style="margin-left: calc( {isOCentered ? Math.max(0, ( originalSOffsetLeft - pathWidth/2 - NDERwidth))  : pathWidth - NDERwidth}px - 10%)"
          class={isOCentered ? "transition-all duration-[5000ms]":""}
          />
        <img src={O} bind:this={originalO} alt="s" class="opacity-0 max-h-screen" style="width: {pathWidth}px" />
        <img src={N} alt="s" />
        <img src={D} alt="s" />
        <img src={E} alt="s" />
        <img src={R} alt="s" bind:this={originalR} style="margin-right:-{NDERwidth}px;"/>
    </div>
  </div>