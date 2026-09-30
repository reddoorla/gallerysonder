// What /api/forms hands central ingest (src/lib/server/forms-payload.ts). No
// browser: the builder is pure. The testMode cases are the lead-safety half of
// form-e2e — central short-circuits only on a TOP-LEVEL `testMode: true`, so a
// marker that lands anywhere else is a probe stored, counted and emailed as a
// real lead.

import { test, expect } from '@playwright/test';
import { buildIngestPayload } from '../../src/lib/server/forms-payload';

const contact = {
	name: 'Ada Lovelace',
	company: 'Analytical Engines',
	phone: '555-555-0123',
	email: 'ada@example.com',
	'bot-field': '',
	appointment_date: '10-07-2026',
	appointment_time: 'Afternoon',
	message: 'Looking to visit.',
	formType: 'contact',
	sourceUrl: 'https://gallerysonder.com/contact',
	utm: 'utm_source=ig'
};

test('a real submission maps typed fields and bundles the rest into extra', () => {
	expect(buildIngestPayload(contact)).toEqual({
		formType: 'contact',
		name: 'Ada Lovelace',
		email: 'ada@example.com',
		phone: '555-555-0123',
		message: 'Looking to visit.',
		sourceUrl: 'https://gallerysonder.com/contact',
		utm: 'utm_source=ig',
		extra: {
			company: 'Analytical Engines',
			appointment_date: '10-07-2026',
			appointment_time: 'Afternoon'
		}
	});
});

test('the probe’s testMode marker is forwarded top-level and kept out of extra', () => {
	const payload = buildIngestPayload({ ...contact, testMode: true });
	expect(payload.testMode).toBe(true);
	expect(payload.extra).not.toHaveProperty('testMode');
});

test('only a boolean true is a marker', () => {
	for (const testMode of ['true', 1, 'yes', false, null]) {
		const payload = buildIngestPayload({ ...contact, testMode });
		expect(payload).not.toHaveProperty('testMode');
		expect(payload.extra).not.toHaveProperty('testMode');
	}
});

test('a real submission carries no testMode key at all', () => {
	expect(buildIngestPayload(contact)).not.toHaveProperty('testMode');
});

test('underscore keys never reach central, and the server reply copy does', () => {
	const payload = buildIngestPayload(
		{ ...contact, _reply: { subject: 'forged' }, _meta: { ip: 'x' } },
		{ subject: 'Thanks' }
	);
	expect(payload._reply).toEqual({ subject: 'Thanks' });
	expect(payload.extra).not.toHaveProperty('_reply');
	expect(payload.extra).not.toHaveProperty('_meta');
});
