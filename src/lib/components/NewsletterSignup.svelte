<script lang="ts">
    import { isNewsletterActive } from "$lib/stores/isNewsletterActive";
    import { hasNewsletterBeenCleared } from "$lib/stores/hasNewsletterBeenCleared";
    import { backgroundColor } from "$lib/stores/backgroundColor";
	import { get } from "svelte/store";
	import ContentWidth from "./ContentWidth.svelte";
	import { fade } from "svelte/transition";
	import RotatingLogo from "./RotatingLogo.svelte";
	import LinkArrowButton from "./Buttons/LinkArrowButton.svelte";
	import { onMount } from "svelte";

    $: {
        $isNewsletterActive;
        if($hasNewsletterBeenCleared)
            $isNewsletterActive=false;
        if(typeof document !=='undefined' && document.getElementsByTagName('body')){
            const body = document.getElementsByTagName('body')[0] as HTMLElement;
            if($isNewsletterActive){
                body.style.overflow = 'hidden'
            }else{
                body.style.overflow = 'auto'
            }
        }
    }

    let emailValue:string;

    let lowestPoint = 0;
   
    

    const checkPosition = () => {

        if(typeof window !== 'undefined'&&typeof document !== 'undefined'){
            const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if(window.scrollY>lowestPoint)
                lowestPoint=window.scrollY;
            if(lowestPoint/maxScroll>0.8&&window.scrollY/maxScroll<0.5&&!$hasNewsletterBeenCleared)
                $isNewsletterActive=true;
        }
    }

    onMount(()=>{
        window.addEventListener('scroll', checkPosition);
    })
    

</script>

{#if $isNewsletterActive&&!$hasNewsletterBeenCleared}
<div class="w-screen h-screen fixed top-0 left-0 z-40  backdrop-blur" transition:fade >
    <div class="w-full h-full absolute top-0 left-0 opacity-95" style="background-color:{$backgroundColor}"></div>
    <ContentWidth  class="h-full relative flex flex-col items-start justify-center gap-10">
        <button on:click={()=>{$isNewsletterActive=false; $hasNewsletterBeenCleared=true}} class="absolute top-5 left-0 hover:opacity-80"><i class="fa-sharp fa-close fa-2xl text-black" /></button>
        <a href="/" class="absolute top-5 right-0 hover:opacity-80"><RotatingLogo class="h-6" /></a>
        <div>
            <h2>Join Our Community</h2>
            <p>Sign up for our newsletter to receive updates  <br/> on exhibitions, artists, and community events. </p>
        </div>
        <div>
            <input type="text" bind:value={emailValue} placeholder="Enter Your Email" class="h-12 pl-2"/>
            <LinkArrowButton class="mt-6" text="Subscribe" />
        </div>
        <p class="text-sm mt-24">By signing up, you agree to the Terms of Use and Privacy Policy to receive electronic <br/> communications from Gallery Sonder. You can unsubscribe or change your preferences at any time.</p>
    </ContentWidth>
    
</div>
{/if}