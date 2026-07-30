<script lang="ts">
	let { portableText = {} } = $props();
	const value = portableText.value || {};
	const src = value.url || '';
</script>

{#if src}
	<figure class="my-8 flex flex-col items-center">
		<!-- svelte-ignore a11y_media_has_caption -->
		<video {src} controls class="max-w-full h-auto rounded-lg shadow-md" preload="metadata"></video>
	</figure>
{/if}
