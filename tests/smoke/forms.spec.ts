// The four visitor forms (contact, inquiry, newsletter, rsvp) as the fleet
// sees them: real <form>s whose `required` fields block an empty submit, a
// `/api/forms` payload pinned field by field, a GA4 dataLayer push that waits
// for a 2xx, and the `testMode` marker the nightly form-e2e probe injects.
//
// Until 2026-09-30 the visible fields sat outside any <form> and were copied
// into hidden Netlify-era stubs in +layout.svelte. The payloads asserted here
// were captured from that implementation before it was removed, so a change to
// any key or value is a change to what the database, the notification email
// and the Mailchimp fanout receive.
//
// Every `/api/forms` call is intercepted; nothing here reaches the ingest.

import { test, expect, type Page, type Route } from '@playwright/test';

type Body = Record<string, unknown>;
type Pushed = Record<string, unknown>;

const UTM_QUERY = 'utm_source=ig&utm_medium=social&utm_content=link_in_bio';

function interceptForms(page: Page, statuses: number[] = [200]) {
	const bodies: Body[] = [];
	let call = 0;
	return page
		.route('**/api/forms', async (route) => {
			bodies.push(JSON.parse(route.request().postData() || '{}'));
			const status = statuses[Math.min(call, statuses.length - 1)];
			call += 1;
			await route.fulfill({
				status,
				contentType: 'application/json',
				body: status === 200 ? '{"ok":true}' : '{"ok":false,"error":"nope"}'
			});
		})
		.then(() => bodies);
}

function holdForms(page: Page) {
	const held: Route[] = [];
	return page.route('**/api/forms', (route) => void held.push(route)).then(() => held);
}

function dataLayer(page: Page): Promise<Pushed[]> {
	return page.evaluate(
		() => (window as Window & { dataLayer?: Pushed[] }).dataLayer ?? []
	) as Promise<Pushed[]>;
}

const submissionEvents = async (page: Page) =>
	(await dataLayer(page)).filter((entry) => String(entry.event ?? '').endsWith('_submitted'));

async function goto(page: Page, path: string) {
	await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
	await page.goto(path);
	await page.waitForLoadState('networkidle');
}

async function markLikeTheProbe(page: Page, formSelector: string) {
	await page.evaluate((selector) => {
		const f = document.querySelector(selector)?.closest('form') ?? document.querySelector('form');
		if (!f) throw new Error('no form to mark');
		const mark = (form: HTMLFormElement) => {
			const add = (name: string, value: string) => {
				let el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
				if (!el) {
					el = document.createElement('input');
					el.type = 'hidden';
					el.name = name;
					form.appendChild(el);
				}
				el.value = value;
			};
			add('testMode', 'true');
			add('cf-turnstile-response', 'testmode-1x00000000000000000000AA');
		};
		mark(f as HTMLFormElement);
		window.addEventListener(
			'submit',
			(e) => {
				if (e.target instanceof HTMLFormElement) mark(e.target);
			},
			true
		);
	}, formSelector);
}

const contactSection = (page: Page) => page.locator('section[data-slice-variation="connect"]');
const contactSubmit = (page: Page) => contactSection(page).getByRole('button', { name: 'Connect' });

async function fillContact(page: Page) {
	const s = contactSection(page);
	await s.locator('[name="name"]').fill('Ada Lovelace');
	await s.locator('[name="company"]').fill('Analytical Engines');
	await s.locator('[name="phone"]').fill('555-555-0123');
	await s.locator('[name="email"]').fill('ada@example.com');
	await s.locator('[name="message"]').fill('Looking to visit.');
}

async function pickContactDate(page: Page): Promise<string> {
	return contactSection(page)
		.locator('input[name="appointment_date"]')
		.evaluate((el) => {
			const fp = (
				el as HTMLInputElement & { _flatpickr?: { setDate: (d: Date, t: boolean) => void } }
			)._flatpickr;
			if (!fp) throw new Error('flatpickr not attached');
			const d = new Date();
			d.setDate(d.getDate() + 7);
			fp.setDate(d, true);
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			return `${mm}-${dd}-${d.getFullYear()}`;
		});
}

async function pickContactTime(page: Page, label: string) {
	await contactSection(page).getByRole('button', { name: 'Preferred time of day' }).click();
	await contactSection(page).getByRole('option', { name: label }).click();
}

