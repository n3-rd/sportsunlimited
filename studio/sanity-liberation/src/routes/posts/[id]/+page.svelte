<script lang="ts">
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import PostForm from '$lib/components/PostForm.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let post = $state(null);
	let loading = $state(true);
    let error = $state(null);

	onMount(async () => {
		try {
			post = await pb.collection('posts').getOne($page.params.id);
		} catch (e) {
            console.error(e);
            error = 'Post not found';
        } finally {
			loading = false;
		}
	});

	async function handleSave(formData: FormData) {
		await pb.collection('posts').update($page.params.id, formData);
		goto('/posts');
	}
</script>

<div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        {#if loading}
            <p>Loading...</p>
        {:else if error}
            <p class="text-red-600">{error}</p>
        {:else}
            <PostForm {post} onSave={handleSave} />
        {/if}
    </div>
</div>
