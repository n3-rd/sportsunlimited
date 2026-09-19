<script lang="ts">
	import NPFLFixtures from '../../../components/NPFLFixtures.svelte';
	import SEO from '../../../components/SEO.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const fixturesSchema = {
		'@context': 'https://schema.org',
		'@type': 'SportsEventSeries',
		name: 'Nigeria Premier Football League Fixtures',
		sport: 'Soccer',
		organizer: {
			'@type': 'SportsOrganization',
			name: 'Nigeria Premier Football League',
			url: 'https://npfl.com.ng'
		},
		subEvent: (data.fixtures || []).slice(0, 20).map((f: any) => ({
			'@type': 'SportsEvent',
			name: `${f.home} vs ${f.away}`,
			startDate: f.kickoff_ts || f.kickoff,
			sport: 'Soccer',
			location: {
				'@type': 'Place',
				name: f.venue || 'NPFL Venue'
			},
			competitor: [
				{ '@type': 'SportsTeam', name: f.home },
				{ '@type': 'SportsTeam', name: f.away }
			]
		}))
	};
</script>

<SEO
	title="NPFL Fixtures - Upcoming Matches & Results | Sports Unlimited"
	description="View upcoming NPFL fixtures, match schedules, live scores, kick-off dates, times, and venues for the Nigeria Premier Football League."
	schemaorg={fixturesSchema}
/>

<main class="npfl-fixtures-page max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
	<div class="mb-8 pb-6 border-b border-zinc-200/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
		<div>
			<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
				<span>Nigeria Premier Football League</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-zinc-950">NPFL Fixtures</h1>
			{#if data.currentMatchday}
				<p class="text-zinc-500 text-sm md:text-base mt-2">Matchday {data.currentMatchday} • Current & Upcoming Matches</p>
			{:else}
				<p class="text-zinc-500 text-sm md:text-base mt-2">Upcoming Nigeria Premier Football League matches and results</p>
			{/if}
		</div>

		<!-- Quick Hub Nav -->
		<div class="flex items-center gap-2 flex-wrap">
			<a href="/npfl/standings" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
				Standings
			</a>
			<span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-zinc-950">
				Fixtures
			</span>
			<a href="/npfl/matchday" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
				Matchdays
			</a>
			<a href="/npfl/clubs" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
				Clubs
			</a>
		</div>
	</div>

	{#if data.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
			<p class="text-red-800">Error loading fixtures: {data.error}</p>
		</div>
	{:else if data.fixtures && data.fixtures.length > 0}
		<NPFLFixtures fixtures={data.fixtures} />
		{#if data.source}
			<p class="text-xs text-gray-500 mt-4 text-center">
				Data source: <a href={data.source} target="_blank" rel="noopener noreferrer" class="underline">NPFL Official</a>
			</p>
		{/if}
	{:else}
		<div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
			<p class="text-gray-600">No upcoming fixtures available at the moment.</p>
		</div>
	{/if}
</main>

<style>
	.npfl-fixtures-page {
		max-width: 100%;
	}
</style>
