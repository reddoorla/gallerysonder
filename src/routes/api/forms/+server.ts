import { env } from '$env/dynamic/private';
import { createIngestEndpoint, type SubmissionPayload } from '@reddoorla/maintenance/forms';
import { replyCopyFor } from '$lib/server/reply-copy';
import type { RequestHandler } from './$types';

// POST-only ingest endpoint; never prerendered.
export const prerender = false;

const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

// Typed + control keys are handled explicitly; everything else a hidden form
// carries (piece, artist, role, event, guests, company, appointment_*) is
// site-specific and bundled into `extra` for the dashboard's Extra fields JSON.
// `cf-turnstile-response` is read into transient `_meta` by createIngestEndpoint
// for central verification — keep it out of the persisted `extra` bag.
// `event_uid` is a CMS lookup key, not lead data: it selects which event's
// confirmation copy to send and has no business in the notification table.
const CONTROL_KEYS = new Set([
	'bot-field',
	'ts',
	'form-name',
	'cf-turnstile-response',
	'event_uid'
]);
const TYPED_KEYS = new Set([
	'formType',
	'name',
	'firstName',
	'lastName',
	'email',
	'phone',
	'message',
	'sourceUrl',
	'utm'
]);

export const POST: RequestHandler = createIngestEndpoint({
	getConfig: () => ({ url: env.FORMS_INGEST_URL, token: env.FORMS_INGEST_TOKEN }),
	buildPayload: async (body, event): Promise<SubmissionPayload> => {
		const extra: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(body)) {
			// Underscore keys are RESERVED transport in the ingest wire format. A
			// request can always claim one; dropping them here is what stops a bot
			// from posting its own `_reply` and dictating the text of an email sent
			// from a domain with real sending reputation. The ingest endpoint drops
			// them too — this is the near half of the same guard.
			if (k.startsWith('_')) continue;
			if (!CONTROL_KEYS.has(k) && !TYPED_KEYS.has(k)) extra[k] = v;
		}
		const formType = str(body.formType);
		// Resolved from Prismic server-side off the uid alone, never from the
		// request body. Undefined whenever nothing is authored or Prismic is
		// unreachable, and the shared package then sends what it sends today.
		const reply = formType ? await replyCopyFor(event, formType, str(body.event_uid)) : undefined;
		return {
			formType,
			name: str(body.name),
			email: str(body.email),
			phone: str(body.phone),
			message: str(body.message),
			sourceUrl: str(body.sourceUrl),
			utm: str(body.utm),
			...(Object.keys(extra).length ? { extra } : {}),
			...(reply ? { _reply: reply } : {})
		};
	}
});
