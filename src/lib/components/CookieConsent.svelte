<script lang='ts'>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { getAppState } from '$lib/contexts/appState.svelte';
	import ContentWidth from './ContentWidth.svelte';
	import { fade } from 'svelte/transition';

	const appState = getAppState();

  export const cookieConsent = writable(false);

  let showModal = $state(false);
  let _hasConsented = $state(false);

  onMount(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== null) {
      const accepted = consent === 'true';
      cookieConsent.set(accepted);
      _hasConsented = true;

      if (accepted) {
        initializeFacebookPixel();
        
      }
    } else {
       appState.lockBodyScroll();

        setTimeout(()=>{
          showModal = true;
        }, 3000)
    }

  });

  function initializeFacebookPixel() {
    if (!window.fbq) {
      const queue: unknown[][] = [];
      const fbqFn: NonNullable<Window['fbq']> = (...args: unknown[]) => {
        if (fbqFn.callMethod) {
          fbqFn.callMethod(...args);
        } else {
          fbqFn.queue.push(args);
        }
      };
      fbqFn.push = fbqFn;
      fbqFn.loaded = true;
      fbqFn.version = '2.0';
      fbqFn.queue = queue;
      window.fbq = fbqFn;
      if (!window._fbq) window._fbq = fbqFn;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    }

    window.fbq('init', '1547698656610293');
    window.fbq('track', 'PageView');
  }

  function acceptCookies() {
    saveConsent(true);
    initializeFacebookPixel();
    showModal = false;
    appState.unlockBodyScroll();
  }

  function rejectCookies() {
    saveConsent(false);
    showModal = false;
    appState.unlockBodyScroll();
  }

  function saveConsent(accepted: boolean) {
    localStorage.setItem('cookieConsent', accepted.toString());
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    cookieConsent.set(accepted);
    _hasConsented = true;
  }
</script>

{#if showModal}

  <div 
    class="w-screen h-screen fixed top-0 left-0 z-50" 
    transition:fade
  >
  <div class='w-full h-full absolute top-0 left-0 blur-sm backdrop-blur-sm bg-black/40'></div>
    <ContentWidth class="relative z-10 flex justify-center md:justify-end h-full flex-col pb-5">
      
      <div class="z-20 relative flex flex-col items-start px-5 pt-10 w-full" style="background-color: {appState.backgroundColor}" >
        <p>We use cookies to track website usage and personalize content. 
        </p>
        <p>Click 'Accept' to allow all cookies or 'Reject' to limit to necessaries.
        </p>
      </div>

      <div class="z-20 relative flex flex-row gap-3 px-5 pt-5 pb-10 w-full" style="background-color: {appState.backgroundColor}">
         <button class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer" onclick={acceptCookies}>
          Accept
        </button>
        <button onclick={rejectCookies} class="uppercase bump text-primary border-b-2 border-white bg-black hover:bg-black/80 text-white p-3 font-bold border-primary bump cursor-pointer"
						>REJECT</button>
       
      </div>

      
    </ContentWidth>
  </div>
{/if}

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
