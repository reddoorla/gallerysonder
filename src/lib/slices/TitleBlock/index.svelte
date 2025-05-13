<script lang="ts">


	import type { TitleBlockSlice } from '../../../prismicio-types';
	import TopShape from '$lib/components/Shapes/TopShape.svelte';
	import { backgroundColor } from '$lib/stores/backgroundColor';
	import ContentWidth from '$lib/components/ContentWidth.svelte';
	import LinkArrowButton from '$lib/components/Buttons/LinkArrowButton.svelte';
	import { isFilled } from '@prismicio/helpers';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import LinkPlusToggle from '$lib/components/Buttons/LinkPlusToggle.svelte';
	import { slide } from 'svelte/transition';
	import { isNewsletterActive } from '$lib/stores/isNewsletterActive';
	import { hasNewsletterBeenCleared } from '$lib/stores/hasNewsletterBeenCleared';
	import SplitRichTextAccordian from '$lib/components/SplitRichTextAccordian.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let viewportWidth: number;

	export let slice: TitleBlockSlice;

	let showFullBody = false;
	let showContactForm = $page.url.searchParams.has('inquire');

	let formName:string;
	let formCompany:string;
	let formPhone:string;
	let formEmail:string;
	let formMessage:string;


	const triggerSubmitButton = () => {
   
    const hiddenForm = document.getElementById('netlifyContactForm') as HTMLFormElement;
    
    if (hiddenForm) {
      
      const hiddenName = hiddenForm.querySelector('[name="name"]') as HTMLInputElement;
      const hiddenCompany = hiddenForm.querySelector('[name="company"]') as HTMLInputElement;
      const hiddenPhone = hiddenForm.querySelector('[name="phone"]') as HTMLInputElement;
      const hiddenEmail = hiddenForm.querySelector('[name="email"]') as HTMLInputElement;
      const hiddenMessage = hiddenForm.querySelector('[name="message"]') as HTMLTextAreaElement;
      
  
      if (hiddenName) hiddenName.value = formName;
      if (hiddenCompany) hiddenCompany.value = formCompany;
      if (hiddenPhone) hiddenPhone.value = formPhone;
      if (hiddenEmail) hiddenEmail.value = formEmail;
      if (hiddenMessage) hiddenMessage.value = formMessage;

      hiddenForm.submit();
      console.log('submitted');
    }
  };


	let shape:HTMLElement;
	let shapeHeight:number;

	onMount(()=>{
		if(shape)
			shapeHeight=shape.getBoundingClientRect().height	
	}
)
</script>

<style>
	input, textarea{
		background-color: rgba(255, 255, 255, 0.4);
		border-radius: 2px;
	}
</style>


<svelte:window bind:innerWidth={viewportWidth} />

{#if slice.primary.shape_top !== '0'}
	<div style="height:{shapeHeight}px;"></div>
{/if}

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}

	class="w-full transition duration-1000 md:bg-transparent {slice.primary.shape_top==="1"?"lg:mt-[100vh]":""} {slice.primary.hide ? 'hidden' : ''}"
	style="background-color: {$backgroundColor} "
