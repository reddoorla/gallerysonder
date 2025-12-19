import { getContext, setContext } from 'svelte';
import { createClient, isFilled } from '@prismicio/client';
import { type ArtistDocument, type ArtworkDocument } from '../../prismicio-types';

const APP_STATE_KEY = Symbol('APP_STATE');

export interface AppState {
	// Intro state
	isIntroRunning: boolean;
	hasIntroRun: boolean;

	// Modal & UI state
	isModalActive: boolean;
	isNewsletterActive: boolean;
	hasNewsletterBeenCleared: boolean;

	// Background colors
	backgroundColorDefault: string;
	backgroundColor: string;

	// Lightbox state
	isLightboxActive: boolean;
	showInquiryForm: boolean;
	lightboxImageUrl: string;
	activeArtworkUid: string;
	activeArtwork: ArtworkDocument<string> | null;
	activeArtist: ArtistDocument<string> | null;

	// Analytics
	utmParams: {
		source: string;
		medium: string;
		campaign: string;
		term: string;
		content: string;
	};
}

export function createAppState(): AppState {
	// Intro state
	let isIntroRunning = $state(false);
	let hasIntroRun = $state(false);

	// Modal & UI state
	let isModalActive = $state(false);
	let isNewsletterActive = $state(false);
	let hasNewsletterBeenCleared = $state(false);

	// Background colors
	let backgroundColorDefault = $state('#E4EEEA');
	let backgroundColor = $state('#E4EEEA');

	// Lightbox state
	let isLightboxActive = $state(false);
	let showInquiryForm = $state(false);
	let lightboxImageUrl = $state('');
	let activeArtworkUid = $state('');
	let activeArtwork = $state<ArtworkDocument<string> | null>(null);
	let activeArtist = $state<ArtistDocument<string> | null>(null);

	// Analytics
	let utmParams = $state({
		source: '',
		medium: '',
		campaign: '',
		term: '',
		content: ''
	});

	// Effect: Sync backgroundColor with backgroundColorDefault
	// Replaces backgroundColor.ts:6-8
	$effect(() => {
		backgroundColor = backgroundColorDefault;
	});

	// Effect: Fetch artwork data when activeArtworkUid changes
	// Replaces lightbox.ts:30-33 module-level subscription
	$effect(() => {
		const uid = activeArtworkUid;

		async function fetchArtwork() {
			if (uid) {
				const client = createClient('gallerysonder');
				activeArtist = null; // Reset to prevent stale data

				try {
					const artwork = await client.getByUID('artwork', uid);
					activeArtwork = artwork;

					if (isFilled.contentRelationship(artwork?.data.artist)) {
						const artistUID = artwork?.data.artist.uid;
						if (artistUID) {
							activeArtist = await client.getByUID('artist', artistUID);
						}
					}
				} catch (error) {
					console.error('Error fetching artwork:', error);
					activeArtwork = null;
					activeArtist = null;
				}
			} else {
				activeArtwork = null;
				activeArtist = null;
			}
		}

		fetchArtwork();
	});

	// Return reactive state object with getters/setters
	return {
		get isIntroRunning() {
			return isIntroRunning;
		},
		set isIntroRunning(value) {
			isIntroRunning = value;
		},

		get hasIntroRun() {
			return hasIntroRun;
		},
		set hasIntroRun(value) {
			hasIntroRun = value;
		},

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

		get utmParams() {
			return utmParams;
		},
		set utmParams(value) {
			utmParams = value;
		}
	};
}

export function setAppState() {
	return setContext(APP_STATE_KEY, createAppState());
}

export function getAppState(): AppState {
	return getContext(APP_STATE_KEY);
}
