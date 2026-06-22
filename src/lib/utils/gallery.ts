import { isFilled, type Client, type Slice } from '@prismicio/client';
import type { LinkField, ImageField, KeyTextField } from '@prismicio/client';
import type {
	AllDocumentTypes,
	ImageGallerySlice,
	ImageGallerySliceDefaultItem,
	NameListSlice,
	NameListSliceDefaultItem,
	ArtworkDocumentData,
	ArtistDocumentData,
	ExhibitDocumentData,
	NewsDocumentData
} from '../../prismicio-types';

type DocumentTypeId = AllDocumentTypes['type'];

/**
 * Shape consumed by Gallery.svelte / GridImage.svelte. Kept in sync with the
 * (previously client-side) builder in Gallery.svelte so SSR output is identical.
 */
export interface GalleryItem {
	titleOne: string | KeyTextField;
	titleTwo: string | KeyTextField;
	eyebrow: string | KeyTextField;
	image: ImageField<never>;
	bodyOne: string | KeyTextField;
	bodyTwo: string | KeyTextField;
	buttonText: string | KeyTextField;
	buttonLink: LinkField;
	artUID: string;
	willOpen: boolean;
}

/** An image_gallery slice with its relationships pre-resolved at load time. */
export type ResolvedImageGallerySlice = ImageGallerySlice & {
	resolvedItems?: GalleryItem[];
};

async function fetchData<T = unknown>(
	client: Client,
	type: DocumentTypeId,
	uid: string
): Promise<T | null> {
	try {
		const document = await client.getByUID(type, uid);
		return document.data as T;
	} catch (error) {
		console.error(`Error resolving ${type} with uid ${uid}:`, error);
		return null;
	}
}

/**
 * Resolve the content relationships of a single image_gallery slice into the
 * flat GalleryItem[] the components render. This is a server-side port of the
 * logic that used to run client-side in Gallery.svelte's onMount, so the gallery
 * can be server-rendered (fixing the spinner->grid CLS and the slow gallery LCP).
 */
export async function resolveGalleryItems(
	client: Client,
	slice: ImageGallerySlice
): Promise<GalleryItem[]> {
	const items = (slice.items ?? []) as ImageGallerySliceDefaultItem[];

	// Resolve items in parallel: each item's artwork->artist lookup is independent,
	// so Promise.all turns the old 2N sequential round-trips into ~2 round-trips.
	return Promise.all(
		items.map(async (item) => {
			let artist = '';
			let title = '';

			const manualTitleOne = item.title_one;
			const manualTitleTwo = item.title_two;

			const itemData: GalleryItem = {
				titleOne: '',
				titleTwo: '',
				eyebrow: item.eyebrow,
				image: item.image,
				bodyOne: item.subtitle,
				bodyTwo: item.subtitle_two,
				buttonText: item.button_text,
				buttonLink: item.link,
				artUID: '',
				willOpen: slice.primary.will_open
			};

			if (isFilled.contentRelationship(item.artwork) && item.artwork.uid) {
				const fetchedContent = await fetchData<ArtworkDocumentData>(
					client,
					'artwork',
					item.artwork.uid
				);

				if (fetchedContent) {
					itemData.artUID = item.artwork.uid;

					if (!artist && isFilled.contentRelationship(fetchedContent.artist)) {
						const uid = fetchedContent.artist.uid;
						const artistContent = uid
							? await fetchData<ArtistDocumentData>(client, 'artist', uid)
							: null;
						if (artistContent) {
							artist = artistContent.full_name ?? '';
						}
					}
					title = fetchedContent.title ?? '';
					if (!isFilled.image(itemData.image)) itemData.image = fetchedContent.primary_image;
					if (!itemData.bodyOne) itemData.bodyOne = fetchedContent.year;

					if (!itemData.bodyTwo) {
						itemData.bodyTwo = fetchedContent.medium;
						if (!itemData.bodyTwo) {
							itemData.bodyTwo = fetchedContent.dimensions;
						} else if (fetchedContent.dimensions) {
							// Newline (not <br/>): GridImage renders bodyTwo as escaped text with
							// `whitespace-pre-line`, so a literal \n becomes the line break.
							itemData.bodyTwo = itemData.bodyTwo + '\n' + fetchedContent.dimensions;
						}
					}
				}
			} else if (isFilled.contentRelationship(item.exhibition) && item.exhibition.uid) {
				const fetchedContent = await fetchData<ExhibitDocumentData>(
					client,
					'exhibit',
					item.exhibition.uid
				);

				if (fetchedContent) {
					itemData.willOpen = false;

					if (!itemData.eyebrow) itemData.eyebrow = fetchedContent.dates;

					if (!artist) {
						artist = fetchedContent.artist ?? '';
					}
					title = fetchedContent.title ?? '';
					if (!isFilled.image(itemData.image) && isFilled.image(fetchedContent.primary_image))
						itemData.image = fetchedContent.primary_image;
					if (!itemData.bodyOne) itemData.bodyOne = fetchedContent.short_description;
					if (!itemData.buttonText) itemData.buttonText = 'Explore';
					if (!isFilled.link(itemData.buttonLink))
						itemData.buttonLink = {
							link_type: 'Web',
							url: '/exhibitions/' + item.exhibition.uid
						};
				}
			} else if (isFilled.contentRelationship(item.news) && item.news.uid) {
				const fetchedContent = await fetchData<NewsDocumentData>(client, 'news', item.news.uid);

				if (fetchedContent) {
					itemData.willOpen = false;
					title = fetchedContent.full_name ?? '';
					if (!isFilled.image(itemData.image))
						itemData.image = fetchedContent.nav_image || fetchedContent.background_image;

					if (!isFilled.link(itemData.buttonLink))
						itemData.buttonLink = {
							link_type: 'Web',
							url: '/news/' + item.news.uid
						};
				}
			}

			if (manualTitleOne) {
				itemData.titleOne = manualTitleOne;
			} else {
				itemData.titleOne = artist || title;
			}

			if (manualTitleTwo) {
				itemData.titleTwo = manualTitleTwo;
			} else {
				itemData.titleTwo = artist ? title : '';
			}

			return itemData;
		})
	);
}

