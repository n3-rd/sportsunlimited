<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Search, Edit, Trash2, Calendar, FileText } from 'lucide-svelte';

	let posts: any[] = $state([]);
	let loading = $state(true);
	let searchQuery = $state('');

	async function fetchPosts() {
		try {
			const response = await fetch('/api/posts?sort=-created');
			if (!response.ok) {
				throw new Error('Failed to fetch posts');
			}
			const data = await response.json();
			posts = data.items || [];
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			loading = false;
		}
	}

	async function deletePost(id: string) {
		if (!confirm('Are you sure you want to delete this post?')) return;
		try {
			const response = await fetch(`/api/posts/${id}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to delete post');
			}
			await fetchPosts();
		} catch (error: any) {
			console.error('Error deleting post:', error);
			alert(error.message || 'Failed to delete post');
		}
	}

	onMount(() => {
		fetchPosts();
	});

	let filteredPosts = $derived(
		posts.filter(
			(post) =>
				post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.slug?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<h1 class="text-2xl sm:text-3xl font-bold text-white">Posts</h1>
		<a
			href="/posts/create"
			class="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 border border-transparent rounded-lg text-sm sm:text-base font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all"
		>
			<Plus class="h-4 w-4 sm:h-5 sm:w-5" />
			<span>New Post</span>
		</a>
	</div>

	<!-- Search -->
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			<Search class="h-5 w-5 text-[#9ca3af]" aria-hidden="true" />
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			class="block w-full pl-10 pr-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
			placeholder="Search posts by title or slug..."
			aria-label="Search posts"
		/>
	</div>

	<!-- Posts List -->
	<div class="bg-[#141414] border border-[#333333] rounded-lg overflow-hidden">
		{#if loading}
			<div class="p-8 sm:p-12 text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#333333] border-t-[#3b82f6]"></div>
				<p class="mt-4 text-[#9ca3af]">Loading posts...</p>
			</div>
		{:else if filteredPosts.length === 0}
			<div class="p-8 sm:p-12 text-center">
				<FileText class="mx-auto h-12 w-12 text-[#9ca3af] mb-4" />
				<p class="text-lg font-medium text-white mb-1">
					{searchQuery ? 'No posts found' : 'No posts yet'}
				</p>
				<p class="text-sm text-[#9ca3af]">
					{searchQuery
						? 'Try adjusting your search query'
						: 'Get started by creating your first post'}
				</p>
			</div>
		{:else}
			<ul class="divide-y divide-[#333333]">
				{#each filteredPosts as post (post.id)}
					<li>
						<div
							class="p-4 sm:p-6 hover:bg-[#1f1f1f] transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
						>
							<div class="flex-1 min-w-0">
								<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
									<h3 class="text-base sm:text-lg font-semibold text-white truncate">
										{post.title || 'Untitled Post'}
									</h3>
									<span
										class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#10b981] text-white flex-shrink-0"
									>
										{post.status || 'Published'}
									</span>
								</div>
								{#if post.excerpt}
									<p class="text-sm text-[#d1d5db] line-clamp-2 mb-3">{post.excerpt}</p>
								{/if}
								<div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#9ca3af]">
									<div class="flex items-center gap-1.5">
										<Calendar class="h-4 w-4" />
										<span>{new Date(post.created).toLocaleDateString()}</span>
									</div>
									<span class="hidden sm:inline">•</span>
									<span class="font-mono truncate max-w-xs">{post.slug}</span>
								</div>
							</div>
							<div class="flex items-center gap-2 sm:ml-4 flex-shrink-0">
								<a
									href="/posts/{post.id}"
									class="p-2.5 sm:p-3 text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
									aria-label="Edit {post.title}"
								>
									<Edit class="h-5 w-5" />
								</a>
								<button
									onclick={() => deletePost(post.id)}
									class="p-2.5 sm:p-3 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#2a2a2a] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
									aria-label="Delete {post.title}"
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
