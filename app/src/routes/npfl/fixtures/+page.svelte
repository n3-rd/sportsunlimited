<script lang="ts">
	import NPFLFixtures from '../../../components/NPFLFixtures.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>NPFL Fixtures - Upcoming Matches | Sports Unlimited</title>
	<meta
		name="description"
		content="View upcoming NPFL fixtures and match schedules. Get the latest Nigeria Premier Football League match dates, times, and venues."
	/>
	<meta property="og:title" content="NPFL Fixtures - Upcoming Matches" />
	<meta property="og:description" content="View upcoming NPFL fixtures and match schedules." />
	<link rel="canonical" href="https://www.sportsunlimited.ng/npfl/fixtures" />
</svelte:head>

<main class="npfl-fixtures-page">
	<div class="mb-8">
		<h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">NPFL Fixtures</h1>
		{#if data.currentMatchday}
			<p class="text-gray-600 text-lg">Matchday {data.currentMatchday} - Upcoming matches</p>
		{:else}
			<p class="text-gray-600 text-lg">Upcoming Nigeria Premier Football League matches</p>
		{/if}
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
