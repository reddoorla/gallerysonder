export interface FormSubmissionResult {
	success: boolean;
	status: number;
}

// Legacy `form-name` marker → ingest formType. Only `news` differs.
const FORM_TYPE_BY_NAME: Record<string, string> = {
	contact: 'contact',
	inquiry: 'inquiry',
	news: 'newsletter',
	rsvp: 'rsvp'
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

/**
 * Forward a hidden form's data to the central dashboard ingest endpoint
 * (`/api/forms`). Derives the ingest formType from the legacy `form-name`
 * marker, folds the UTM hidden inputs (captured at landing) into a single `utm`
 * query string, and attaches the current page URL as `sourceUrl`. Site-specific
 * fields (piece, artist, role, event, guests, company, appointment_*) ride along
 * as top-level keys; the ingest endpoint bundles them into `extra`. Never throws
 * — a network error is surfaced as `{ success: false }` so callers' email
 * fallbacks fire.
 */
export async function submitForm(
	formElement: HTMLFormElement,
	turnstileToken?: string
): Promise<FormSubmissionResult> {
	const formData = new FormData(formElement);
	const entries: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		if (typeof value === 'string') entries[key] = value;
	}

	const formName = entries['form-name'] ?? '';
	const formType = FORM_TYPE_BY_NAME[formName] ?? formName;

	// Fold UTM hidden inputs (defaulted to 'none' at mount) into one query string,
	// dropping empties/'none'; lands in the ingest `utm` column.
	const utmParams = new URLSearchParams();
	for (const key of UTM_KEYS) {
		const value = entries[key];
		if (value && value !== 'none') utmParams.set(key, value);
		delete entries[key];
	}
	delete entries['form-name'];

	const payload: Record<string, string> = {
		...entries,
		formType,
		sourceUrl: window.location.href
	};
	const utm = utmParams.toString();
	if (utm) payload.utm = utm;
	// Cloudflare Turnstile token (from the visible widget). The ingest endpoint
	// reads `cf-turnstile-response` into its transient `_meta` for central verify;
	// it's excluded from persisted `extra` server-side. Absent token = fail-open.
	if (turnstileToken) payload['cf-turnstile-response'] = turnstileToken;

	try {
		const response = await fetch('/api/forms', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		return { success: response.ok, status: response.status };
	} catch {
		// Network error / offline — surface as a failure so the email fallback fires.
		return { success: false, status: 0 };
	}
}

export function populateHiddenForm(formId: string, fieldValues: Record<string, string>): boolean {
	const form = document.getElementById(formId) as HTMLFormElement;
	if (!form) return false;

	Object.entries(fieldValues).forEach(([name, value]) => {
		const field = form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement;
		if (field) field.value = value;
	});

	return true;
}
