import { createClient } from '$lib/prismicio';
import { resolveReplyCopy } from '@reddoorla/maintenance/forms/prismic';
import { GALLERY_ADDRESS, absoluteUrl } from '$lib/site';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Confirmation-email copy for one submission, read from Prismic on the server.
 *
 * The `eventUid` is the ONLY thing taken from the request, and it is a lookup
 * key rather than content: the worst a forged POST achieves is naming a
 * different real exhibition, which sends that exhibition's real confirmation.
 * No text a visitor supplies can reach an outbound email — which matters
 * because the autoresponder mails a submitter-supplied address, so
 * submitter-authored body copy would make forms@reddoorla.com a phishing relay.
 *
 * Never throws: resolveReplyCopy swallows CMS failures and answers undefined,
 * and the caller then simply omits `_reply`. A Prismic outage costs the visitor
 * a personalized confirmation, never their submission.
 */
export async function replyCopyFor(
	event: RequestEvent,
	formType: string,
	eventUid: string | undefined
) {
	const client = createClient({ fetch: event.fetch });
	// The generated client's document type is a CLOSED union built from
	// `customtypes/`, so it cannot satisfy a `(type: string)` reader — and
	// `form_replies` is absent from that union entirely until the model is pushed
	// and `prismicio-types.d.ts` is regenerated. This adapter is the one place
	// that gap is asserted, rather than loosening the reader for every caller.
	// Asserting it is safe because the resolver treats a missing document exactly
	// as it treats an unwritten one: nothing authored, fall back.
	const reader = {
		getSingle: (type: string) => client.getSingle(type as never),
		getByUID: (type: string, uid: string) => client.getByUID(type as never, uid)
	};
	return resolveReplyCopy(reader, {
		formType,
		eventUid,
		defaultLocation: GALLERY_ADDRESS,
		eventUrl: eventUid ? absoluteUrl(`/rsvp/${eventUid}`) : undefined
	});
}
