<script lang="ts">
	import PostForm from '$lib/components/PostForm.svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';

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
	<div class="flex items-center gap-4 mb-6 sm:mb-8">
		<a
			href="/posts"
			class="inline-flex items-center justify-center p-2 text-[#9ca3af] hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
			aria-label="Back to posts"
		>
			<ArrowLeft class="h-5 w-5" />
		</a>
		<h1 class="text-2xl sm:text-3xl font-bold text-white">Create New Post</h1>
	</div>
	<div class="bg-[#141414] border border-[#333333] rounded-lg px-4 py-6 sm:px-6 sm:py-8">
		<PostForm onSave={handleSave} />
	</div>
</div>
