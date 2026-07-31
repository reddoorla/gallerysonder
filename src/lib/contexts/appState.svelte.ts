import { getContext, onMount, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { isFilled } from '@prismicio/client';
import type { ArtistDocument, ArtworkDocument } from '../../prismicio-types';
import { getPrismicClient } from '$lib/utils/prismic';

const APP_STATE_KEY = Symbol('APP_STATE');

export interface AppState {
	isModalActive: boolean;
	isNewsletterActive: boolean;
	hasNewsletterBeenCleared: boolean;

	backgroundColorDefault: string;
	backgroundColor: string;

	isLightboxActive: boolean;
	showInquiryForm: boolean;
	lightboxImageUrl: string;
	lightboxImageAlt: string;
	activeArtworkUid: string;
	activeArtwork: ArtworkDocument<string> | null;
	activeArtist: ArtistDocument<string> | null;
	activeArtworkError: boolean;

	utmParams: {
		source: string;
		medium: string;
		campaign: string;
		term: string;
		content: string;
	};

	lockBodyScroll: (owner?: ScrollLockOwner) => void;
	unlockBodyScroll: (owner?: ScrollLockOwner) => void;
	prefetchArtwork: (uid: string) => void;
}

/**
 * Who is holding the body-scroll lock. Overlays that can be open at the same
 * time need distinct keys. `lightbox` is owned solely by Lightbox's own effect,
 * which acquires and releases symmetrically — GridImage opens the lightbox but
 * deliberately takes no lock of its own.
 */
export type ScrollLockOwner =
	'nav' | 'newsletter' | 'lightbox' | 'cookie-consent' | 'content-width-media';

export function createAppState(): AppState {
	let isModalActive = $state(false);
	let isNewsletterActive = $state(false);
	let hasNewsletterBeenCleared = $state(false);

	let backgroundColorDefault = $state('#E4EEEA');
	let backgroundColor = $state('#E4EEEA');

	let isLightboxActive = $state(false);
	let showInquiryForm = $state(false);
	let lightboxImageUrl = $state('');
	let lightboxImageAlt = $state('');
	let activeArtworkUid = $state('');
	let activeArtwork = $state<ArtworkDocument<string> | null>(null);
	let activeArtist = $state<ArtistDocument<string> | null>(null);
	let activeArtworkError = $state(false);

	let lastFetchedUid = '';
	let isFetching = false;

	// Hover-prefetch cache: hovering a gallery item warms the artwork doc (and its
	// primary image) so opening the lightbox is instant — no fetch spinner, no
	// image pop-in. Best-effort; failures are swallowed (the real fetch on click
	// surfaces any error).
	const artworkCache = new SvelteMap<string, ArtworkDocument<string>>();

	let utmParams = $state({
		source: '',
		medium: '',
		campaign: '',
		term: '',
		content: ''
	});

	onMount(() => {
		backgroundColor = backgroundColorDefault;
	});

	async function fetchArtwork(uid: string) {
		if (uid && uid !== lastFetchedUid && !isFetching) {
			isFetching = true;
			lastFetchedUid = uid;
			const client = getPrismicClient();
			activeArtist = null;
			activeArtworkError = false;

			// Reuse a hover-prefetched doc when present so the image shows instantly;
			// otherwise clear to null so the spinner shows while we fetch.
			const cached = artworkCache.get(uid);
			activeArtwork = cached ?? null;

			try {
				const artwork = cached ?? (await client.getByUID('artwork', uid));
				activeArtwork = artwork;

				if (isFilled.contentRelationship(artwork?.data.artist)) {
					const artistUID = artwork?.data.artist.uid;
					if (artistUID) {
						activeArtist = await client.getByUID('artist', artistUID);
					}
				}
			} catch (error) {
				console.error('[fetchArtwork] Error fetching artwork:', error);
				activeArtwork = null;
				activeArtist = null;
				activeArtworkError = true;
			} finally {
				isFetching = false;
			}
		} else if (!uid) {
			lastFetchedUid = '';
			activeArtwork = null;
			activeArtist = null;
		}
	}

	function prefetchArtwork(uid: string) {
		if (!uid || artworkCache.has(uid) || uid === lastFetchedUid) return;
		const client = getPrismicClient();
		client
			.getByUID('artwork', uid)
			.then((artwork) => {
				artworkCache.set(uid, artwork);
				// Warm the browser/imgix cache for the image the lightbox will render.
				if (
					typeof Image !== 'undefined' &&
					isFilled.image(artwork.data.primary_image) &&
					artwork.data.primary_image.url
				) {
					const img = new Image();
					img.src = artwork.data.primary_image.url;
				}
			})
			.catch(() => {
				// best-effort prefetch; ignore errors
			});
	}

	$effect(function syncArtworkDataWithUid() {
		const uid = activeArtworkUid;
		if (uid) {
			fetchArtwork(uid);
		} else {
			fetchArtwork('');
		}
	});

	// Tracked per owner rather than as a bare boolean: overlays overlap (opening
	// the newsletter from the nav menu closes the nav, and both run their own
	// lock/unlock $effect), and a single flag let whichever closed last release a
	// lock the other still needed — the page scrolled behind an open overlay.
	//
	// Keys rather than a counter, because several callers release in an $effect's
	// else-branch without ever having acquired; deleting an absent key is a no-op,
	// so the bookkeeping can't drift negative or double-release.
	//
	// A plain object, deliberately not a (Svelte)Set: these functions are called
	// FROM $effects, so reactive reads/writes here would make the nav and
	// newsletter lock effects invalidate one another. Nothing should subscribe.
	//
	// The tradeoff: releasing is now gated on every owner having let go, so a
	// stranded key is no longer cleared incidentally by some other overlay
	// closing. Every acquirer must have a guaranteed release path — see the
	// else-branch in Lightbox's effect and ContentWidthMedia's onDestroy.
	const scrollLockOwners: Partial<Record<ScrollLockOwner, true>> = {};

	const lockBodyScroll = (owner: ScrollLockOwner = 'nav') => {
		if (typeof document === 'undefined' || !document.body) return;
		scrollLockOwners[owner] = true;
		// Lock only the vertical axis so app.html's `overflow-x: hidden` stays
		// intact (the `overflow` shorthand would clobber it and flash a horizontal
		// scrollbar). Nothing shifts sideways when the scrollbar vanishes because
		// `html { scrollbar-gutter: stable }` (app.css) keeps the gutter — and
		// therefore `100vw` — reserved whether or not the scrollbar is visible, so
		// no JS width compensation is needed.
		document.body.style.overflowY = 'hidden';
	};

	const unlockBodyScroll = (owner: ScrollLockOwner = 'nav') => {
		if (typeof document === 'undefined' || !document.body) return;
		delete scrollLockOwners[owner];
		// Release only once every holder has let go.
		if (Object.keys(scrollLockOwners).length === 0) document.body.style.overflowY = '';
	};

	return {
		get isModalActive() {
			return isModalActive;
		},
		set isModalActive(value) {
			isModalActive = value;
		},

		get isNewsletterActive() {
			return isNewsletterActive;
		},
		set isNewsletterActive(value) {
			isNewsletterActive = value;
		},

		get hasNewsletterBeenCleared() {
			return hasNewsletterBeenCleared;
		},
		set hasNewsletterBeenCleared(value) {
			hasNewsletterBeenCleared = value;
		},

		get backgroundColorDefault() {
			return backgroundColorDefault;
		},
		set backgroundColorDefault(value) {
			backgroundColorDefault = value;
		},

		get backgroundColor() {
			return backgroundColor;
		},
		set backgroundColor(value) {
			backgroundColor = value;
		},

		get isLightboxActive() {
			return isLightboxActive;
		},
		set isLightboxActive(value) {
			isLightboxActive = value;
		},

		get showInquiryForm() {
			return showInquiryForm;
		},
		set showInquiryForm(value) {
			showInquiryForm = value;
		},

		get lightboxImageUrl() {
			return lightboxImageUrl;
		},
		set lightboxImageUrl(value) {
			lightboxImageUrl = value;
		},

		get lightboxImageAlt() {
			return lightboxImageAlt;
		},
		set lightboxImageAlt(value) {
			lightboxImageAlt = value;
		},

		get activeArtworkUid() {
			return activeArtworkUid;
		},
		set activeArtworkUid(value) {
			activeArtworkUid = value;
		},

		get activeArtwork() {
			return activeArtwork;
		},
		set activeArtwork(value) {
			activeArtwork = value;
		},

		get activeArtist() {
			return activeArtist;
		},
		set activeArtist(value) {
			activeArtist = value;
		},

		get activeArtworkError() {
			return activeArtworkError;
		},
		set activeArtworkError(value) {
			activeArtworkError = value;
		},

		get utmParams() {
			return utmParams;
		},
		set utmParams(value) {
			utmParams = value;
		},

		lockBodyScroll,
		unlockBodyScroll,
		prefetchArtwork
	};
}

export function setAppState() {
	return setContext(APP_STATE_KEY, createAppState());
}

export function getAppState(): AppState {
	return getContext(APP_STATE_KEY);
}
