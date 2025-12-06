<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { Plus, Search, Edit, Trash2 } from 'lucide-svelte';

	let posts: any[] = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');

	async function fetchPosts() {
		try {
			// Fetch posts sorted by created date descending
			const records = await pb.collection('posts').getList(1, 50, {
				sort: '-created',
			});
			posts = records.items;
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			loading = false;
		}
	}

	async function deletePost(id: string) {
		if (!confirm('Are you sure you want to delete this post?')) return;
		try {
			await pb.collection('posts').delete(id);
			await fetchPosts();
		} catch (error) {
			console.error('Error deleting post:', error);
			alert('Failed to delete post');
		}
	}

	onMount(() => {
		fetchPosts();
	});

    let filteredPosts = $derived(
        posts.filter(post => 
            post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.slug?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Posts</h1>
		<a
			href="/posts/create"
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			<Plus class="mr-2 h-4 w-4" />
			New Post
		</a>
	</div>

	<!-- Search -->
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class="h-5 w-5 text-gray-400" />
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			placeholder="Search posts..."
		/>
	</div>

	<!-- Table -->
	<div class="bg-white shadow overflow-hidden sm:rounded-md">
		{#if loading}
			<div class="p-4 text-center text-gray-500">Loading...</div>
		{:else if filteredPosts.length === 0}
			<div class="p-4 text-center text-gray-500">No posts found</div>
		{:else}
			<ul class="divide-y divide-gray-200">
				{#each filteredPosts as post (post.id)}
					<li>
						<div class="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
							<div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm font-medium text-blue-600 truncate">{post.title}</p>
                                    <div class="ml-2 flex-shrink-0 flex">
                                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {post.status || 'Published'}
                                        </p>
                                    </div>
                                </div>
								<div class="mt-2 flex">
									<div class="flex items-center text-sm text-gray-500">
										<p class="truncate">{post.excerpt || 'No excerpt'}</p>
									</div>
								</div>
                                <div class="mt-2 flex items-center text-xs text-gray-400">
                                    <span>{new Date(post.created).toLocaleDateString()}</span>
                                    <span class="mx-1">•</span>
                                    <span>{post.slug}</span>
                                </div>
							</div>
							<div class="ml-5 flex-shrink-0 flex space-x-2">
								<a
									href="/posts/{post.id}"
									class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Edit"
								>
									<Edit class="h-5 w-5" />
								</a>
								<button
									onclick={() => deletePost(post.id)}
									class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete"
								>
									<Trash2 class="h-5 w-5" />
								</button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
