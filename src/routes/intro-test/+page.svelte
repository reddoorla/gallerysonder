<script lang="ts">
    import { onMount } from 'svelte'
    import { tweened } from "svelte/motion";
    import { cubicOut } from 'svelte/easing';
    import { interpolateString as interpolate } from 'd3-interpolate';

    import image1 from '$lib/assets/images/sonderIntroArt/sonderIntroPiece1.jpg'
  
    const TRANSITION_DURATION = 3000;
  
    let currentPathIndex = 0;
  
    const O_paths = [
        "M52.44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52h-1.95C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h1.95Z",
        "M145.44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h94.95Z",
        "M973.44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h922.95Z",
        "M2895.44,0c30.24,0,50.49,19.03,50.49,47.52s-20.25,47.52-50.49,47.52H50.49C20.25,95.04,0,76,0,47.52S20.25,0,50.49,0h2844.95Z"
    ];
  
    let tweenedPath = tweened(O_paths[0], {
      duration: TRANSITION_DURATION,
      easing: cubicOut,
      interpolate: interpolate,
      
    });
  
    onMount(() => {
        console.log(currentPathIndex)
      const ticker = setInterval(() => {
        currentPathIndex = (currentPathIndex + 1) % O_paths.length;
        tweenedPath.set(O_paths[currentPathIndex]);
        console.log(currentPathIndex)
      }, TRANSITION_DURATION);
  
      return () => {
        clearInterval(ticker);
      };
    });
  </script>
  
  <style>
    .clip-by-logo {
    clip-path: url(#oClipPath);
  }

  .gradient-logo {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  </style>
  
  <svg id="sonderLogo" width="0" height="0" viewBox="0 0 383 49" xmlns="http://www.w3.org/2000/svg">
    <clipPath id="oClipPath">
      <path d={$tweenedPath} />
    </clipPath>
  </svg>
  
  <div class="w-screen h-screen absolute flex justify-center items-center">
    <div class="h-24 w-full gradient-logo clip-by-logo -translate-y-12" style="background-image: url({image1})" />
  </div>