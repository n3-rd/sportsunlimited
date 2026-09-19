<script lang="ts">
	import SEO from '../../../../components/SEO.svelte';
	import PostCard from '../../../../components/PostCard.svelte';
	import CompactPostCard from '../../../../components/CompactPostCard.svelte';

	interface Props {
		data: {
			clubData: any;
			relatedArticles: any[];
		};
	}

	let { data }: Props = $props();
	const { clubData, relatedArticles } = data;
	const standing = clubData.standing;

	let activeTab = $state<'results' | 'fixtures'>('results');

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
</script>

<SEO
	title={`${clubData.clubName} - NPFL Club Profile, Fixtures & News | Sports Unlimited`}
	description={`Follow ${clubData.clubName} in the Nigeria Premier Football League. Standings, upcoming fixtures, match results, home stadium, and latest news.`}
	canonical={`https://www.sportsunlimited.ng/npfl/clubs/${clubData.slug}`}
/>

<main class="club-profile-page max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
	<!-- Breadcrumb -->
	<nav class="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-6">
		<a href="/" class="hover:text-zinc-900 transition-colors">Home</a>
		<span>/</span>
		<a href="/npfl/standings" class="hover:text-zinc-900 transition-colors">NPFL</a>
		<span>/</span>
		<a href="/npfl/clubs" class="hover:text-zinc-900 transition-colors">Clubs</a>
		<span>/</span>
		<span class="text-zinc-900 font-semibold">{clubData.clubName}</span>
	</nav>

	<!-- Club Hero Card -->
	<div class="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm mb-8">
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
			<!-- Logo + Name -->
			<div class="flex items-center gap-5">
				<div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-zinc-50 border border-zinc-100 p-3 flex items-center justify-center flex-shrink-0 shadow-sm">
					{#if clubData.logo}
						<img
							src={clubData.logo}
							alt={`${clubData.clubName} crest`}
							class="max-w-full max-h-full object-contain"
						/>
					{:else}
						<div class="w-full h-full rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-xl font-mono">
							{clubData.clubName.slice(0, 3).toUpperCase()}
						</div>
					{/if}
				</div>

				<div>
					<div class="flex items-center gap-2 mb-1.5">
						<span class="text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
							Nigeria Premier Football League
						</span>
					</div>
					<h1 class="text-2xl md:text-4xl font-black tracking-tight text-zinc-950 leading-tight">
						{clubData.clubName}
					</h1>
					<div class="flex items-center gap-2 text-xs text-zinc-500 mt-2 flex-wrap">
						<span>📍 {clubData.stadium}</span>
					</div>
				</div>
			</div>

			<!-- Standings & Form Card -->
			{#if standing}
				<div class="flex flex-col md:items-end gap-3 bg-zinc-50/80 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-zinc-100">
					<div class="flex items-center gap-3">
						<div class="text-left md:text-right">
							<span class="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">NPFL Rank</span>
							<span class="text-2xl md:text-3xl font-mono font-black text-zinc-950">
								#{standing.pos}
							</span>
						</div>
						<div class="h-8 w-px bg-zinc-200"></div>
						<div class="text-left md:text-right">
							<span class="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Points</span>
							<span class="text-2xl md:text-3xl font-mono font-black text-rose-600">
								{standing.points}
							</span>
						</div>
					</div>

					<!-- Form Guide -->
					{#if clubData.form && clubData.form.length > 0}
						<div class="flex items-center gap-1.5 pt-1">
							<span class="text-[10px] font-mono text-zinc-400 uppercase mr-1">Form:</span>
							{#each clubData.form as item}
								<span
									title={`Matchday ${item.matchday} vs ${item.opponent} (${item.score})`}
									class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold {item.result === 'W' ? 'bg-emerald-500 text-white shadow-sm' : item.result === 'D' ? 'bg-zinc-300 text-zinc-800' : 'bg-rose-500 text-white shadow-sm'}"
								>
									{item.result}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Season Stats Grid -->
		{#if standing}
			<div class="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8 pt-6 border-t border-zinc-100 text-center">
				<div class="bg-zinc-50/70 p-3 rounded-xl">
					<span class="text-[10.5px] font-mono uppercase text-zinc-400 block mb-1">Played</span>
					<span class="text-lg font-mono font-bold text-zinc-900">{standing.played}</span>
				</div>
				<div class="bg-zinc-50/70 p-3 rounded-xl">
					<span class="text-[10.5px] font-mono uppercase text-zinc-400 block mb-1">Won</span>
					<span class="text-lg font-mono font-bold text-emerald-600">{standing.win}</span>
				</div>
				<div class="bg-zinc-50/70 p-3 rounded-xl">
					<span class="text-[10.5px] font-mono uppercase text-zinc-400 block mb-1">Drawn</span>
					<span class="text-lg font-mono font-bold text-zinc-700">{standing.draw}</span>
				</div>
				<div class="bg-zinc-50/70 p-3 rounded-xl">
					<span class="text-[10.5px] font-mono uppercase text-zinc-400 block mb-1">Lost</span>
					<span class="text-lg font-mono font-bold text-rose-600">{standing.loss}</span>
				</div>
				<div class="bg-zinc-50/70 p-3 rounded-xl">
					<span class="text-[10.5px] font-mono uppercase text-zinc-400 block mb-1">Goals</span>
					<span class="text-lg font-mono font-bold text-zinc-900">{standing.goalsFor}:{standing.goalsAgainst}</span>
				</div>
				<div class="bg-zinc-50/70 p-3 rounded-xl">
					<span class="text-[10.5px] font-mono uppercase text-zinc-400 block mb-1">Goal Diff</span>
					<span class="text-lg font-mono font-bold {standing.goalDiff > 0 ? 'text-emerald-600' : standing.goalDiff < 0 ? 'text-rose-600' : 'text-zinc-600'}">
						{standing.goalDiff > 0 ? '+' : ''}{standing.goalDiff}
					</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Main Content Grid: Matches on Left, News on Right -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
		<!-- Left 2 Cols: Matches & Fixtures -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Tab Switcher -->
			<div class="flex items-center justify-between border-b border-zinc-200/80 pb-3">
				<div class="flex items-center gap-2">
					<button
						onclick={() => (activeTab = 'results')}
						class="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all {activeTab === 'results' ? 'bg-zinc-950 text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}"
					>
						Recent Results ({clubData.finishedMatches.length})
					</button>
					<button
						onclick={() => (activeTab = 'fixtures')}
						class="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all {activeTab === 'fixtures' ? 'bg-zinc-950 text-white shadow-sm' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}"
					>
						Upcoming Fixtures ({clubData.upcomingMatches.length})
					</button>
				</div>
				<a href="/npfl/fixtures" class="text-xs font-mono text-rose-600 hover:underline hidden sm:inline">
					All League Fixtures →
				</a>
			</div>

			<!-- Matches List -->
			{#if activeTab === 'results'}
				{#if clubData.finishedMatches.length > 0}
					<div class="space-y-3">
						{#each clubData.finishedMatches as match}
							<div class="bg-white rounded-2xl border border-zinc-200/80 p-4 hover:border-zinc-400 transition-all shadow-sm">
								<div class="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
									<a href={`/npfl/matchday/${match.matchday}`} class="hover:text-rose-600 transition-colors">
										Matchday {match.matchday}
									</a>
									<span>{formatDate(match.kickoff)}</span>
								</div>

								<div class="flex items-center justify-between gap-3">
									<!-- Home Team -->
									<a
										href={`/npfl/clubs/${match.homeSlug}`}
										class="flex-1 flex items-center justify-end gap-2.5 group"
									>
										<span class="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors text-right">
											{match.home}
										</span>
										{#if match.homeLogo}
											<img src={match.homeLogo} alt={match.home} class="w-7 h-7 object-contain flex-shrink-0" />
										{/if}
									</a>

									<!-- Score -->
									<div class="px-3 py-1 bg-zinc-100 rounded-lg text-center min-w-[70px]">
										<span class="font-mono text-base font-black text-zinc-950">
											{match.homeScore} - {match.awayScore}
										</span>
										<span class="block text-[9px] font-mono text-zinc-500 uppercase font-bold">FT</span>
									</div>

									<!-- Away Team -->
									<a
										href={`/npfl/clubs/${match.awaySlug}`}
										class="flex-1 flex items-center justify-start gap-2.5 group"
									>
										{#if match.awayLogo}
											<img src={match.awayLogo} alt={match.away} class="w-7 h-7 object-contain flex-shrink-0" />
										{/if}
										<span class="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors text-left">
											{match.away}
										</span>
									</a>
								</div>

								{#if match.venue}
									<div class="text-[11px] text-zinc-400 text-center mt-2.5 pt-2 border-t border-zinc-50">
										📍 {match.venue}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="bg-white rounded-2xl border border-zinc-200/80 p-8 text-center text-zinc-500">
						<p class="text-sm">No completed matches recorded yet for this season.</p>
					</div>
				{/if}
			{:else}
				{#if clubData.upcomingMatches.length > 0}
					<div class="space-y-3">
						{#each clubData.upcomingMatches as match}
							<div class="bg-white rounded-2xl border border-zinc-200/80 p-4 hover:border-zinc-400 transition-all shadow-sm">
								<div class="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
									<a href={`/npfl/matchday/${match.matchday}`} class="hover:text-rose-600 transition-colors">
										Matchday {match.matchday}
									</a>
									<span class="text-emerald-600 font-semibold uppercase">Upcoming</span>
								</div>

								<div class="flex items-center justify-between gap-3">
									<!-- Home Team -->
									<a
										href={`/npfl/clubs/${match.homeSlug}`}
										class="flex-1 flex items-center justify-end gap-2.5 group"
									>
										<span class="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors text-right">
											{match.home}
										</span>
										{#if match.homeLogo}
											<img src={match.homeLogo} alt={match.home} class="w-7 h-7 object-contain flex-shrink-0" />
										{/if}
									</a>

									<!-- Kickoff -->
									<div class="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-center min-w-[90px]">
										<span class="font-mono text-xs font-bold text-zinc-900 block">
											{formatDate(match.kickoff)}
										</span>
									</div>

									<!-- Away Team -->
									<a
										href={`/npfl/clubs/${match.awaySlug}`}
										class="flex-1 flex items-center justify-start gap-2.5 group"
									>
										{#if match.awayLogo}
											<img src={match.awayLogo} alt={match.away} class="w-7 h-7 object-contain flex-shrink-0" />
										{/if}
										<span class="text-sm font-bold text-zinc-900 group-hover:text-rose-600 transition-colors text-left">
											{match.away}
										</span>
									</a>
								</div>

								{#if match.venue}
									<div class="text-[11px] text-zinc-400 text-center mt-2.5 pt-2 border-t border-zinc-50">
										📍 {match.venue}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="bg-white rounded-2xl border border-zinc-200/80 p-8 text-center text-zinc-500">
						<p class="text-sm">No upcoming fixtures scheduled right now.</p>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Right Col: Club Hub & Related Articles -->
		<div class="space-y-6">
			<!-- Quick Hub Links -->
			<div class="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
				<h3 class="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">NPFL Navigation</h3>
				<div class="space-y-2">
					<a href="/npfl/standings" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-mono text-zinc-700 transition-colors">
						<span>Full League Table</span>
						<span>→</span>
					</a>
					<a href="/npfl/fixtures" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-mono text-zinc-700 transition-colors">
						<span>Fixtures & Results</span>
						<span>→</span>
					</a>
					<a href="/npfl/clubs" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 text-xs font-mono text-zinc-700 transition-colors">
						<span>All Clubs Directory</span>
						<span>→</span>
					</a>
				</div>
			</div>

			<!-- Related News Section -->
			{#if relatedArticles && relatedArticles.length > 0}
				<div class="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm">
					<h3 class="text-sm font-bold text-zinc-950 mb-4 pb-2 border-b border-zinc-100 flex items-center justify-between">
						<span>Latest News & Coverage</span>
						<span class="text-xs font-mono text-rose-600 font-normal">{relatedArticles.length} stories</span>
					</h3>
					<div class="space-y-3">
						{#each relatedArticles as article}
							<CompactPostCard post={article} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>
