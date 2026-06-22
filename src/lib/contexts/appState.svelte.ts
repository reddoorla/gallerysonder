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

	lockBodyScroll: () => void;
	unlockBodyScroll: () => void;
	prefetchArtwork: (uid: string) => void;
}

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

	const lockBodyScroll = () => {
		if (typeof document === 'undefined' || !document.body) return;
		// Lock only the vertical axis so app.html's `overflow-x: hidden` stays
		// intact (the `overflow` shorthand would clobber it and flash a horizontal
		// scrollbar). Nothing shifts sideways when the scrollbar vanishes because
		// `html { scrollbar-gutter: stable }` (app.css) keeps the gutter — and
		// therefore `100vw` — reserved whether or not the scrollbar is visible, so
		// no JS width compensation is needed.
		document.body.style.overflowY = 'hidden';
	};

	const unlockBodyScroll = () => {
		if (typeof document === 'undefined' || !document.body) return;
		document.body.style.overflowY = '';
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
