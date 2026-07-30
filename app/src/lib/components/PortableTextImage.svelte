<script lang="ts">
	let { portableText = {} } = $props();
	const value = portableText.value || {};
	const src = value.url || value.asset?.url || '';
	const alt = value.alt || '';
</script>

{#if src}
	<figure class="my-8 flex flex-col items-center">
		<img {src} {alt} class="max-w-full h-auto rounded-lg shadow-md" loading="lazy" />
		{#if alt}
			<figcaption class="mt-2 text-sm text-gray-500 text-center">{alt}</figcaption>
		{/if}
	</figure>
{/if}
