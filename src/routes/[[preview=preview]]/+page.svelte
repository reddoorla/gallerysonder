<script lang="ts">
	import { SliceZone } from '@prismicio/svelte';
	import Intro from '$lib/components/Home/Intro.svelte';
	import { components } from '$lib/slices';

	import { fade } from 'svelte/transition';

	import S from "$lib/assets/icons/sonderAlphabet/normal/S.svg"
    import O from "$lib/assets/icons/sonderAlphabet/normal/O.svg"
    import N from "$lib/assets/icons/sonderAlphabet/normal/N.svg"
    import D from "$lib/assets/icons/sonderAlphabet/normal/D.svg"
    import E from "$lib/assets/icons/sonderAlphabet/normal/E.svg"
    import R from "$lib/assets/icons/sonderAlphabet/normal/R.svg"


	export let data;

	let innerWidth:number;

	const IMAGE_ARRAY_WITH_BG_SHIFTS = data.intro.data.images;
	const backgroundScaleInVW = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].scale;
    const backgroundLeft = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].left;
    const backgroundTop = IMAGE_ARRAY_WITH_BG_SHIFTS[IMAGE_ARRAY_WITH_BG_SHIFTS.length-1].top;

	let percentLoaded = 0.0;


	let isIntroComplete = false;
    let showContent = false;
    let showPresentedArtist = false;
    let showSonderPresents = false;

	let isFixedNavShown = false;
    let isLogoBlack = false;
	let isBackgroundDark = false;

	let coverImagesPromises: Promise<void>[] = [];
	let imagesToPreload: string[];

	IMAGE_ARRAY_WITH_BG_SHIFTS.forEach((item)=>{
		if(item.image.url)
			imagesToPreload.push(item.image.url);
	});

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

	const checkPosition = () => {
	};

	const handleIntroComplete = () => {
    isIntroComplete=true;
    checkPosition();
    setTimeout(()=>showContent=true, 20);
    setTimeout(()=>showPresentedArtist=true, 500);
    setTimeout(()=>showSonderPresents=true, 1000);

    }




</script>

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

<SliceZone slices={data.page.data.slices} {components} />

{/if}
{/await}
