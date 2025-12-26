<script lang="ts">
	import { page } from '$app/stores';
	import PostForm from '$lib/components/PostForm.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Loader2, AlertCircle } from 'lucide-svelte';

	let post = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const response = await fetch(`/api/posts/${$page.params.id}`);
			if (!response.ok) {
				throw new Error('Post not found');
			}
			post = await response.json();
		} catch (e: any) {
			console.error(e);
			error = e.message || 'Post not found';
		} finally {
			loading = false;
		}
	});

	async function handleSave(formData: FormData) {
		try {
			const response = await fetch(`/api/posts/${$page.params.id}`, {
				method: 'PUT',
				body: formData
			});
			
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to update post');
			}
			
			goto('/posts');
		} catch (error: any) {
			console.error('Error saving post:', error);
			alert(error.message || 'Failed to save post');
			throw error;
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<h1 class="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Edit Post</h1>
	<div class="bg-[#141414] border border-[#333333] rounded-lg px-4 py-6 sm:px-6 sm:py-8">
		{#if loading}
			<div class="flex flex-col items-center justify-center py-12">
				<Loader2 class="h-8 w-8 text-[#3b82f6] animate-spin mb-4" />
				<p class="text-[#9ca3af]">Loading post...</p>
			</div>
		{:else if error}
			<div class="flex flex-col items-center justify-center py-12">
				<AlertCircle class="h-12 w-12 text-[#ef4444] mb-4" />
				<p class="text-lg font-semibold text-white mb-2">Error</p>
				<p class="text-[#9ca3af]">{error}</p>
			</div>
		{:else}
			<PostForm {post} onSave={handleSave} />
		{/if}
	</div>
</div>
