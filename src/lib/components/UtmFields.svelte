<script lang="ts">
	import { getAppState } from '$lib/contexts/appState.svelte';

	// The landing page's UTM parameters, captured once by the root layout, as the
	// hidden inputs submitForm folds into the ingest `utm` column.
	const appState = getAppState();
</script>

<input type="hidden" name="utm_source" value={appState.utmParams.source} />
<input type="hidden" name="utm_medium" value={appState.utmParams.medium} />
<input type="hidden" name="utm_campaign" value={appState.utmParams.campaign} />
<input type="hidden" name="utm_term" value={appState.utmParams.term} />
<input type="hidden" name="utm_content" value={appState.utmParams.content} />
