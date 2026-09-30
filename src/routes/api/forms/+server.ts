import { env } from '$env/dynamic/private';
import { createIngestEndpoint, type SubmissionPayload } from '@reddoorla/maintenance/forms';
import { replyCopyFor } from '$lib/server/reply-copy';
import { buildIngestPayload } from '$lib/server/forms-payload';
import type { RequestHandler } from './$types';

// POST-only ingest endpoint; never prerendered.
export const prerender = false;

const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

export const POST: RequestHandler = createIngestEndpoint({
	getConfig: () => ({ url: env.FORMS_INGEST_URL, token: env.FORMS_INGEST_TOKEN }),
	buildPayload: async (body, event): Promise<SubmissionPayload> => {
		const formType = str(body.formType);
		// Resolved from Prismic server-side off the uid alone, never from the
		// request body. Undefined whenever nothing is authored or Prismic is
		// unreachable, and the shared package then sends what it sends today.
		const reply = formType ? await replyCopyFor(event, formType, str(body.event_uid)) : undefined;
		return buildIngestPayload(body, reply);
	}
});