>
{#if slice.primary.shape_top !== '0'}<div
class="-translate-y-[99%] "
bind:this={shape}
>
<TopShape shapeNumber={slice.primary.shape_top || '0'} />
</div>

{/if}
	<ContentWidth class="h-full flex flex-col items-left pt-8 lg:pl-20 relative">
		{#if slice.variation === 'default'}
			<h5><b>{slice.primary.eyebrow || ''}</b></h5>
			{#if slice.primary.title}
				<h3 class="mt-3">{slice.primary.title || ''}</h3>
			{/if}
			{#if slice.primary.subtitle}
				<h6 class="mt-3"><b>{slice.primary.subtitle || ''}</b></h6>
			{/if}
			{#if slice.primary.body}
				<div class="xl:w-{slice.primary.desktop_body_width} rich-text mt-6">
					<PrismicRichText field={slice.primary.body} />
				</div>
			{/if}
			{#if slice.primary.button_text && isFilled.link(slice.primary.button_link)}
				<LinkArrowButton
					text={slice.primary.button_text || ''}
					href={slice.primary.button_link.url}
					class="mt-6"
				/>
			{/if}
		{:else if slice.variation === 'twoColumn'}
			<div class="w-full flex flex-col md:flex-row">
				<div class="w-full md:w-1/2 mb-10 md:mb-0">
					<h6 class="font-light">{slice.primary.eyebrow || ''}</h6>
					{#if slice.primary.title}
						<h3 class="mt-6">{slice.primary.title || ''}</h3>
					{/if}
					{#if slice.primary.subtitle}
						<h6 class="mb-6"><b>{slice.primary.subtitle || ''}</b></h6>
					{/if}
					{#if slice.primary.body}
						{#if slice.primary.read_more_button}
						<div class="rich-text mb-3 md:pr-16">
							{#key $page.url}
							<SplitRichTextAccordian bind:showFullBody >
								<PrismicRichText field={slice.primary.body} />
							  </SplitRichTextAccordian>
							  {/key}
						  </div>
							<LinkPlusToggle
								click={() => (showFullBody = !showFullBody)}
								text={showFullBody ? 'Show Less' : 'Read More'}
							/>
							
						{:else}
							<div class="rich-text mb-6 md:pr-16">
								<PrismicRichText field={slice.primary.body} />
							</div>
						{/if}
					{/if}
					{#if slice.primary.button_text && isFilled.link(slice.primary.button_link)}
						<LinkArrowButton
							text={slice.primary.button_text || ''}
							href={slice.primary.button_link.url}
							class="mt-6"
							opensNewTab={slice.primary.button_link.link_type==='Media'}
						/>
					{/if}
				</div>
				<div class="w-full md:w-1/2 md:pl-16">
					<PrismicImage field={slice.primary.image} />
				</div>
			</div>

		{:else if slice.variation === 'connect'}

		<h5>{slice.primary.eyebrow || ''}</h5>
			{#if slice.primary.title}
				<h2 class="mt-6">{slice.primary.title || ''}</h2>
			{/if}
			{#if slice.primary.subtitle}
				<h6 class="mb-6">{slice.primary.subtitle || ''}</h6>
			{/if}
			{#if slice.primary.body}
				<div class="rich-text mb-8">
					<PrismicRichText field={slice.primary.body} />
				</div>
			{/if}
			<div class="flex flex-row gap-6 mb-8">
			{#if slice.primary.button_text}
				<LinkPlusToggle startsActive={showContactForm} text={slice.primary.button_text||'Inquire'} click={()=>{showContactForm=!showContactForm}} />
			{/if}
			{#if slice.primary.button_text}
				<LinkPlusToggle togglable={false} text={slice.primary.button_two_text||'Newsletter'} click={()=>{$hasNewsletterBeenCleared=false;$isNewsletterActive=true;}} />
			{/if}
			</div>
			{#if showContactForm}
			<div transition:slide class="h-full w-full my-12 md:mt-0 md:w-2/3 flex flex-col gap-2 items-start md:pr-24"   >
                
						
					<p>Name</p>
					<input type="text" name="name" bind:value={formName} required placeholder="first and last name" class="w-full border-1 border-mid p-2 mb-4" />
				
					<p>Company Name</p>
					<input type="text" name="company" bind:value={formCompany} placeholder="company name" class="w-full border-1 border-mid p-2 mb-4" />
				
					<p>Phone</p>
					<input type="phone" name="phone"bind:value={formPhone} required placeholder="000-000-0000" class="w-full border-1 border-mid p-2 mb-4" />
			
					<p>Email</p>
					<input type="email" name="email" bind:value={formEmail} required placeholder="you@domain.com" class="w-full border-1 border-mid p-2 mb-4" />
				
					<p class="hidden">
						<label>
						Don’t fill this out if you’re human: <input name="bot-field" />
						</label>
					</p>
					
					<p>Message</p>
					<textarea name="message" bind:value={formMessage} required placeholder="how can we help?" class="min-h-24 w-full border-1 border-mid p-2 mb-4"/>
	  
				
                        <button type="submit" on:click={triggerSubmitButton} class="bump text-primary border-b-2 bg-white hover:bg-black hover:text-white p-3 font-bold border-primary bump cursor-pointer">Connect</button>
                 
               </div>
			   {/if}
			<div class="flex flex-row gap-6">
				{#if isFilled.link(slice.primary.instagram)}
					<a href={slice.primary.instagram.url}><i class="fa-brands fa-instagram fa-lg"/></a>
				{/if}
			</div>
		{/if}
	</ContentWidth>
</section>
