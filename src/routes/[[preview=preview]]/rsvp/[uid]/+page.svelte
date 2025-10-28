<script lang='ts'>
	import { page } from "$app/state";
    import ContentWidth from "$lib/components/ContentWidth.svelte";
	import { PrismicRichText } from "@prismicio/svelte";
    
    let submitted = false;
    let error = false;
    
    let formName: string;
    let formEmail: string;
    let formGuests: string;

    export let data;

    function toTitleCase(str:string) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
    
    const submitForm = async (formElement: HTMLFormElement) => {
        const formData = new FormData(formElement);
        
        const response = await fetch("/forms", { 
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            //@ts-ignore
            body: new URLSearchParams(formData).toString()
        });
        
        submitted = true;
        
        if (response.status !== 200)
            error = true;
    };
    
    const triggerSubmitButton = () => {
        const hiddenForm = document.getElementById('netlifyRsvpForm') as HTMLFormElement;
        
        if (hiddenForm) {
            const hiddenName = hiddenForm.querySelector('[name="name"]') as HTMLInputElement;
            const hiddenEmail = hiddenForm.querySelector('[name="email"]') as HTMLInputElement;
            const hiddenGuests = hiddenForm.querySelector('[name="guests"]') as HTMLInputElement;
            const hiddenEvent = hiddenForm.querySelector('[name="event"]') as HTMLInputElement;

            
            if (hiddenName) hiddenName.value = formName;
            if (hiddenEmail) hiddenEmail.value = formEmail;
            if (hiddenGuests) hiddenGuests.value = formGuests;
            if (hiddenEvent) hiddenEvent.value = data.page.data.name as string || data.page.uid
            
            submitForm(hiddenForm);
            console.log('submitted');
        }
    };
</script>

<style>
    input, textarea, select {
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 2px;
    }
</style>

<section class="w-screen min-h-lvh h-full flex bg-black text-white relative">
    <ContentWidth class="h-full flex flex-col md:flex-row items-start justify-start py-24 relative w-full">
        <div class="w-full md:w-1/2 flex flex-col items-start justify-start">
            <div class="text-white ml-0.5">{data.page.data.dates||""}</div>
            <h2 class="text-white ">{data.page.data.name||toTitleCase(data.page.uid)}</h2>
            <div class="text-white mt-12">
                <PrismicRichText field={data.page.data.body_text} />
            </div>
        </div>
        <div class="w-full md:w-1/2 flex flex-col gap-2 items-start">
            {#if !submitted}
                <p class="text-white">Name</p>
                <input 
                    type="text" 
                    name="name" 
                    bind:value={formName} 
                    required 
                    placeholder="first and last name" 
                    class="w-full max-w-md border-1 border-white p-2 mb-4" 
                />
                
                <p class="text-white">Email</p>
                <input 
                    type="email" 
                    name="email" 
                    bind:value={formEmail} 
                    required 
                    placeholder="you@domain.com" 
                    class="w-full max-w-md border-1 border-white p-2 mb-4" 
                />
                
                <p class="text-white">Number of Guests</p>
                <input 
                    type="number" 
                    name="guests" 
                    bind:value={formGuests} 
                    required 
                    placeholder="1" 
                    min="1" 
                    class="w-full max-w-xs border-1 border-white p-2 mb-4" 
                />
                
                
                <button 
                    type="submit" 
                    on:click={triggerSubmitButton} 
                    class="text-black border-b-2 bg-white hover:bg-gray-200 p-3 font-bold border-black cursor-pointer"
                >
                    Submit RSVP
                </button>
                 <div class="text-white absolute bottom-0 right-0">By clicking submit you agree to receive emails under the terms of our privacy policy.</div>
            {:else if error}
                <h2 class="text-white">We're sorry, there appears to be an error. Please email info@gallerysonder.com with your RSVP.</h2>
            {:else}
                <h2 class="text-white">Thank you for your RSVP!</h2>
            {/if}
        </div>
       
    </ContentWidth>
</section>