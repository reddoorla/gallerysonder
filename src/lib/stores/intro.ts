import { writable } from 'svelte/store';

export const isIntroRunning = writable(false);
export const hasIntroRun = writable(false);