async function openInquiry(page: Page) {
	await goto(page, `/artists/theo-hirschfield?${UTM_QUERY}`);
	const card = page.locator('button[aria-label^="View "]').first();
	await card.scrollIntoViewIfNeeded();
	await card.click();
	await expect(page.locator('[role="dialog"]').getByText('Theo Hirschfield').first()).toBeVisible();
	await page.getByRole('button', { name: 'Inquire', exact: true }).click();
	await expect(page.locator('#lb-name')).toBeVisible();
}

async function fillInquiry(page: Page) {
	await page.locator('#lb-name').fill('Ada Lovelace');
	await page.locator('#lb-phone').fill('555-555-0123');
	await page.locator('#lb-email').fill('ada@example.com');
	await page.locator('#lb-message').fill('Is this available?');
	await page.locator('#role').selectOption('Art Advisor');
}

const inquirySubmit = (page: Page) =>
	page
		.locator('[role="dialog"]')
		.locator('button')
		.filter({ hasText: /^\s*Submit/ });

async function openNewsletter(page: Page) {
	await goto(page, `/?${UTM_QUERY}`);
	await page.locator('footer').scrollIntoViewIfNeeded();
	await page.locator('footer').getByText('Subscribe to our newsletter').click();
	await expect(page.locator('#newsletter-email')).toBeVisible();
}

const newsletterSubmit = (page: Page) =>
	page
		.locator('button')
		.filter({ hasText: 'Subscribe' })
		.filter({ hasNotText: /newsletter/i });

async function fillRsvp(page: Page) {
	await page.locator('#rsvp-name').fill('Ada Lovelace');
	await page.locator('#rsvp-email').fill('ada@example.com');
	await page.locator('#rsvp-guests').fill('3');
}

const rsvpSubmit = (page: Page) => page.getByRole('button', { name: 'Submit RSVP' });

test.describe('contact form', () => {
	test('the payload is unchanged, field by field', async ({ page }) => {
		const bodies = await interceptForms(page);
		await goto(page, `/contact?${UTM_QUERY}`);
		await fillContact(page);
		await pickContactTime(page, 'Afternoon');

		await contactSubmit(page).click();
		await expect(page.getByText('Thank you for reaching out!')).toBeVisible();

		expect(bodies).toHaveLength(1);
		expect(bodies[0]).toEqual({
			name: 'Ada Lovelace',
			company: 'Analytical Engines',
			phone: '555-555-0123',
			email: 'ada@example.com',
			'bot-field': '',
			appointment_date: '',
			appointment_time: 'Afternoon',
			message: 'Looking to visit.',
			formType: 'contact',
			sourceUrl: page.url(),
			utm: UTM_QUERY
		});
	});

	test('a chosen appointment date reaches the payload', async ({ page }) => {
		const bodies = await interceptForms(page);
		await goto(page, '/contact');
		await fillContact(page);
		const date = await pickContactDate(page);

		await contactSubmit(page).click();
		await expect.poll(() => bodies.length).toBe(1);
		expect(bodies[0].appointment_date).toBe(date);
	});

	test('required fields block an empty submit', async ({ page }) => {
		const bodies = await interceptForms(page);
		await goto(page, '/contact');

		await contactSubmit(page).click();
		await page.waitForTimeout(500);

		expect(bodies).toHaveLength(0);
		await expect(page.getByText('Thank you for reaching out!')).toHaveCount(0);
		expect(await submissionEvents(page)).toHaveLength(0);
	});

	test('the page’s first form is the contact form, as the form-e2e probe assumes', async ({
		page
	}) => {
		await goto(page, '/contact');
		const first = await page.evaluate(() => {
			const f = document.querySelector('form');
			return f ? !!f.closest('section[data-slice-variation="connect"]') : null;
		});
		expect(first).toBe(true);
	});

	test('the probe’s testMode marker is forwarded and the success banner is a status', async ({
		page
	}) => {
		const bodies = await interceptForms(page);
		await goto(page, '/contact');
		await fillContact(page);
		await markLikeTheProbe(page, 'form');

		await page.locator('button[type="submit"], input[type="submit"]').first().click();
		await expect(page.locator('[role="status"]').first()).toBeVisible();

		expect(bodies).toHaveLength(1);
		expect(bodies[0].testMode).toBe(true);
		expect(bodies[0].formType).toBe('contact');
	});

	test('GA4 hears nothing until the ingest answers, and then only on a 2xx', async ({ page }) => {
		const held = await holdForms(page);
		await goto(page, '/contact');
		await fillContact(page);

		await contactSubmit(page).click();
		await expect.poll(() => held.length).toBe(1);
		await page.waitForTimeout(300);
		expect(await submissionEvents(page)).toHaveLength(0);

		await held[0].fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
		await expect.poll(async () => (await submissionEvents(page)).length).toBe(1);
		const [pushed] = await submissionEvents(page);
		expect(pushed).toEqual({ event: 'contact_submitted', form_type: 'contact' });
	});

	test('a failed contact submission announces nothing and says so', async ({ page }) => {
		await interceptForms(page, [502]);
		await goto(page, '/contact');
		await fillContact(page);

		await contactSubmit(page).click();
		await expect(page.getByRole('alert')).toBeVisible();
		await page.waitForTimeout(500);
		expect(await submissionEvents(page)).toHaveLength(0);
	});
});

