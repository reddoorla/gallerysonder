import type { SubmissionPayload } from '@reddoorla/maintenance/forms';

const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

// Typed + control keys are handled explicitly; everything else a form carries
// (piece, artist, role, event, guests, company, appointment_*) is site-specific
// and bundled into `extra` for the dashboard's Extra fields JSON.
// `cf-turnstile-response` is read into transient `_meta` by createIngestEndpoint
// for central verification — keep it out of the persisted `extra` bag.
// `event_uid` is a CMS lookup key, not lead data: it selects which event's
// confirmation copy to send and has no business in the notification table.
// `testMode` is the form-e2e probe's marker. It travels top-level or not at all:
// in `extra` central would not see it, and the probe would land as a real lead.
const CONTROL_KEYS = new Set([
	'bot-field',
	'ts',
	'form-name',
	'cf-turnstile-response',
	'event_uid',
	'testMode'
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

export function buildIngestPayload(
	body: Record<string, unknown>,
	reply?: unknown
): SubmissionPayload {
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
	return {
		formType: str(body.formType),
		name: str(body.name),
		email: str(body.email),
		phone: str(body.phone),
		message: str(body.message),
		sourceUrl: str(body.sourceUrl),
		utm: str(body.utm),
		...(Object.keys(extra).length ? { extra } : {}),
		...(reply ? { _reply: reply } : {}),
		...(body.testMode === true ? { testMode: true } : {})
	};
}
