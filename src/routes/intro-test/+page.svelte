<script lang="ts">
    import { onMount } from 'svelte'
    import { tweened } from "svelte/motion";
    import { cubicOut } from 'svelte/easing';
    import { interpolateString as interpolate } from 'd3-interpolate';
  
    const TRANSITION_DURATION = 100;
  
    let currentPathIndex = 0;
  
    const O_paths = [
      "M0,47.5C0,18.49,19.84,0,51.01,0s51.01,18.49,51.01,47.5-19.84,47.5-51.01,47.5S0,76.51,0,47.5ZM70.98,47.5c0-12.95-7.83-21.32-19.97-21.32s-19.97,8.37-19.97,21.32,7.83,21.32,19.97,21.32,19.97-8.37,19.97-21.32Z",
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
    <div class="h-24 w-full gradient-logo clip-by-logo -translate-y-12" />
  </div>