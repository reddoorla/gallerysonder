import { createClient, isFilled, type ContentRelationshipField } from '@prismicio/client';

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
export async function fetchDocument<T = any>(
	type: string,
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
export async function fetchFromRelationship<T = any>(
	relationship: ContentRelationshipField,
	type: string
): Promise<T | null> {
	if (!isFilled.contentRelationship(relationship) || !relationship.uid) {
		return null;
	}

	return fetchDocument<T>(type, relationship.uid);
}
