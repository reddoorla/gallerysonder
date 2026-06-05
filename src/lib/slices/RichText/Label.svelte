<script>
	let { node, children } = $props();
</script>

{#if node.data.label === 'codespan'}
	<code>{@render children?.()}</code>
{:else}
	<span class={node.data.label}>{@render children?.()}</span>
{/if}
