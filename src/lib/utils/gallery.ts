import { isFilled, type Client, type Slice } from '@prismicio/client';
import type { LinkField, ImageField, KeyTextField } from '@prismicio/client';
import type {
	AllDocumentTypes,
	ImageGallerySlice,
	ImageGallerySliceDefaultItem,
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
	const out: GalleryItem[] = [];

	for (const item of items) {
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
						itemData.bodyTwo = itemData.bodyTwo + '<br/>' + fetchedContent.dimensions;
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

		out.push(itemData);
	}

	return out;
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
