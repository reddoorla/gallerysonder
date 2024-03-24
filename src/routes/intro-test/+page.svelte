<script lang="ts">
    import { onMount } from 'svelte'
    import { tweened } from "svelte/motion";
    import { cubicOut } from 'svelte/easing';
    import { interpolateString as interpolate } from 'd3-interpolate';

    import S from "$lib/assets/sonderAlphabet/normal/S.svg"
    import O from "$lib/assets/sonderAlphabet/normal/O.svg"
    import N from "$lib/assets/sonderAlphabet/normal/N.svg"
    import D from "$lib/assets/sonderAlphabet/normal/D.svg"
    import E from "$lib/assets/sonderAlphabet/normal/E.svg"
    import R from "$lib/assets/sonderAlphabet/normal/R.svg"


    import image1 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece1.jpg'
	import { browser } from '$app/environment';
  
    const TRANSITION_DURATION = 3000;
  
    let currentPathIndex = 0;

    let originalS:HTMLElement;
    let originalO:HTMLElement;
    let originalR:HTMLElement;
    let animatedO:HTMLElement;
  
    let animatedOffsetX = 0
    let originalSOffsetLeft=0;


    
       

    //hide tail by transitioning to the image with a black in between
    let O_paths:string[]=[];

    const basePath =  ".44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h";
       

    for( let i = 1 ; i<20 ; i++){
        O_paths.push("M"+i*70+basePath+i*70+".95Z");
    }
  
    let tweenedPath = tweened(O_paths, {
      duration: TRANSITION_DURATION,
      easing: cubicOut,
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
    if(originalO)
      animatedOffsetX=originalO.offsetLeft;    
  }

  
    onMount(() => {

      originalSOffsetLeft = originalS.offsetLeft;
      
      const ticker = setInterval(() => {
        currentPathIndex = (currentPathIndex + 1) % O_paths.length;
        tweenedPath.set(O_paths[currentPathIndex]);
      }, TRANSITION_DURATION);
  
      if(originalO)
            animatedOffsetX=originalO.offsetLeft;

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
  
  <svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="oClipPath">
      <path d={$tweenedPath} />
    </clipPath>
  </svg>
  
  <div class="w-screen h-screen absolute flex justify-center items-center">
    <div 
        bind:this={animatedO}
        class="h-24 w-full clip-by-logo absolute top-[30vh]" 
        style="background-image: url({image1}); background-width: 100vw; background-position: -50vw -50vh; left: {animatedOffsetX}px" 
        />
    <div class="h-24 w-full absolute top-[30vh] flex flex-row items-center gap-4 justify-center">
        <img src={S} alt="s"  bind:this={originalS} style="margin-left: {pathWidth > originalSOffsetLeft/2 ?  (originalSOffsetLeft*2 - pathWidth)/2 : pathWidth}px">
        <img src={O} bind:this={originalO} alt="s" class="opacity-15" style="width: {pathWidth}px" />
        <img src={N} alt="s" />
        <img src={D} alt="s" />
        <img src={E} alt="s" />
        <img src={R} alt="s" bind:this={originalR} />
    </div>
  </div>