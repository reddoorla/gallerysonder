import { env } from '$env/dynamic/private';
import { createIngestEndpoint, type SubmissionPayload } from '@reddoorla/maintenance/forms';
import type { RequestHandler } from './$types';

// POST-only ingest endpoint; never prerendered.
export const prerender = false;

const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

// Typed + control keys are handled explicitly; everything else a hidden form
// carries (piece, artist, role, event, guests, company, appointment_*) is
// site-specific and bundled into `extra` for the dashboard's Extra fields JSON.
const CONTROL_KEYS = new Set(['bot-field', 'ts', 'form-name']);
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
	buildPayload: (body): SubmissionPayload => {
		const extra: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(body)) {
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
			...(Object.keys(extra).length ? { extra } : {})
		};
	}
});
