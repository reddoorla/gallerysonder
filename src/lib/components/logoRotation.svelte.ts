/**
 * Shared rotation state for <RotatingLogo>. Every instance reads the same index,
 * advanced by a single shared timer, so separate instances (the nav top-bar logo
 * and the in-menu logo) stay in lockstep and read as one continuous element
 * instead of drifting on independent intervals.
 */
const LOGO_COUNT = 5; // SONDER_O, _N, _D, _E, _R

let activeIndex = $state(0);
let timer: ReturnType<typeof setInterval> | undefined;
let mountedCount = 0;

export function rotatingLogoIndex(): number {
	return activeIndex;
}

/**
 * Start the one shared ticker and return a cleanup. Reference-counted across
 * mounted <RotatingLogo> instances so the interval is cleared once the last one
 * unmounts (no leaked timer). No-op on the server.
 */
export function startRotatingLogo(): () => void {
	if (typeof window === 'undefined') return () => {};
	mountedCount++;
	if (!timer) {
		timer = setInterval(() => {
			activeIndex = activeIndex < LOGO_COUNT - 1 && window.innerWidth > 768 ? activeIndex + 1 : 0;
		}, 4000);
	}
	return () => {
		mountedCount = Math.max(0, mountedCount - 1);
		if (mountedCount === 0 && timer) {
			clearInterval(timer);
			timer = undefined;
		}
	};
}
