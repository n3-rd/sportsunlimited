<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import PostForm from '$lib/components/PostForm.svelte';
	import { goto } from '$app/navigation';

	async function handleSave(formData: FormData) {
		const record = await pb.collection('posts').create(formData);
		goto('/posts');
	}
</script>

<div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <PostForm onSave={handleSave} />
    </div>
</div>
