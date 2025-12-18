<!-- SplitContent.svelte -->
<script lang="ts">
    import { slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    import { backgroundColor } from '$lib/stores/backgroundColor';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
    
    interface HTMLElementWithOuterHTML extends HTMLElement {
      outerHTML: string;
    }
    
    export let showFullBody: boolean = false;
 
    export let maxHeight: number = 400;
    
    let contentDiv: HTMLElement | null = null;
    let visibleContent: HTMLElementWithOuterHTML[] = [];
    let hiddenContent: HTMLElementWithOuterHTML[] = [];
    let shouldShowGradient: boolean = false;
    
    function splitContent(): void {
      if (!contentDiv) return;
      
      let elements = Array.from(contentDiv.children) as HTMLElementWithOuterHTML[];
      const visibleElements: HTMLElementWithOuterHTML[] = [];
      const hiddenElements: HTMLElementWithOuterHTML[] = [];
      let currentHeight = 0;
      if(elements.length>0)
        visibleElements.push(elements.shift() as HTMLElementWithOuterHTML);
      
      
      for (const element of elements) {
        const { offsetTop, offsetHeight } = element;
        if (offsetTop + offsetHeight <= maxHeight) {
          visibleElements.push(element);
          currentHeight = offsetTop + offsetHeight;
        } else {
          hiddenElements.push(element);
        }
      }
      
      shouldShowGradient = hiddenElements.length > 0;
      visibleContent = visibleElements;
      hiddenContent = hiddenElements;
    }

    onNavigate(()=>splitContent());
    onMount(()=>{setTimeout(()=>splitContent(),25)});
    
    $: if (contentDiv) splitContent();
  </script>
  
  <div class="relative">
    <!-- Measurement div (hidden) -->
    <div 
      bind:this={contentDiv} 
      class="absolute invisible"
      aria-hidden="true"
    >
      <slot />
    </div>
    
    <!-- Actual content -->
    {#if visibleContent}
      <!-- Always visible content -->
      <div class="space-y-4">
        {#each visibleContent as element}
          {@html element.outerHTML}
        {/each}
      </div>
      
      <!-- Expandable content -->
      {#if showFullBody && hiddenContent}
        <div 
          transition:slide={{ duration: 400, easing: cubicOut }}
          class="space-y-4"
        >
          {#each hiddenContent as element}
            {@html element.outerHTML}
          {/each}
        </div>
      {/if}
      
      <!-- Gradient overlay -->
      {#if shouldShowGradient && !showFullBody}
        <div 
          class="absolute bottom-0 left-0 w-full"
          transition:slide={{duration: 300, easing: cubicOut}}
        >
          <div
            class="h-12 w-full transition-opacity duration-300"
            style="background: linear-gradient(to top, {$backgroundColor} 20%, rgba(255, 255, 255, 0) 100%)"
          ></div>
        </div>
      {/if}
    {/if}
  </div>