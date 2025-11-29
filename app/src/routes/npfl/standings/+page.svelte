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

<main class="npfl-standings-page">
	<div class="mb-8">
		<h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">NPFL Standings</h1>
		<p class="text-gray-600 text-lg">Current Nigeria Premier Football League table and standings</p>
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
