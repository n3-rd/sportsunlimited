<script lang="ts">
	import PostForm from '$lib/components/PostForm.svelte';
	import { goto } from '$app/navigation';

	async function handleSave(formData: FormData) {
		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				body: formData
			});
			
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to create post');
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
	<h1 class="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Create New Post</h1>
	<div class="bg-[#141414] border border-[#333333] rounded-lg px-4 py-6 sm:px-6 sm:py-8">
		<PostForm onSave={handleSave} />
	</div>
</div>
