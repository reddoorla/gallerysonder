export interface FormSubmissionResult {
	success: boolean;
	status: number;
}

export async function submitNetlifyForm(
	formElement: HTMLFormElement
): Promise<FormSubmissionResult> {
	const formData = new FormData(formElement);

	try {
		// Netlify Forms intercepts a urlencoded POST (carrying `form-name`) to the
		// site root and returns its success page. POSTing to a real static page like
		// `/forms` always 200s even when Netlify never processed the submission, so
		// the old `status === 200` check could never report a failure. `response.ok`
		// against `/` is meaningful: an unrecognized form-name comes back as a 404.
		const response = await fetch('/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams(formData as unknown as Record<string, string>).toString()
		});

		return {
			success: response.ok,
			status: response.status
		};
	} catch {
		// Network error / offline — surface as a failure instead of a thrown promise
		// so callers' error fallbacks ("there was an error, email us") actually fire.
		return {
			success: false,
			status: 0
		};
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
