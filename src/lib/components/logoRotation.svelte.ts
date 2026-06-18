/**
 * Shared rotation state for <RotatingLogo>. Every instance reads the same index,
 * advanced by a single shared timer, so separate instances (the nav top-bar logo
 * and the in-menu logo) stay in lockstep and read as one continuous element
 * instead of drifting on independent intervals.
 */
const LOGO_COUNT = 5; // SONDER_O, _N, _D, _E, _R

let activeIndex = $state(0);
let timer: ReturnType<typeof setInterval> | undefined;

export function rotatingLogoIndex(): number {
	return activeIndex;
}

/** Starts the one shared ticker (idempotent; no-op on the server). */
export function startRotatingLogo(): void {
	if (timer || typeof window === 'undefined') return;
	timer = setInterval(() => {
		activeIndex = activeIndex < LOGO_COUNT - 1 && window.innerWidth > 768 ? activeIndex + 1 : 0;
	}, 4000);
}
