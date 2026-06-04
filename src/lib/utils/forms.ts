export interface FormSubmissionResult {
	success: boolean;
	status: number;
}

export async function submitNetlifyForm(formElement: HTMLFormElement): Promise<FormSubmissionResult> {
	const formData = new FormData(formElement);

	const response = await fetch("/forms", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(formData as unknown as Record<string, string>).toString()
	});

	return {
		success: response.status === 200,
		status: response.status
	};
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
