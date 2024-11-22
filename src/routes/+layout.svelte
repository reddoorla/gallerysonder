<script lang='ts'>
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import logo from "$lib/assets/icons/SONDER_Logo.svg"
	//@ts-ignore
	import bgImage from '$lib/assets/images/artImage.jpeg?as=run'
	//@ts-ignore
	import prologue from '$lib/assets/images/prologue.png'
	import Img from '@zerodevx/svelte-img'


	import "../app.css";
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let isVideoLoaded = false;

	onMount(()=> {
		setTimeout(()=> isVideoLoaded=true, 2000)
	})

</script>

<style>


h5{
	color: var(--White, #FFF);
text-align: center;
font-feature-settings: 'liga' off, 'clig' off;
font-family: "commuters-sans";
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: 30px; /* 166.667% */
letter-spacing: 1.5px;
text-transform: uppercase;
}

p{
	color: var(--White, #FFF);
text-align: right;
font-feature-settings: 'liga' off, 'clig' off;
font-family: "commuters-sans", sans-serif;
font-size: 18px;
font-style: normal;
font-weight: 300;
line-height: 30px; /* 166.667% */
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
line-height: 150%; /* 27px */
letter-spacing: 1px;
}
b{
	font-weight: 700;
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

<div class="w-screen h-screen relative bg-black ">
	{#if !isVideoLoaded}
		<div class="w-screen h-screen absolute top-0 left-0 bg-black flex items-center justify-center z-20" out:fade>
			<img src={logo} class="h-16" alt="sonder" />
		</div>
	{/if}
		
		
		<Img src={bgImage} class="w-full h-full object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
		<div class="bg-black opacity-20 w-full h-full absolute left-0 top-0"/>
		<div class="max-w-[1220px] xl:max-w-[1440px] xl:mx-auto mx-[4%] w-[92%] h-full py-24 flex flex-col items-end justify-between relative">
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
		
				<img src={prologue} class="h-20 my-10" alt="prologue"/>

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
</div>
	

<PrismicPreview {repositoryName} />
