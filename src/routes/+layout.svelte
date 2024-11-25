<script lang="ts">
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import logo from "$lib/assets/icons/SONDER_Logo.svg";
	//@ts-ignore
	import bgImage from '$lib/assets/images/artImage.jpeg?as=run';
	import prologue from '$lib/assets/images/prologue.png';
	import Img from '@zerodevx/svelte-img';
	import RotatingLogo from '$lib/components/RotatingLogo.svelte';
	import VimeoPlayer from '$lib/components/VimeoPlayer.svelte';
	import "../app.css";
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	
	let isVideoLoaded = false;
	let isPlaying = false;
	
	interface VimeoComponent {
	  play: () => Promise<void>;
	  pause: () => Promise<void>;
	  reload: () => void;
	}
	
	let vimeoPlayer: VimeoComponent;
	
	onMount(() => {
	  
	});
	
	const togglePlayback = async () => {
  try {
    if (isPlaying) {
      await vimeoPlayer.pause();
    } else {
      await vimeoPlayer.play();
    }
  } catch (error) {
    console.error('Error toggling playback:', error);
  }
};

const handlePlayingChange = (event: CustomEvent) => {
  isPlaying = event.detail.isPlaying;
};

const handleVideoReady = async () => {
	isVideoLoaded = true;
	await vimeoPlayer.play();
	setTimeout(async ()=>{
		await vimeoPlayer.pause();
		isVideoDone = true;
	}, 6000 )
}

let isVideoDone = false;
	</script>
	
	<style>


		p{
		 color: var(--White, #FFF);
		text-align: right;
		font-feature-settings: 'liga' off, 'clig' off;
		font-family: "commuters-sans", sans-serif;
		font-size: 18px;
		font-style: normal;
		font-weight: 300;
		line-height: 30px; 
		letter-spacing: 1.5px;
		text-transform: uppercase;
		}

		.label{
		 color: var(--White, #FFF);
		text-align: right;
		font-feature-settings: 'liga' off, 'clig' off;
		font-family: "rig-sans", serif;
		font-size: 18px;
		font-style: normal;
		font-weight: 400;
		line-height: 150%;
		letter-spacing: 1px;
		}

		b{
		 font-weight: 700;
		}

		@media only screen and (max-width:768px) {

			p, .label{
				font-size: 14px;
			}
			
		}
	</style>

	<svelte:head>
		<title>Gallery Sonder</title>
		<link rel="stylesheet" href="https://use.typekit.net/oqt1xky.css">
		 {#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
		 {/if}
		 {#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
		 {/if}
		 {#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image.url} />
		<meta name="twitter:card" content="summary_large_image" />
		 {/if}
	</svelte:head>
	<main class="w-screen h-screen overflow-clip">
		
	
	<div class="w-screen h-screen relative bg-black">
	  {#if !isVideoLoaded}
		<div class="w-screen h-screen absolute top-0 left-0 bg-black flex items-center justify-center z-20" out:fade={{delay:200}}>
		  <img src={logo} class="h-16 pulse-always" alt="sonder" />
		</div>
	  {/if}



	
	  <Img src={bgImage} class="w-full h-full object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
	  <div class="w-screen h-screen absolute top-0 left-0 z-10 transition-opacity duration-700 delay-700 ease-out {isVideoDone?"opacity-0":""}">
		<VimeoPlayer
		  bind:this={vimeoPlayer}
		  videoId="1032470650"
		  muted={true}
		  bind:isPlaying={isPlaying}
		  on:playingChange={handlePlayingChange}
		  on:ready={handleVideoReady  }
		/>
	  </div>
	  

	  <div class="bg-black {isVideoDone?"opacity-0":""} w-full h-full absolute left-0 top-0"/>
	  <div class="bg-black {isVideoDone?"opacity-20":"opacity-0"} w-full h-full z-10 absolute left-0 top-0 transition-opacity"/>

	  {#if isVideoDone}

		<div class=" w-screen fixed h-24 top-0 py-8 z-10 pointer-events-none " transition:fade={{ duration: 700 }}>
			<div class="max-w-[1220px] xl:max-w-[1440px] xl:mx-auto mx-[4%] w-[92%] flex flex-row justify-start items-center">
				
				<div  class="brightness-0 invert">
					<RotatingLogo class="h-6" />
				</div>
			</div>
		</div>
	{/if}
	{#if isVideoDone}

		<div class="max-w-[1220px] xl:max-w-[1440px] xl:mx-auto mx-[4%] w-[92%] h-full py-12 md:py-24 flex flex-col items-end justify-between relative z-10" transition:fade={{ duration: 700 }}>
			
			<div>
				<p>HELEN BEARD</p>
				<p>ALEX CUTLER</p>
				<p>DYLAN GEBBIA-RICHARDS</p>
				<p>THUSH HOLMES</p>
				<p>ANTHONY JAMES</p>
				<p>KATHRYN MACNAUGHTON</p>
				<p>JACQUELINE SURDELL</p>
				<p>ALEX SUTCLIFFE</p>
				<p>KEVIN YAUN</p>
		
				<img src={prologue} class="h-8 md:h-20 my-10" alt="prologue"/>

				<p>
					<b>Opening 11.23.2024</b> <br/>
					<b>6:00–9:00 PM </b> <br/>
					11.23.2024 – 01.18.2025
				</p>
			</div>
			<div class="flex flex-col items-end gap-3">
				<div class="label">3435 E Coast Highway, Corona Del Mar, CA 92625</div>
				<a href="https://www.instagram.com/gallerysonder/" target="_blank" class="cursor-pointer hover:opacity-90">
					<i class="fa-brands fa-instagram text-[#E8587C] fa-lg" />
				</a>
			</div>
				
		</div>
		
		{/if} 
	  

		
</div>
</main>

<PrismicPreview {repositoryName} />
