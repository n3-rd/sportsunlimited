<script lang="ts">
	import { FileText, Image as ImageIcon, Settings, Tags } from 'lucide-svelte';
	import dayjs from 'dayjs';

	let { data } = $props();
	
	const recentPosts = data.recentPosts || [];
	const totalPosts = data.totalPosts || 0;
</script>

<div class="p-8 max-w-6xl mx-auto space-y-8">
	<div>
		<h1 class="text-3xl font-bold text-white">Dashboard</h1>
		<p class="text-[#9ca3af] mt-1">Overview of your CMS content</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg p-6 flex items-center justify-between">
			<div>
				<p class="text-[#9ca3af] text-sm font-medium uppercase tracking-wider mb-1">Total Posts</p>
				<p class="text-3xl font-bold text-white">{totalPosts}</p>
			</div>
			<div class="w-12 h-12 rounded-full bg-[#3b82f6]/20 flex items-center justify-center text-[#3b82f6]">
				<FileText class="w-6 h-6" />
			</div>
		</div>

		<a href="/admin/ads" class="bg-[#1f1f1f] border border-[#333333] rounded-lg p-6 flex items-center justify-between hover:bg-[#2a2a2a] transition-colors group">
			<div>
				<p class="text-[#9ca3af] text-sm font-medium uppercase tracking-wider mb-1">Ads Active</p>
				<p class="text-3xl font-bold text-white">5</p>
			</div>
			<div class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
				<ImageIcon class="w-6 h-6" />
			</div>
		</a>

		<a href="/admin/settings" class="bg-[#1f1f1f] border border-[#333333] rounded-lg p-6 flex items-center justify-between hover:bg-[#2a2a2a] transition-colors group">
			<div>
				<p class="text-[#9ca3af] text-sm font-medium uppercase tracking-wider mb-1">System</p>
				<p class="text-xl font-bold text-white mt-1">Configured</p>
			</div>
			<div class="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
				<Settings class="w-6 h-6" />
			</div>
		</a>

		<a href="/admin/tags" class="bg-[#1f1f1f] border border-[#333333] rounded-lg p-6 flex items-center justify-between hover:bg-[#2a2a2a] transition-colors group">
			<div>
				<p class="text-[#9ca3af] text-sm font-medium uppercase tracking-wider mb-1">Tags</p>
				<p class="text-xl font-bold text-white mt-1">Categories</p>
			</div>
			<div class="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
				<Tags class="w-6 h-6" />
			</div>
		</a>
	</div>

	<!-- Recent Posts -->
	<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg overflow-hidden">
		<div class="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
			<h2 class="text-lg font-semibold text-white">Recent Posts</h2>
			<a href="/admin/posts" class="text-sm text-[#3b82f6] hover:text-[#2563eb]">View All &rarr;</a>
		</div>
		<table class="w-full text-left text-sm text-[#d1d5db]">
			<tbody>
				{#each recentPosts as post}
					<tr class="border-b border-[#333333] hover:bg-[#2a2a2a]">
						<td class="px-6 py-4 w-16">
							{#if post.mainImageUrl}
								<img src={post.mainImageUrl} alt={post.title} class="w-10 h-10 rounded object-cover border border-[#333333]" />
							{:else}
								<div class="w-10 h-10 rounded bg-[#141414] border border-[#333333] flex items-center justify-center text-[#9ca3af] text-xs">No img</div>
							{/if}
						</td>
						<td class="px-6 py-4 font-medium text-white">
							<a href="/admin/posts/{post.id || post.slug?.current}" class="hover:underline">{post.title}</a>
						</td>
						<td class="px-6 py-4">
							<span class="px-2.5 py-1 rounded-full text-[10px] font-medium {post.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}">
								{post.status || 'Published'}
							</span>
						</td>
						<td class="px-6 py-4 text-right text-[#9ca3af]">{dayjs(post.created || post._createdAt || new Date()).format('MMM D, YYYY')}</td>
					</tr>
				{/each}
				{#if recentPosts.length === 0}
					<tr>
						<td colspan="4" class="px-6 py-8 text-center text-[#9ca3af]">No posts found.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
