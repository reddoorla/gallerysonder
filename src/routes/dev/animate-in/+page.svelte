<script lang="ts">
	import AnimateIn from '$lib/components/Animation/AnimateIn.svelte';
</script>

<svelte:head>
	<title>animate-in demo — Reddoor</title>
	<meta
		name="description"
		content="Reddoor accessibility fixture for the AnimateIn scroll component — a stable target for @lhci/cli and Playwright + axe-core. Not linked from the public site."
	/>
</svelte:head>

<!--
	Fixture route consumed by @reddoorla/maintenance's a11y + lighthouse audits
	(it scans /dev/a11y-fixtures and /dev/animate-in). Self-contained bg-black +
	text-white so color-contrast is deterministic regardless of the body theme.
	Wraps content in <AnimateIn> so the audit exercises the real animation path.
-->
<main class="min-h-screen bg-black p-8 text-white">
	<header>
		<h1>AnimateIn demo</h1>
		<p>
			This page exists so <code>@lhci/cli</code> and Playwright + axe-core have a stable target that
			exercises the <code>AnimateIn</code> scroll-reveal component. It is not linked from the public site.
		</p>
	</header>

	<section aria-labelledby="reveal-heading">
		<h2 id="reveal-heading">Scroll reveal</h2>
		<AnimateIn>
			<p>
				Each block fades and slides in as it enters the viewport. Accessibility is independent of
				the transform — semantic structure and contrast hold whether or not the element has animated
				in.
			</p>
		</AnimateIn>
	</section>

	<section aria-labelledby="staggered-heading">
		<h2 id="staggered-heading">Staggered content</h2>
		<AnimateIn transitionDelayMax={200} transitionDuration={1200}>
			<p>
				<a href="/">Back to home</a> — descriptive visible link text, so no
				<code>aria-label</code> override is required.
			</p>
		</AnimateIn>
	</section>
</main>
