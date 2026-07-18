<script lang="ts">
	import dayjs from 'dayjs';
	import { Edit, Plus, Trash2 } from 'lucide-svelte';

	let { data } = $props();
	let posts = $state(data.posts || []);
	let searchQuery = $state('');

	let filteredPosts = $derived(
		posts.filter((post: any) => 
			post.title.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	async function deletePost(id: string) {
		if (confirm('Are you sure you want to delete this post?')) {
			const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
			if (res.ok) {
				posts = posts.filter((p: any) => p.id !== id);
			} else {
				alert('Failed to delete post');
			}
		}
	}
</script>

<div class="p-8 max-w-6xl mx-auto space-y-6">
	<div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
		<h1 class="text-3xl font-bold text-white">Posts</h1>
		<div class="flex items-center gap-4 w-full sm:w-auto">
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Search posts..." 
				class="flex-1 sm:w-64 px-4 py-2 bg-[#1f1f1f] border border-[#333333] rounded-md text-white placeholder-[#9ca3af] focus:outline-none focus:border-[#3b82f6]"
			/>
			<a href="/admin/posts/create" class="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] shrink-0">
				<Plus class="w-4 h-4" /> New Post
			</a>
		</div>
	</div>

	<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg overflow-hidden">
		<table class="w-full text-left text-sm text-[#d1d5db]">
			<thead class="bg-[#141414] text-xs uppercase border-b border-[#333333]">
				<tr>
					<th class="px-6 py-4 w-20">Image</th>
					<th class="px-6 py-4">Title</th>
					<th class="px-6 py-4">Status</th>
					<th class="px-6 py-4">Date</th>
					<th class="px-6 py-4 text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredPosts as post}
					<tr class="border-b border-[#333333] hover:bg-[#2a2a2a]">
						<td class="px-6 py-4">
							{#if post.mainImageUrl}
								<img src={post.mainImageUrl} alt={post.title} class="w-12 h-12 rounded object-cover border border-[#333333]" />
							{:else}
								<div class="w-12 h-12 rounded bg-[#141414] border border-[#333333] flex items-center justify-center text-[#9ca3af] text-xs">No img</div>
							{/if}
						</td>
						<td class="px-6 py-4 font-medium text-white">{post.title}</td>
						<td class="px-6 py-4">
							<span class="px-2.5 py-1 rounded-full text-xs font-medium {post.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}">
								{post.status || 'Published'}
							</span>
						</td>
						<td class="px-6 py-4">{dayjs(post.created || post._createdAt || new Date()).format('MMM D, YYYY')}</td>
						<td class="px-6 py-4 text-right">
							<a href="/admin/posts/{post.id || post.slug?.current}" class="inline-block p-2 text-[#9ca3af] hover:text-white rounded hover:bg-[#333333] mr-2">
								<Edit class="w-4 h-4" />
							</a>
							<button onclick={() => deletePost(post.id || post.slug?.current)} class="inline-block p-2 text-red-400 hover:text-red-300 rounded hover:bg-[#333333]">
								<Trash2 class="w-4 h-4" />
							</button>
						</td>
					</tr>
				{/each}
				{#if filteredPosts.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-[#9ca3af]">
							{#if searchQuery}No posts found matching "{searchQuery}"{:else}No posts found.{/if}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
