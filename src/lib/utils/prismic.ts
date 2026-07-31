import { createClient, isFilled, type ContentRelationshipField } from '@prismicio/client';
import type { AllDocumentTypes } from '../../prismicio-types';

type DocumentTypeId = AllDocumentTypes['type'];

let clientInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get a singleton Prismic client instance
 */
export function getPrismicClient() {
	if (!clientInstance) {
		clientInstance = createClient('gallerysonder');
	}
	return clientInstance;
}

/**
 * Fetch a document by type and UID, with error handling
 */
export async function fetchDocument<T = unknown>(
	type: DocumentTypeId,
	uid: string
): Promise<T | null> {
	try {
		const client = getPrismicClient();
		const document = await client.getByUID(type, uid);
		return document.data as T;
	} catch (error) {
		console.error(`Error fetching ${type} with uid ${uid}:`, error);
		return null;
	}
}

/**
 * Fetch a document from a content relationship field
 */
export async function fetchFromRelationship<T = unknown>(
	relationship: ContentRelationshipField,
	type: DocumentTypeId
): Promise<T | null> {
	if (!isFilled.contentRelationship(relationship) || !relationship.uid) {
		return null;
	}

	return fetchDocument<T>(type, relationship.uid);
}

/**
 * Does an artist document have a page worth serving?
 *
 * Roughly half the artist docs are roster stubs: `full_name`, `first_name` and
 * `last_name` and nothing else, created so the artist exists as a relationship
 * target. Their route still resolved, rendering a hero with three empty <h1>s
 * over no background and no body — and the sitemap advertised every one of them
 * to crawlers.
 *
 * The check is deliberately artist-specific rather than a generic "has slices"
 * rule: `rsvp` documents legitimately have no slices, no background image and no
 * title lines (they model an event with `name`/`image`/`body_text`), so a shared
 * predicate would take seven live pages down with the stubs.
 *
 * Any one signal is enough, so a doc goes live the moment an editor adds the
 * first thing to it.
 */
export function artistHasPublicPage(data: {
	slices?: unknown[];
	background_image?: { url?: string | null } | null;
	title_line_one?: string | null;
	title_line_two?: string | null;
	title_line_three?: string | null;
}): boolean {
	if ((data.slices?.length ?? 0) > 0) return true;
	if (data.background_image?.url) return true;
	return [data.title_line_one, data.title_line_two, data.title_line_three].some(
		(line) => typeof line === 'string' && line.trim().length > 0
	);
}
