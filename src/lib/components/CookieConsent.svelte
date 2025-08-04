<!-- CookieConsent.svelte -->
<script lang='ts'>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { backgroundColor } from '$lib/stores/backgroundColor';
	import ContentWidth from './ContentWidth.svelte';
	import { fade, fly } from 'svelte/transition';

        //@ts-nocheck
  // Cookie consent store - simplified to just accepted/rejected
  export const cookieConsent = writable(false);

  let showModal = false;
  let hasConsented = false;

  // Check if user has already made a choice
  onMount(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== null) {
      const accepted = consent === 'true';
      cookieConsent.set(accepted);
      hasConsented = true;
      
      // Initialize tracking if accepted
      if (accepted) {
        initializeFacebookPixel();
        
      }
    } else {
       if (document.getElementsByTagName('body'))
			    (document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'hidden';

        setTimeout(()=>{
          showModal = true;
        }, 3000)
    }

  });



    

  function initializeFacebookPixel() {
    // Your existing Facebook Pixel code
//@ts-ignore
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    //@ts-ignore
    fbq('init', '1547698656610293');
    //@ts-ignore
    fbq('track', 'PageView');
  }

  function acceptCookies() {
    saveConsent(true);
    initializeFacebookPixel();
    showModal = false;
    if (document.getElementsByTagName('body'))
			(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'auto';
  }

  function rejectCookies() {
    saveConsent(false);
    showModal = false;
    if (document.getElementsByTagName('body'))
			(document.getElementsByTagName('body')[0] as HTMLElement).style.overflow = 'auto';
  }
  // @ts-ignore
  function saveConsent(accepted) {
    localStorage.setItem('cookieConsent', accepted.toString());
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    cookieConsent.set(accepted);
    hasConsented = true;
  }


  function resetConsent() {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    hasConsented = false;
    showModal = true;
    cookieConsent.set(false);
  }


  
</script>



<!-- Cookie Consent Modal -->
{#if showModal}

  <div 
    class="w-screen h-screen fixed top-0 left-0 z-50" 
    transition:fade
  >
  <div class='w-full h-full absolute top-0 left-0 blur-sm backdrop-blur-sm bg-black/40'></div>
    <ContentWidth class="relative z-10 flex justify-center md:justify-end h-full flex-col pb-5">
      
      <div class="z-20 relative flex flex-col items-start px-5 pt-10 w-full" style="background-color: {$backgroundColor}" >
        <p>We use cookies to track website usage and personalize content. 
        </p>
        <p>Click 'Accept' to allow all cookies or 'Reject' to limit to necessaries.
        </p>
      </div>

      <div class="z-20 relative flex flex-row gap-3 px-5 pt-5 pb-10 w-full" style="background-color: {$backgroundColor}">
         <button class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer" on:click={acceptCookies}>
          Accept
        </button>
        <button on:click={rejectCookies} class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer"
						>REJECT</button>
       
      </div>

      
    </ContentWidth>
  </div>
{/if}

<!-- Facebook Pixel NoScript (only if cookies accepted) -->
{#if $cookieConsent}
  <noscript>
    <img 
      height="1" 
      width="1" 
      style="display:none"
      src="https://www.facebook.com/tr?id=1547698656610293&ev=PageView&noscript=1"
      alt=""
    />
  </noscript>
{/if}

<style>
  .cookie-settings-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: #333;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 999;
    transition: transform 0.2s ease;
  }

  .cookie-settings-btn:hover {
    transform: scale(1.1);
  }

  .cookie-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
  }

  .cookie-modal {
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }






  .cookie-content {
    padding: 0 24px;
  }

  .cookie-content p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
  }





  .cookie-actions {
    display: flex;
    gap: 12px;
    padding: 24px;
    border-top: 1px solid #eee;
  }

  .btn {
    padding: 12px 24px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    font-size: 16px;
  }


  .cookie-footer {
    padding: 0 24px 24px;
    text-align: center;
    border-top: 1px solid #eee;
  }

  .current-choice {
    margin: 16px 0 8px;
    color: #666;
    font-size: 14px}
    </style>