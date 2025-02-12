import { writable } from 'svelte/store';

export const isLightboxActive = writable(false);
export const lightboxImageUrl = writable('');
