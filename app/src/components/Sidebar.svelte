<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { Clock } from 'svelte-radix';
	import Button from '$lib/components/ui/button/button.svelte';
	import NPFLTable from './NPFLTable.svelte';
	import NPFLFixtures from './NPFLFixtures.svelte';
	import BannerAd from './BannerAd.svelte';
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
		<section class="trending-posts rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
			<div class="mb-4 border-b border-zinc-100 pb-2">
				<h3 class="text-base font-black tracking-tight text-zinc-950">
					Trending Now
				</h3>
			</div>
			<div class="flex flex-col gap-3.5">
				{#each trendingPosts as post, index}
					<a href={`/post/${post.slug.current}`} class="trending-post-item group block">
						<div class="flex gap-3 items-start">
							<div
								class="trending-number flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100 font-mono text-[11px] font-bold text-zinc-700 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300"
							>
								{index + 1}
							</div>
							<div class="min-w-0 flex-1">
								<h4
									class="mb-1 line-clamp-2 text-xs font-bold text-zinc-900 leading-snug transition-colors duration-300 group-hover:text-rose-600"
								>
									{post.title}
								</h4>
								<div class="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
									<Clock size="11" />
									<span>{dayjs(post._createdAt).fromNow()}</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- Strategic Banner Ad placement -->
		<section class="ad-section flex justify-center">
			<BannerAd variant="sidebar" />
		</section>
	{/if}

	<!-- NPFL Top 5 Table -->
	{#if npflTable && npflTable.length > 0}
		<section class="npfl-table-section rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
			<div class="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2">
				<h3 class="text-base font-black tracking-tight text-zinc-950">NPFL Top 5</h3>
				<a
					href="/npfl/standings"
					class="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-rose-600 flex items-center gap-1"
				>
					Full Table ↗
				</a>
			</div>
			<NPFLTable table={npflTable} limit={5} compact={true} />
		</section>
	{/if}

	<!-- NPFL Upcoming Fixtures -->
	{#if npflFixtures && npflFixtures.length > 0}
		<section class="npfl-fixtures-section rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
			<div class="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2">
				<h3 class="text-base font-black tracking-tight text-zinc-950">Upcoming Fixtures</h3>
				<a
					href="/npfl/fixtures"
					class="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-rose-600 flex items-center gap-1"
				>
					All Fixtures ↗
				</a>
			</div>
			<NPFLFixtures fixtures={npflFixtures} limit={3} compact={true} />
		</section>
	{/if}

	<!-- Popular Tags Section -->
	{#if popularTags.length > 0}
		<section class="popular-tags rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
			<div class="mb-3 border-b border-zinc-100 pb-2">
				<h3 class="text-base font-black tracking-tight text-zinc-950">
					Popular Categories
				</h3>
			</div>
			<div class="flex flex-wrap gap-1.5">
				{#each popularTags as tag}
					<a href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} class="tag-link">
						<span class="inline-flex items-center px-3 py-1 rounded-full bg-zinc-50 hover:bg-zinc-950 border border-zinc-200 hover:border-zinc-950 text-zinc-700 hover:text-white font-mono text-[11px] uppercase tracking-wider transition-all duration-300 shadow-sm active:scale-95">
							{tag}
						</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Strategic Banner Ad placement 2 -->
	<section class="ad-section flex justify-center">
		<BannerAd variant="sidebar" isAlternative={true} />
	</section>

	<!-- Ad/Book Section -->
	<section class="ad-section rounded-2xl overflow-hidden border border-zinc-200/80 bg-white p-2 shadow-sm">
		<img
			src="/book.jpg"
			alt="Eyes on the Nigerian League book"
			class="w-full rounded-xl object-cover"
		/>
	</section>

	<!-- Featured Ad Section -->
	<section
		class="featured-ad-section overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm"
	>
		<div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-3.5 py-2">
			<span class="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Featured Partner</span>
		</div>
		<a href="/ads/ad-1" class="group relative block overflow-hidden">
			<img
				src="/sidebar/ad1.png"
				alt="Congratulations to the NNL"
				class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
			<div
				class="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-3 transition-opacity duration-300 group-hover:opacity-90"
			>
				<div class="text-white">
					<p class="font-mono text-[9px] font-bold uppercase tracking-widest opacity-90">PROMOTION</p>
				</div>
			</div>
		</a>
	</section>

	<section
		class="featured-ad-section overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm"
	>
		<div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-3.5 py-2">
			<span class="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Featured Partner</span>
		</div>
		<a href="/ads/ad-2" class="group relative block overflow-hidden">
			<img
				src="/sidebar/ad2.png"
				alt="Prostar Sports Wears"
				class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
			<div
				class="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-3 transition-opacity duration-300 group-hover:opacity-90"
			>
				<div class="text-white">
					<p class="font-mono text-[9px] font-bold uppercase tracking-widest opacity-90">PROMOTION</p>
				</div>
			</div>
		</a>
	</section>

	<!-- Ad Rates Rate Card -->
	<section
		class="ad-rates-section overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-sm"
	>
		<a href="/advertising" class="block group">
			<img
				src="/sidebar/adrates.png"
				alt="Sports Unlimited Online Rate Card - Advertising rates in NGN and USD"
				class="w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
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
