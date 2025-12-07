<script lang="ts">
	import PostCard from "./PostCard.svelte";

	interface Props {
		category: string;
		posts: any[];
	}

	let { category, posts }: Props = $props();
</script>

{#if posts && posts.length > 0}
	<section class="category-section mb-12">
		<div class="section-header mb-6">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-2">{category}</h2>
					<p class="text-gray-600 text-lg">Latest {category.toLowerCase()} news and updates</p>
				</div>
				<a href={`/tags/${category}`} class="text-red-600 hover:text-red-700 font-bold text-sm uppercase tracking-wide">
					View All →
				</a>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each posts as post}
				<PostCard post={post} size="small" />
			{/each}
		</div>
	</section>
{/if}

<style>
	.section-header {
		border-bottom: 3px solid #ef4444;
		padding-bottom: 1rem;
	}
</style>