/**
 * Walk a document's slices and attach resolvedItems to every image_gallery
 * slice in place. Call from a page's server load() so the gallery ships in the
 * prerendered/SSR HTML. Failures per-gallery are swallowed so the component
 * falls back to its client-side fetch.
 */
export async function resolveGalleries(client: Client, slices: Slice[] | undefined): Promise<void> {
	if (!Array.isArray(slices)) return;

	await Promise.all(
		slices.map(async (slice) => {
			if (slice?.slice_type !== 'image_gallery') return;
			try {
				(slice as ResolvedImageGallerySlice).resolvedItems = await resolveGalleryItems(
					client,
					slice as ImageGallerySlice
				);
			} catch (error) {
				console.error('Error resolving image_gallery slice:', error);
			}
		})
	);
}

/** Shape consumed by NameList/index.svelte (server-side port of its onMount). */
export interface NameListItem {
	activeImage: string;
	color: string;
	link: LinkField;
	doubleHeight: boolean;
	/** Accessible name for the artist (the name is otherwise only an image). */
	label: string;
}

/** A name_list slice with its artist relationships pre-resolved at load time. */
export type ResolvedNameListSlice = NameListSlice & {
	resolvedItems?: NameListItem[];
};

async function resolveNameListItems(client: Client, slice: NameListSlice): Promise<NameListItem[]> {
	const items = (slice.items ?? []) as NameListSliceDefaultItem[];

	return Promise.all(
		items.map(async (item) => {
			const data: NameListItem = {
				activeImage: item.artist_active_image?.url || '',
				color: item.artist_color || '#E4EEEA',
				link: item.artist_page || { link_type: 'Web', url: '' },
				doubleHeight: item.doubleheight || false,
				label: item.artist_active_image?.alt || ''
			};

			if (isFilled.contentRelationship(item.artist) && item.artist.uid) {
				const fetchedArtist = await fetchData<ArtistDocumentData>(
					client,
					'artist',
					item.artist.uid
				);
				if (fetchedArtist) {
					if (
						!isFilled.image(item.artist_active_image) &&
						isFilled.image(fetchedArtist.nav_image)
					) {
						data.activeImage = fetchedArtist.nav_image.url || '';
					}
					if (!item.artist_color && fetchedArtist.artist_color) {
						data.color = fetchedArtist.artist_color;
					}
					if (!isFilled.link(item.artist_page)) {
						data.link = { link_type: 'Web', url: '/artists/' + item.artist.uid };
					}
				}
				if (!data.label) data.label = fetchedArtist?.full_name || item.artist.uid || '';
			}

			// Final fallback so the name image always has an accessible name even when
			// the CMS alt is blank and there's no artist relationship (the home
			// "Explore" items link straight to /artists/<slug>). Derive it from the
			// link slug, e.g. "/artists/ruben-benjamin" -> "Ruben Benjamin".
			if (!data.label) {
				const url = 'url' in data.link ? (data.link.url ?? '') : '';
				const slug = url.split('/').filter(Boolean).pop() ?? '';
				if (slug)
					data.label = slug
						.split('-')
						.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
						.join(' ');
			}

			// Cap the served height of the (raster) name image to ~2x its largest
			// display size so we don't ship a full-res PNG for a small wordmark
			// (Lighthouse "properly size images"). fit=max never upscales.
			if (
				data.activeImage.startsWith('https://images.prismic.io') &&
				data.activeImage.includes('?')
			) {
				data.activeImage += `&h=${data.doubleHeight ? 320 : 160}&fit=max`;
			}

			return data;
		})
	);
}

/**
 * Walk a document's slices and attach resolvedItems to every name_list slice in
 * place, mirroring resolveGalleries — so the artist list is server-rendered
 * instead of client-fetched on mount (kills the "Loading artists..." flash/CLS).
 */
export async function resolveNameLists(client: Client, slices: Slice[] | undefined): Promise<void> {
	if (!Array.isArray(slices)) return;

	await Promise.all(
		slices.map(async (slice) => {
			if (slice?.slice_type !== 'name_list') return;
			try {
				(slice as ResolvedNameListSlice).resolvedItems = await resolveNameListItems(
					client,
					slice as NameListSlice
				);
			} catch (error) {
				console.error('Error resolving name_list slice:', error);
			}
		})
	);
}
