<script>
	/** @type {import("@prismicio/client").RTLabelNode} */
	let { node } = $props();
</script>

{#if node.data.label === 'codespan'}
	<code><slot /></code>
{:else}
	<span class={node.data.label}><slot /></span>
{/if}
