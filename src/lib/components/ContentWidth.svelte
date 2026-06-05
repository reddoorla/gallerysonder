<script lang="ts">
	let { class: className = 'flex flex-col items-center justify-center my-16 relative', children } =
		$props();
</script>

<div class="max-w-[1220px] xxl:max-w-[1640px] xl:mx-auto mx-[4%] {className}">
	{@render children?.()}
</div>
