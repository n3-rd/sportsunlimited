<script lang="ts">
	import SEO from '../../../../components/SEO.svelte';
	import NPFLTable from '../../../../components/NPFLTable.svelte';

	interface Props {
		data: {
			matchday: number;
			fixtures: any[];
			availableMatchdays: number[];
			prevMatchday: number | null;
			nextMatchday: number | null;
			stats: {
				totalMatches: number;
				finishedCount: number;
				scheduledCount: number;
				totalGoals: number;
			};
			topTable: any[];
		};
	}

	let { data }: Props = $props();
	const { matchday, fixtures, availableMatchdays, prevMatchday, nextMatchday, stats, topTable } = data;

	function formatDate(dateStr: string) {
		const dt = new Date(dateStr);
		return dt.toLocaleDateString('en-NG', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const matchdaySchema = {
		'@context': 'https://schema.org',
		'@type': 'SportsEventSeries',
		name: `NPFL Matchday ${matchday}`,
		sport: 'Soccer',
		organizer: {
			'@type': 'SportsOrganization',
			name: 'Nigeria Premier Football League',
			url: 'https://npfl.com.ng'
		},
		subEvent: fixtures.map((f: any) => ({
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
	title={`NPFL Matchday ${matchday} Fixtures, Scores & Results | Sports Unlimited`}
	description={`Full fixture list, live scores, results, venues, and team statistics for Nigeria Premier Football League Matchday ${matchday}.`}
	schemaorg={matchdaySchema}
/>

<main class="matchday-page max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
	<!-- Breadcrumb -->
	<nav class="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6">
		<a href="/" class="hover:text-zinc-900 transition-colors">Home</a>
		<span>/</span>
		<a href="/npfl/standings" class="hover:text-zinc-900 transition-colors">NPFL</a>
		<span>/</span>
		<a href="/npfl/fixtures" class="hover:text-zinc-900 transition-colors">Fixtures</a>
		<span>/</span>
		<span class="text-zinc-900 font-semibold">Matchday {matchday}</span>
	</nav>

	<!-- Header & Matchday Switcher -->
	<div class="mb-10 pb-6 border-b border-zinc-200/80">
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
					<span>Nigeria Premier Football League</span>
				</div>
				<h1 class="text-3xl md:text-5xl font-black tracking-tight text-zinc-950">
					Matchday {matchday}
				</h1>
				<p class="text-zinc-500 text-sm md:text-base mt-2">
					Official match results, kickoff times, scores, and venue dispatches.
				</p>
			</div>

			<!-- Prev / Next Navigation Controls -->
			<div class="flex items-center gap-3">
				{#if prevMatchday}
					<a
						href={`/npfl/matchday/${prevMatchday}`}
						class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-mono font-bold text-zinc-800 shadow-sm transition-all"
					>
						← Matchday {prevMatchday}
					</a>
				{/if}
				{#if nextMatchday}
					<a
						href={`/npfl/matchday/${nextMatchday}`}
						class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-mono font-bold text-zinc-800 shadow-sm transition-all"
					>
						Matchday {nextMatchday} →
					</a>
				{/if}
			</div>
		</div>

		<!-- Matchday Quick Pill Switcher -->
		{#if availableMatchdays.length > 1}
			<div class="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
				<span class="text-xs font-mono uppercase text-zinc-400 mr-1 flex-shrink-0">Jump to:</span>
				{#each availableMatchdays as md}
					<a
						href={`/npfl/matchday/${md}`}
						class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex-shrink-0 {md === matchday ? 'bg-zinc-950 text-white shadow-sm' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}"
					>
						MD {md}
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Matchday Stats Strip -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
		<div class="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
			<span class="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Total Fixtures</span>
			<span class="text-2xl font-mono font-black text-zinc-900">{stats.totalMatches}</span>
		</div>
		<div class="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
			<span class="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Completed</span>
			<span class="text-2xl font-mono font-black text-emerald-600">{stats.finishedCount}</span>
		</div>
		<div class="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
			<span class="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Upcoming</span>
			<span class="text-2xl font-mono font-black text-zinc-700">{stats.scheduledCount}</span>
		</div>
		<div class="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
			<span class="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Goals Scored</span>
			<span class="text-2xl font-mono font-black text-rose-600">{stats.totalGoals}</span>
		</div>
	</div>

	<!-- Main Grid: Fixtures & Mini Standings -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Match Cards (2 Cols) -->
		<div class="lg:col-span-2 space-y-4">
			{#if fixtures.length > 0}
				{#each fixtures as fixture}
					<div class="bg-white rounded-2xl border border-zinc-200/80 p-5 hover:border-zinc-400 transition-all shadow-sm">
						<div class="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
							<span>{formatDate(fixture.kickoff)}</span>
							{#if fixture.status === 'finished'}
								<span class="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold uppercase text-[10px]">
									Full Time
								</span>
							{:else}
								<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase text-[10px]">
									Upcoming
								</span>
							{/if}
						</div>

						<div class="flex items-center justify-between gap-4">
							<!-- Home Team -->
							<a
								href={`/npfl/clubs/${fixture.homeSlug}`}
								class="flex-1 flex items-center justify-end gap-3 group"
							>
								<span class="text-sm md:text-base font-bold text-zinc-950 group-hover:text-rose-600 transition-colors text-right">
									{fixture.home}
								</span>
								{#if fixture.homeLogo}
									<div class="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
										<img src={fixture.homeLogo} alt={fixture.home} class="max-w-full max-h-full object-contain" />
									</div>
								{/if}
							</a>

							<!-- Center Score / Time Badge -->
							<div class="px-4 py-2 rounded-xl bg-zinc-100 min-w-[85px] text-center flex-shrink-0">
								{#if fixture.status === 'finished'}
									<div class="font-mono text-xl font-black text-zinc-950 tabular-nums">
										{fixture.homeScore} - {fixture.awayScore}
									</div>
								{:else}
									<div class="font-mono text-xs font-bold text-zinc-800">
										VS
									</div>
								{/if}
							</div>

							<!-- Away Team -->
							<a
								href={`/npfl/clubs/${fixture.awaySlug}`}
								class="flex-1 flex items-center justify-start gap-3 group"
							>
								{#if fixture.awayLogo}
									<div class="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
										<img src={fixture.awayLogo} alt={fixture.away} class="max-w-full max-h-full object-contain" />
									</div>
								{/if}
								<span class="text-sm md:text-base font-bold text-zinc-950 group-hover:text-rose-600 transition-colors text-left">
									{fixture.away}
								</span>
							</a>
						</div>

						{#if fixture.venue}
							<div class="mt-3 pt-2.5 border-t border-zinc-50 text-center text-xs text-zinc-500">
								📍 {fixture.venue}
							</div>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="bg-white rounded-2xl border border-zinc-200/80 p-12 text-center text-zinc-500">
					<p class="text-base font-semibold text-zinc-900">No fixtures available for Matchday {matchday}</p>
					<p class="text-sm text-zinc-500 mt-1">Check back soon as fixtures are updated by the league.</p>
				</div>
			{/if}
		</div>

		<!-- Sidebar (1 Col): Top 5 Standings & Hub Links -->
		<div class="space-y-6">
			<!-- Quick Hub -->
			<div class="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
				<h3 class="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">NPFL Navigation</h3>
				<div class="space-y-2">
					<a href="/npfl/standings" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-mono text-zinc-700 transition-colors">
						<span>Full League Table</span>
						<span>→</span>
					</a>
					<a href="/npfl/fixtures" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-mono text-zinc-700 transition-colors">
						<span>Current Matchday</span>
						<span>→</span>
					</a>
					<a href="/npfl/clubs" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-mono text-zinc-700 transition-colors">
						<span>Clubs & Team Profiles</span>
						<span>→</span>
					</a>
				</div>
			</div>

			<!-- Top Standings Preview -->
			{#if topTable && topTable.length > 0}
				<div class="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
					<div class="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
						<h3 class="text-sm font-bold text-zinc-950">League Leaders</h3>
						<a href="/npfl/standings" class="text-xs font-mono text-rose-600 hover:underline">
							View All →
						</a>
					</div>
					<NPFLTable table={topTable} compact={true} />
				</div>
			{/if}
		</div>
	</div>
</main>
