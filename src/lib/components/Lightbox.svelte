<script lang='ts'>
    import { isLightboxActive, lightboxImageUrl } from "$lib/stores/lightbox";
    import { isModalActive } from "$lib/stores/isModalActive";
	import { fade } from "svelte/transition";


    const closeModal = () => {

		isModalActive.set(false)
        isLightboxActive.set(false)
        lightboxImageUrl.set('')
		if (document.getElementsByTagName('body'))
			(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'auto';
	};
</script>


<div
		class="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-90 flex justify-center items-center z-40"
		transition:fade
	>
		<button class="absolute w-full h-full" on:click={closeModal}> </button>
		<div class="w-11/12 h-11/12 max-h-11/12 max-w-11/12 md:w-4/5 md:h-4/5 md:max-w-4/5 md:max-h-4/5">
			<img
				src={$lightboxImageUrl}
				alt="video thumbnail placeholder"
				class="w-full h-full object-contain"
			/>
			
		</div>
</div>