test.describe('inquiry form', () => {
	test('the payload is unchanged, field by field', async ({ page }) => {
		const bodies = await interceptForms(page);
		await openInquiry(page);
		await fillInquiry(page);

		await inquirySubmit(page).click();
		await expect(page.getByText('Thank you for reaching out!')).toBeVisible();

		expect(bodies).toHaveLength(1);
		const { piece, artist } = bodies[0] as { piece: string; artist: string };
		expect(piece).toMatch(/^.+, \d{4}$/);
		expect(artist).toBe('Theo Hirschfield');
		expect(bodies[0]).toEqual({
			name: 'Ada Lovelace',
			phone: '555-555-0123',
			email: 'ada@example.com',
			'bot-field': '',
			message: 'Is this available?',
			piece,
			artist,
			role: 'Art Advisor',
			formType: 'inquiry',
			sourceUrl: page.url(),
			utm: UTM_QUERY
		});
	});

	test('required fields block an empty submit', async ({ page }) => {
		const bodies = await interceptForms(page);
		await openInquiry(page);

		await inquirySubmit(page).click();
		await page.waitForTimeout(500);

		expect(bodies).toHaveLength(0);
		await expect(page.getByText('Thank you for reaching out!')).toHaveCount(0);
	});

	test('the testMode marker is forwarded', async ({ page }) => {
		const bodies = await interceptForms(page);
		await openInquiry(page);
		await fillInquiry(page);
		await markLikeTheProbe(page, '#lb-email');

		await inquirySubmit(page).click();
		await expect(page.locator('[role="status"]').first()).toBeVisible();
		expect(bodies[0].testMode).toBe(true);
		expect(bodies[0].formType).toBe('inquiry');
	});

	test('GA4 waits for a 2xx and carries only the allow-listed fields', async ({ page }) => {
		const held = await holdForms(page);
		await openInquiry(page);
		await fillInquiry(page);

		await inquirySubmit(page).click();
		await expect.poll(() => held.length).toBe(1);
		await page.waitForTimeout(300);
		expect(await submissionEvents(page)).toHaveLength(0);

		const sent = JSON.parse(held[0].request().postData() || '{}') as Body;
		await held[0].fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
		await expect.poll(async () => (await submissionEvents(page)).length).toBe(1);
		const [pushed] = await submissionEvents(page);
		expect(pushed).toEqual({
			event: 'inquiry_submitted',
			form_type: 'inquiry',
			piece: sent.piece,
			artist: sent.artist,
			role: 'Art Advisor',
			utm_source: 'ig',
			utm_medium: 'social',
			utm_content: 'link_in_bio'
		});
	});

	test('a failed inquiry announces nothing', async ({ page }) => {
		await interceptForms(page, [500]);
		await openInquiry(page);
		await fillInquiry(page);

		await inquirySubmit(page).click();
		await expect(page.getByRole('alert')).toBeVisible();
		await page.waitForTimeout(500);
		expect(await submissionEvents(page)).toHaveLength(0);
	});
});

