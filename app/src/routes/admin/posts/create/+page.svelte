<script lang="ts">
	import { goto } from '$app/navigation';
	import PostForm from '$lib/components/admin/PostForm.svelte';

	async function handleSave(formData: FormData) {
		const res = await fetch('/api/admin/posts', {
			method: 'POST',
			body: formData
		});
		if (res.ok) {
			goto('/admin/posts');
		} else {
			throw new Error('Failed to create post');
		}
	}
</script>

<div class="p-8 max-w-4xl mx-auto space-y-6">
	<h1 class="text-3xl font-bold text-white mb-8">Create New Post</h1>
	<PostForm onSave={handleSave} />
</div>
