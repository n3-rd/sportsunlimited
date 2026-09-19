<script lang="ts">
	import PostCard from "./PostCard.svelte";

	interface Props {
		category: string;
		posts: any[];
	}

	let { category, posts }: Props = $props();
</script>

{#if posts && posts.length > 0}
	<section class="category-section mb-14">
		<div class="section-header mb-8 pb-3 border-b border-zinc-200/80 flex items-end justify-between gap-4">
			<h2 class="text-2xl md:text-3xl font-black tracking-tight text-zinc-950">{category}</h2>
			<a href={`/tags/${category.toLowerCase().replace(/\s+/g, '-')}`} class="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 hover:text-rose-600 transition-colors">
				<span class="hidden sm:inline">View Category</span>
				<span class="sm:hidden">All</span>
				<span class="w-7 h-7 rounded-full bg-zinc-100 group-hover:bg-rose-100 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-zinc-700 group-hover:text-rose-600">
					↗
				</span>
			</a>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each posts as post}
				<PostCard post={post} size="medium" />
			{/each}
		</div>
	</section>
{/if}













