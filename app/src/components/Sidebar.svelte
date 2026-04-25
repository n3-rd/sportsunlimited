<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from 'svelte-radix';
	import Button from '$lib/components/ui/button/button.svelte';
	import NPFLTable from './NPFLTable.svelte';
	import NPFLFixtures from './NPFLFixtures.svelte';
	dayjs.extend(relativeTime);

	interface Props {
		trendingPosts?: any[];
		tags?: string[];
		npflTable?: any[];
		npflFixtures?: any[];
	}

	let {
		trendingPosts = [],
		tags: popularTags = [],
		npflTable = [],
		npflFixtures = []
	}: Props = $props();
</script>

<div class="sticky top-24 flex h-full w-full flex-col gap-6">
	<!-- Trending Posts Section -->
	{#if trendingPosts && trendingPosts.length > 0}
		<section class="trending-posts rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
				Trending Now
			</h3>
			<div class="flex flex-col gap-4">
				{#each trendingPosts as post, index}
					<a href={`/post/${post.slug.current}`} class="trending-post-item group">
						<div class="flex gap-3">
							<div
								class="trending-number flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white"
							>
								{index + 1}
							</div>
							<div class="min-w-0 flex-1">
								<h4
									class="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-red-600"
								>
									{post.title}
								</h4>
								<div class="flex items-center gap-2 text-xs text-gray-500">
									<Clock size="14" />
									<span>{dayjs(post._createdAt).fromNow()}</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- NPFL Top 5 Table -->
	{#if npflTable && npflTable.length > 0}
		<section class="npfl-table-section rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
				<h3 class="text-xl font-bold text-gray-900">NPFL Top 5</h3>
				<a
					href="/npfl/standings"
					class="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
				>
					View All →
				</a>
			</div>
			<NPFLTable table={npflTable} limit={5} compact={true} />
		</section>
	{/if}

	<!-- NPFL Upcoming Fixtures -->
	{#if npflFixtures && npflFixtures.length > 0}
		<section class="npfl-fixtures-section rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
				<h3 class="text-xl font-bold text-gray-900">Upcoming Fixtures</h3>
				<a
					href="/npfl/fixtures"
					class="text-xs font-medium text-red-600 transition-colors hover:text-red-700"
				>
					View All →
				</a>
			</div>
			<NPFLFixtures fixtures={npflFixtures} limit={3} compact={true} />
		</section>
	{/if}

	<!-- Popular Tags Section -->
	{#if popularTags.length > 0}
		<section class="popular-tags rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h3 class="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-900">
				Popular Categories
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each popularTags as tag}
					<a href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} class="tag-link">
						<Button variant="outline" size="sm" class="text-xs">
							{tag}
						</Button>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Ad/Book Section -->
	<section class="ad-section">
		<img
			src="/book.jpg"
			alt="Eyes on the Nigerian League book"
			class="w-full rounded-lg shadow-sm"
		/>
	</section>

	<!-- Featured Ad Section -->
	<section
		class="featured-ad-section overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
	>
		<div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3">
			<span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Featured</span>
			<span class="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
		</div>
		<a href="/ads/ad-1" class="group relative block overflow-hidden">
			<img
				src="/sidebar/ad1.png"
				alt="Congratulations to the NNL"
				class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>
			<div
				class="absolute inset-0 flex items-end bg-gradient-to-t from-black/30 to-transparent p-4 transition-opacity duration-300 group-hover:opacity-90"
			>
				<div class="text-white">
					<p class="mb-0.5 text-xs font-bold opacity-80">PROMOTION</p>
				</div>
			</div>
		</a>
	</section>

	<section
		class="featured-ad-section overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
	>
		<div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-3">
			<span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Featured</span>
			<span class="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
		</div>
		<a href="/ads/ad-2" class="group relative block overflow-hidden">
			<img
				src="/sidebar/ad2.png"
				alt="Prostar Sports Wears"
				class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>
			<div
				class="absolute inset-0 flex items-end bg-gradient-to-t from-black/30 to-transparent p-4 transition-opacity duration-300 group-hover:opacity-90"
			>
				<div class="text-white">
					<p class="mb-0.5 text-xs font-bold opacity-80">PROMOTION</p>
				</div>
			</div>
		</a>
	</section>

	<!-- Ad Rates Rate Card -->
	<section
		class="ad-rates-section overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
	>
		<a href="/advertising" class="block">
			<img
				src="/sidebar/adrates.png"
				alt="Sports Unlimited Online Rate Card - Advertising rates in NGN and USD"
				class="w-full rounded-lg shadow-sm transition-opacity hover:opacity-95"
			/>
		</a>
	</section>
</div>

<style>
	.trending-post-item {
		transition: transform 0.2s;
	}
	.trending-post-item:hover {
		transform: translateX(4px);
	}
	.tag-link {
		text-decoration: none;
	}
</style>
