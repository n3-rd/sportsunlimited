<script lang="ts">
	import { goto } from '$app/navigation';
	import PostForm from '$lib/components/admin/PostForm.svelte';

	let { data } = $props();

	async function handleSave(formData: FormData) {
		const res = await fetch(`/api/admin/posts/${data.post.id}`, {
			method: 'PUT',
			body: formData
		});
		if (res.ok) {
			goto('/admin/posts');
		} else {
			throw new Error('Failed to update post');
		}
	}
</script>

<div class="p-8 max-w-4xl mx-auto space-y-6">
	<h1 class="text-3xl font-bold text-white mb-8">Edit Post</h1>
	<PostForm post={data.post} onSave={handleSave} />
</div>