test.describe('newsletter form', () => {
	test('the payload is unchanged, field by field', async ({ page }) => {
		const bodies = await interceptForms(page);
		await openNewsletter(page);
		await page.locator('#newsletter-email').fill('  reader@example.com ');

		await newsletterSubmit(page).click();
		await expect(page.getByText('Thank you for joining')).toBeVisible();

		expect(bodies).toHaveLength(1);
		expect(bodies[0]).toEqual({
			'bot-field': '',
			email: 'reader@example.com',
			formType: 'newsletter',
			sourceUrl: page.url(),
			utm: UTM_QUERY
		});
	});

	test('the empty-email message still shows, and nothing is sent', async ({ page }) => {
		const bodies = await interceptForms(page);
		await openNewsletter(page);

		await newsletterSubmit(page).click();
		await expect(page.getByText('Please enter your email address.')).toBeVisible();
		expect(bodies).toHaveLength(0);
	});

	test('the testMode marker is forwarded', async ({ page }) => {
		const bodies = await interceptForms(page);
		await openNewsletter(page);
		await page.locator('#newsletter-email').fill('reader@example.com');
		await markLikeTheProbe(page, '#newsletter-email');

		await newsletterSubmit(page).click();
		await expect(page.locator('[role="status"]').first()).toBeVisible();
		expect(bodies[0].testMode).toBe(true);
		expect(bodies[0].formType).toBe('newsletter');
	});

	test('GA4 hears nothing until the ingest answers 2xx', async ({ page }) => {
		const held = await holdForms(page);
		await openNewsletter(page);
		await page.locator('#newsletter-email').fill('reader@example.com');

		await newsletterSubmit(page).click();
		await expect.poll(() => held.length).toBe(1);
		await page.waitForTimeout(300);
		expect(await submissionEvents(page)).toHaveLength(0);

		await held[0].fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
		await expect.poll(async () => (await submissionEvents(page)).length).toBe(1);
	});
});

test.describe('rsvp form', () => {
	test('the payload is unchanged, field by field', async ({ page }) => {
		const bodies = await interceptForms(page);
		await goto(page, `/rsvp/euphorbia?${UTM_QUERY}`);
		const eventName = (await page.locator('section h2').first().textContent())?.trim();
		await fillRsvp(page);

		await rsvpSubmit(page).click();
		await expect(page.getByText('Thank you for your RSVP!')).toBeVisible();

		expect(bodies).toHaveLength(1);
		expect(bodies[0]).toEqual({
			'bot-field': '',
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			event: eventName,
			event_uid: 'euphorbia',
			guests: '3',
			formType: 'rsvp',
			sourceUrl: page.url(),
			utm: UTM_QUERY
		});
	});

	test('required fields block an empty submit', async ({ page }) => {
		const bodies = await interceptForms(page);
		await goto(page, '/rsvp/euphorbia');

		await rsvpSubmit(page).click();
		await page.waitForTimeout(500);

		expect(bodies).toHaveLength(0);
		await expect(page.getByText('Thank you for your RSVP!')).toHaveCount(0);
		expect(await submissionEvents(page)).toHaveLength(0);
	});

	test('the testMode marker is forwarded', async ({ page }) => {
		const bodies = await interceptForms(page);
		await goto(page, '/rsvp/euphorbia');
		await fillRsvp(page);
		await markLikeTheProbe(page, '#rsvp-email');

		await rsvpSubmit(page).click();
		await expect(page.locator('[role="status"]').first()).toBeVisible();
		expect(bodies[0].testMode).toBe(true);
		expect(bodies[0].formType).toBe('rsvp');
	});

	test('GA4 hears nothing until the ingest answers 2xx', async ({ page }) => {
		const held = await holdForms(page);
		await goto(page, '/rsvp/euphorbia');
		await fillRsvp(page);

		await rsvpSubmit(page).click();
		await expect.poll(() => held.length).toBe(1);
		await page.waitForTimeout(300);
		expect(await submissionEvents(page)).toHaveLength(0);

		await held[0].fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
		await expect.poll(async () => (await submissionEvents(page)).length).toBe(1);
		const [pushed] = await submissionEvents(page);
		expect(pushed.event).toBe('rsvp_submitted');
		expect(pushed.exhibition_uid).toBe('euphorbia');
	});
});

test('/health declares testMode forwarding for the form-e2e probe', async ({ request }) => {
	const res = await request.get('/health');
	expect(res.ok()).toBe(true);
	const body = await res.json();
	expect(body.forms.testMode).toBe(true);
});
