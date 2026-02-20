<script lang="ts">
	/** @type {{ value?: { href?: string; url?: string }; }} */
	let { portableText = {}, children } = $props();
	const href = portableText.value?.href || portableText.value?.url || '';
</script>

{#if typeof href === 'string' && href && href !== '#'}
	<a
		{href}
		target="_blank"
		rel="noopener noreferrer"
		class="text-red-600 hover:text-red-700 underline underline-offset-2 font-medium normal-case"
	>
		{@render children()}
	</a>
{:else}
	{@render children()}
{/if}
