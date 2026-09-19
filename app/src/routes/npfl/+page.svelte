<script lang="ts">
	import SEO from '../../components/SEO.svelte';
	import NPFLTable from '../../components/NPFLTable.svelte';
	import NPFLFixtures from '../../components/NPFLFixtures.svelte';
	import PostCard from '../../components/PostCard.svelte';
	import { clubToSlug, getClubLogo } from '$lib/npfl';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const npflHubSchema = {
		'@context': 'https://schema.org',
		'@type': 'SportsOrganization',
		name: 'Nigeria Premier Football League',
		alternateName: 'NPFL',
		sport: 'Soccer',
		url: 'https://www.sportsunlimited.ng/npfl',
		description: 'Comprehensive coverage of the Nigeria Premier Football League (NPFL), featuring live standings, upcoming fixtures, matchday results, club profiles, and sports journalism.'
	};
</script>

<SEO
	title="NPFL Hub - Nigeria Premier Football League Scores, Standings & Clubs | Sports Unlimited"
	description="Your complete hub for the Nigeria Premier Football League (NPFL). Follow live standings, upcoming matchday fixtures, club profiles, form guides, and breaking news."
	schemaorg={npflHubSchema}
/>

<main class="npfl-hub-page max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
	<!-- Page Header & Hub Navigation -->
	<div class="mb-8 pb-6 border-b border-zinc-200/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
		<div>
			<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
				<span class="w-2 h-2 rounded-full bg-rose-600"></span>
				<span>League Center</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-zinc-950 tracking-tight">
				NPFL Football Hub
			</h1>
			<p class="text-zinc-500 text-sm md:text-base mt-2">
				Live standings, upcoming fixtures, club profiles, and premier Nigerian football dispatches.
			</p>
		</div>

		<!-- Quick Hub Navigation Pills -->
		<div class="flex items-center gap-2 flex-wrap">
			<span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-zinc-950">
				NPFL Hub
			</span>
			<a
				href="/npfl/standings"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Standings
			</a>
			<a
				href="/npfl/fixtures"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Fixtures
			</a>
			<a
				href="/npfl/matchday"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Matchday
			</a>
			<a
				href="/npfl/clubs"
				class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors"
			>
				Clubs
			</a>
		</div>
	</div>

	<!-- Main Hub Grid Layout -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Left 2 Cols: Spotlight Matches + Latest NPFL News -->
		<div class="lg:col-span-2 space-y-10">
			<!-- Spotlight Matches -->
			<section>
				<div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
					<div class="flex items-center gap-2">
						<h2 class="text-lg md:text-xl font-black text-zinc-950">Upcoming & Active Matches</h2>
						{#if data.currentMatchday}
							<span class="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-mono font-semibold">
								MD {data.currentMatchday}
							</span>
						{/if}
					</div>
					<a
						href="/npfl/fixtures"
						class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors"
					>
						All Fixtures ↗
					</a>
				</div>

				{#if data.fixtures && data.fixtures.length > 0}
					<NPFLFixtures fixtures={data.fixtures} limit={4} compact={false} />
				{:else}
					<div class="bg-zinc-50 rounded-2xl p-6 text-center text-zinc-500 text-sm font-mono border border-zinc-200/80">
						No fixtures scheduled at this time.
					</div>
				{/if}
			</section>

			<!-- NPFL News & Analysis -->
			{#if data.articles && data.articles.length > 0}
				<section>
					<div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
						<h2 class="text-lg md:text-xl font-black text-zinc-950">Latest League Dispatches</h2>
						<a
							href="/tags/npfl"
							class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors"
						>
							More Stories ↗
						</a>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each data.articles as article}
							<PostCard post={article} size="small" />
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- Right 1 Col: Standings Leaderboard + Clubs Directory -->
		<div class="space-y-8">
			<!-- League Table Preview -->
			<section class="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-sm">
				<div class="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
					<h3 class="text-base font-black text-zinc-950">League Table</h3>
					<a
						href="/npfl/standings"
						class="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors"
					>
						Full Table ↗
					</a>
				</div>

				{#if data.table && data.table.length > 0}
					<NPFLTable table={data.table} limit={6} compact={true} />
					<div class="mt-3 pt-2 text-center">
						<a
							href="/npfl/standings"
							class="inline-block w-full py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-mono font-bold transition-colors border border-zinc-200/80"
						>
							View Complete 20-Club Table →
						</a>
					</div>
				{:else}
					<p class="text-zinc-500 text-xs font-mono py-4 text-center">Table standings currently loading...</p>
				{/if}
			</section>

			<!-- Quick Clubs Grid -->
			<section class="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-sm">
				<div class="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
					<h3 class="text-base font-black text-zinc-950">NPFL Clubs</h3>
					<a
						href="/npfl/clubs"
						class="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-rose-600 transition-colors"
					>
						Directory ↗
					</a>
				</div>

				{#if data.table && data.table.length > 0}
					<div class="grid grid-cols-4 gap-2.5 pt-1">
						{#each data.table.slice(0, 12) as row}
							{@const slug = row.slug || clubToSlug(row.club)}
							{@const logo = row.logo || getClubLogo(slug)}
							<a
								href={`/npfl/clubs/${slug}`}
								title={row.club}
								class="aspect-square rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 p-2 flex items-center justify-center transition-all hover:scale-105 shadow-2xs group"
							>
								{#if logo}
									<img
										src={logo}
										alt={row.club}
										class="max-w-full max-h-full object-contain"
										loading="lazy"
									/>
								{:else}
									<span class="text-[9px] font-mono font-bold text-zinc-500 group-hover:text-rose-600">
										{row.club.slice(0, 3).toUpperCase()}
									</span>
								{/if}
							</a>
						{/each}
					</div>
					<div class="mt-3.5 pt-2 text-center">
						<a
							href="/npfl/clubs"
							class="text-[11px] font-mono font-bold text-rose-600 hover:underline"
						>
							Browse All 20 Club Profiles →
						</a>
					</div>
				{/if}
			</section>
		</div>
	</div>
</main>

<style>
	.npfl-hub-page {
		width: 100%;
	}
</style>
