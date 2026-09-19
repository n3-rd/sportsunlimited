<script lang="ts">
	import NPFLTable from '../../../components/NPFLTable.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>NPFL Standings - Nigeria Premier Football League Table | Sports Unlimited</title>
	<meta
		name="description"
		content="View the latest NPFL standings and league table. See current positions, points, wins, draws, losses, and goal differences for all teams in the Nigeria Premier Football League."
	/>
	<meta property="og:title" content="NPFL Standings - Nigeria Premier Football League Table" />
	<meta property="og:description" content="View the latest NPFL standings and league table." />
	<link rel="canonical" href="https://www.sportsunlimited.ng/npfl/standings" />
</svelte:head>

<main class="npfl-standings-page max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
	<div class="mb-8 pb-6 border-b border-zinc-200/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
		<div>
			<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
				<span>Nigeria Premier Football League</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-zinc-950">NPFL Standings</h1>
			<p class="text-zinc-500 text-sm md:text-base mt-2">Current league table, points, goal differences, and form</p>
		</div>

		<!-- Quick Hub Nav -->
		<div class="flex items-center gap-2 flex-wrap">
			<span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-zinc-950">
				Standings
			</span>
			<a href="/npfl/fixtures" class="px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 transition-colors">
				Fixtures
			</a>
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
			<p class="text-red-800">Error loading table: {data.error}</p>
		</div>
	{:else if data.table && data.table.length > 0}
		<NPFLTable table={data.table} showFull={true} />
		{#if data.source}
			<p class="text-xs text-gray-500 mt-4 text-center">
				Data source: <a href={data.source} target="_blank" rel="noopener noreferrer" class="underline">NPFL Official</a>
			</p>
		{/if}
	{:else}
		<div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
			<p class="text-gray-600">No table data available at the moment.</p>
		</div>
	{/if}
</main>

<style>
	.npfl-standings-page {
		max-width: 100%;
	}
</style>
