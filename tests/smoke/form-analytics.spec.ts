// The dataLayer contract behind the GTM Custom Event triggers
// (src/lib/utils/forms.ts → pushSubmissionEvent).
//
// This exists because the container's first RSVP tag fired on *Click - All
// Elements* where Click Text contains "Submit RSVP" — the button press, not the
// RSVP. These tests pin the two halves of the correction: a 2xx from the ingest
// endpoint announces the submission, and anything else announces nothing.
//
// Every submission is intercepted at `**/api/forms`, so nothing reaches the real
// ingest endpoint. Cookie consent is pre-answered 'false' in an init script:
// that dismisses the 3s consent modal (which would otherwise lock body scroll
// and steal clicks) AND leaves GTM uninjected, so `window.dataLayer` holds
// exactly what the site pushed and nothing a container replayed.

import { test, expect, type Page } from '@playwright/test';

type Pushed = Record<string, unknown>;

/** Reply to every `/api/forms` call with the given statuses, oldest first. */
function interceptForms(page: Page, statuses: number[] = [200]) {
	let call = 0;
	return page.route('**/api/forms', async (route) => {
		const status = statuses[Math.min(call, statuses.length - 1)];
		call += 1;
		await route.fulfill({
			status,
			contentType: 'application/json',
			body: status === 200 ? '{"ok":true}' : '{"ok":false,"error":"nope"}'
		});
	});
}

/** Everything the page has pushed onto the dataLayer so far. */
function dataLayer(page: Page): Promise<Pushed[]> {
	return page.evaluate(
		() => (window as Window & { dataLayer?: Pushed[] }).dataLayer ?? []
	) as Promise<Pushed[]>;
}

const submissionEvents = (pushed: Pushed[]) =>
	pushed.filter((entry) => String(entry.event ?? '').endsWith('_submitted'));

async function goto(page: Page, path: string) {
	await page.addInitScript(() => window.localStorage.setItem('cookieConsent', 'false'));
	await page.goto(path);
	await page.waitForLoadState('networkidle');
}

async function fillRsvp(page: Page, guests = '3') {
	await page.locator('#rsvp-name').fill('Ada Lovelace');
	await page.locator('#rsvp-email').fill('ada@example.com');
	await page.locator('#rsvp-guests').fill(guests);
}

const rsvpSubmit = (page: Page) => page.getByRole('button', { name: 'Submit RSVP' });

test.describe('form submission analytics', () => {
	test('a successful RSVP announces rsvp_submitted with the exhibition and guest count', async ({
		page
	}) => {
		await interceptForms(page);
		await goto(page, '/rsvp/euphorbia');
		await fillRsvp(page, '3');

		await rsvpSubmit(page).click();
		await expect(page.getByText('Thank you for your RSVP!')).toBeVisible();

		await expect.poll(async () => submissionEvents(await dataLayer(page)).length).toBe(1);
		const [pushed] = submissionEvents(await dataLayer(page));

		// The literal GTM trigger name. `event` is the reserved dataLayer key, and
		// the RSVP form's own field is also called `event` — if that ever gets
		// copied across verbatim this reads as the exhibition title instead.
		expect(pushed.event).toBe('rsvp_submitted');
		expect(pushed.form_type).toBe('rsvp');
		expect(pushed.exhibition_uid).toBe('euphorbia');
		// A number, not "3" — so GA4 can sum expected heads rather than group them.
		expect(pushed.guests).toBe(3);
	});

	// The regression this whole file exists for. A click trigger cannot tell these
	// two tests apart; it fires in both.
	test('a failed RSVP announces nothing', async ({ page }) => {
		await interceptForms(page, [500]);
		await goto(page, '/rsvp/euphorbia');
		await fillRsvp(page);

		await rsvpSubmit(page).click();
		await expect(page.getByRole('alert')).toBeVisible();

		// Give a stray push the same wall-clock chance the success path got.
		await page.waitForTimeout(1000);
		expect(submissionEvents(await dataLayer(page))).toHaveLength(0);
	});

	test('the announcement carries no personally identifiable information', async ({ page }) => {
		await interceptForms(page);
		await goto(page, '/rsvp/euphorbia');
		await fillRsvp(page);

		await rsvpSubmit(page).click();
		await expect.poll(async () => submissionEvents(await dataLayer(page)).length).toBe(1);

		const [pushed] = submissionEvents(await dataLayer(page));
		expect(Object.keys(pushed)).not.toContain('name');
		expect(Object.keys(pushed)).not.toContain('email');
		// Belt and braces: the values, not just the keys — a rename would slip past
		// a key-only assertion and hand GA4 an email address under another label.
		const values = JSON.stringify(Object.values(pushed));
		expect(values).not.toContain('Ada Lovelace');
		expect(values).not.toContain('ada@example.com');
	});

	test('a successful newsletter signup announces newsletter_submitted', async ({ page }) => {
		await interceptForms(page);
		await goto(page, '/');

		await page.locator('footer').scrollIntoViewIfNeeded();
		await page.locator('footer').getByText('Subscribe to our newsletter').click();
		await expect(page.locator('#newsletter-email')).toBeVisible();

		await page.locator('#newsletter-email').fill('subscriber@example.com');
		await page
			.locator('button')
			.filter({ hasText: 'Subscribe' })
			.filter({ hasNotText: /newsletter/i })
			.click();
		await expect(page.getByText('Thank you for joining')).toBeVisible();

		await expect.poll(async () => submissionEvents(await dataLayer(page)).length).toBe(1);
		const [pushed] = submissionEvents(await dataLayer(page));
		expect(pushed.event).toBe('newsletter_submitted');
		expect(pushed.form_type).toBe('newsletter');
		expect(JSON.stringify(Object.values(pushed))).not.toContain('subscriber@example.com');
	});
});
