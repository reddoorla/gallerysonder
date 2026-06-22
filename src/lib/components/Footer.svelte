<script lang="ts">
	import ContentWidth from './ContentWidth.svelte';
	import LinkArrowButton from './Buttons/LinkArrowButton.svelte';

	import logoExtendedE from '$lib/assets/icons/sonderLogosExtended/SONDER_E.svg';

	import { getAppState } from '$lib/contexts/appState.svelte';

	const appState = getAppState();
</script>

<div aria-hidden="true" class="w-full -z-10 -mt-[40vw] object-cover use-gpu">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1081">
		<path
			class="transition-all duration-1000"
			d="M-8.40312e-05 645.743L-2.76537e-05 0.859371L1440 0.859497L1440 1080.86C1294.79 870.352 987.176 769.073 431.897 716.51C212.097 696.382 78.5734 676.511 -8.40312e-05 645.743Z"
			fill={appState.backgroundColor}
		/>
	</svg>
</div>

<div class="w-full h-[90vh] sm:h-[40vw] xl:h-[20vw]">
	<ContentWidth class="h-full flex flex-col justify-between md:pt-32">
		<div class="sm:pl-20 -mt-[20vw] relative">
			<h2 class="text-white font-normal mt-32 md:mt-16 sm:w-2/3">
				Weaving Together the Stories that Define Us
			</h2>
			<LinkArrowButton
				text="Subscribe to our newsletter"
				class="brightness-0 invert ml-0 md:ml-2 mt-4 text-left md:mt-10"
				onclick={() => {
					appState.hasNewsletterBeenCleared = false;
					appState.isNewsletterActive = true;
				}}
			/>
			<div
				class="absolute md:left-[3px] top-16 md:top-20 flex md:flex-col justify-center items-center gap-4"
			>
				<a
					href="https://www.instagram.com/gallerysonder/"
					class="w-4 text-dark-primary hover:text-accent-pink active:text-black transition-colors bump scale-75"
					aria-label="Visit Gallery Sonder on Instagram"
				>
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-[2em]"
						><path
							d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
						/></svg
					>
				</a>
			</div>
		</div>

		<div
			class="sm:pl-20 md:ml-2 flex flex-col md:flex-row justify-between items-start md:items-end w-full md:mb-12 gap-4 md:gap-8"
		>
			<div class="gap-3 flex flex-col">
				<!-- h-6 (>=24px) is the a11y target-size minimum; the logo image stays h-3
					and is vertically centered in the slightly taller hit area. -->
				<a href="/" class="flex w-fit items-center h-6">
					<img src={logoExtendedE} alt="Gallery Sonder home" class="h-3 brightness-0 invert" />
				</a>
				<div style="color:{appState.backgroundColor}">
					3435 E Coast Highway, <br />
					Corona del Mar, CA 92625 <br />
					(949) 662-0077 <br />
					info@gallerysonder.com
				</div>
			</div>
			<div class="text-white text-xs md:text-md mb-8 md:mb-0">
				©{new Date().getFullYear()} &nbsp;&nbsp;|&nbsp;&nbsp; All Rights Reserved
			</div>
		</div>
	</ContentWidth>
</div>
