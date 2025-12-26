<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to posts page
		goto('/posts', { replaceState: true });
	});
</script>
