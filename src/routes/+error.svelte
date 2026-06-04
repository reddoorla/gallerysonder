<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<section
	class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-32 text-center text-white"
>
	<h2>Error {$page.status}</h2>
	<h1>{$page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
	<p class="max-w-150">
		{$page.status === 404
			? "The page you're looking for doesn't exist or has moved."
			: ($page.error?.message ?? 'An unexpected error occurred. Please try again.')}
	</p>
	<a href="/" class="underline">Back to home</a>
</section>
