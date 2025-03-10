<script lang="ts">
	import ContentWidth from './ContentWidth.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';
	import { isNewsletterActive } from '$lib/stores/isNewsletterActive';
	import { hasNewsletterBeenCleared } from '$lib/stores/hasNewsletterBeenCleared';

	import logoExtendedE from '$lib/assets/icons/sonderLogosExtended/SONDER_E.svg';

	import { backgroundColor } from '$lib/stores/backgroundColor';
</script>

<div aria-hidden class="w-full -z-10 -mt-[40vw] object-cover use-gpu">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1081">
		<path
			class="transition-all duration-1000"
			d="M-8.40312e-05 645.743L-2.76537e-05 0.859371L1440 0.859497L1440 1080.86C1294.79 870.352 987.176 769.073 431.897 716.51C212.097 696.382 78.5734 676.511 -8.40312e-05 645.743Z"
			fill={$backgroundColor}
		/>
	</svg>
</div>

<div class="w-full h-[80vh] sm:h-[30vw] xl:h-[20vw]">
	<ContentWidth class="h-full flex flex-col justify-between md:pt-32">
		<div class="sm:pl-20 -mt-[20vw] relative">
			<h2 class="text-white font-normal mt-32 md:mt-16 sm:w-2/3">
				Weaving Together the Stories that Shape Us
			</h2>
			<LinkArrowButton
				text="Subscribe to our newsletter"
				class="brightness-0 invert ml-0 md:ml-2 mt-4 text-left md:mt-10"
				click={()=>{hasNewsletterBeenCleared.set(false); isNewsletterActive.set(true);}}
			/>
			<div
				class="absolute md:left-[3px] top-16 md:top-20 flex md:flex-col justify-center items-center gap-4"
			>
				<a
					href="https://www.instagram.com/gallerysonder/"
					class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75"
				>
					<i class="fa-brands fa-instagram fa-2xl" />
				</a>
				
			</div>
		</div>
	
		<div class="sm:pl-20 flex flex-col md:flex-row justify-between items-end w-full md:mb-12 gap-4 md:gap-8">
			<div class="gap-3 flex flex-col">
				<a href="/" class="h-3">
					<img src={logoExtendedE} alt="logo" class="h-full brightness-0 invert" />
				</a>
				<div class="text-white text-xs md:text-md">©{new Date().getFullYear()} &nbsp;&nbsp;|&nbsp;&nbsp; All Rights Reserved</div>
			</div>
			<div class="text-right" style="color:{$backgroundColor}">
				3435 E Coast Highway, <br/>
				Corona del Mar, CA 92625 <br/>
				(949) 662-0077 <br/>
				info@gallerysonder.com 
			</div>
			
		</div>
	</ContentWidth>
</div>
