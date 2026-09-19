<script lang="ts">
	import { clubToSlug, getClubLogo } from '$lib/npfl';

	interface Fixture {
		matchday: number;
		kickoff: string;
		kickoff_ts: string;
		home: string;
		homeSlug?: string;
		homeLogo?: string | null;
		away: string;
		awaySlug?: string;
		awayLogo?: string | null;
		status: 'scheduled' | 'finished';
		homeScore: number | null;
		awayScore: number | null;
		venue: string | null;
		rawTail: string;
	}

	interface Props {
		fixtures: Fixture[];
		limit?: number;
		title?: string;
		compact?: boolean;
	}

	let { fixtures = [], limit, title, compact = false }: Props = $props();

	const displayFixtures = limit ? fixtures.slice(0, limit) : fixtures;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-NG', { 
			month: 'short', 
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

{#if displayFixtures.length > 0}
	<div class="npfl-fixtures-wrapper w-full">
		{#if title}
			<h3 class="text-base font-black text-zinc-950 mb-3">{title}</h3>
		{/if}

		{#if compact}
			<!-- Sports App 2-Row Layout for Sidebar & Compact Widgets -->
			<div class="space-y-2.5">
				{#each displayFixtures as fixture (fixture.kickoff + fixture.home)}
					{@const homeSlug = fixture.homeSlug || clubToSlug(fixture.home)}
					{@const awaySlug = fixture.awaySlug || clubToSlug(fixture.away)}
					{@const homeLogo = fixture.homeLogo || getClubLogo(homeSlug)}
					{@const awayLogo = fixture.awayLogo || getClubLogo(awaySlug)}

					<div class="bg-white rounded-2xl border border-zinc-200/90 p-3 hover:border-zinc-400/80 hover:shadow-md transition-all duration-300">
						<!-- Match Header: Matchday + Status / Kickoff -->
						<div class="flex items-center justify-between text-[10.5px] font-mono mb-2 pb-1.5 border-b border-zinc-100">
							<a href={`/npfl/matchday/${fixture.matchday}`} class="text-zinc-500 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1">
								<span>Matchday {fixture.matchday}</span>
								<span class="text-zinc-300">›</span>
							</a>
							{#if fixture.status === 'finished'}
								<span class="px-2 py-0.5 rounded-full bg-zinc-900 text-white font-bold uppercase text-[9px] tracking-wider">
									FT
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 text-emerald-600 font-bold uppercase text-[9.5px]">
									<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
									{formatDate(fixture.kickoff)}
								</span>
							{/if}
						</div>

						<!-- Two Teams List (FotMob / SofaScore App Style) -->
						<div class="space-y-1.5 py-0.5">
							<!-- Home Team Row -->
							<a href={`/npfl/clubs/${homeSlug}`} class="flex items-center justify-between gap-2.5 group py-0.5 hover:translate-x-0.5 transition-transform">
								<div class="flex items-center gap-2.5 min-w-0 flex-1">
									<div class="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-100 p-0.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
										{#if homeLogo}
											<img src={homeLogo} alt={fixture.home} class="max-w-full max-h-full object-contain" loading="lazy" />
										{:else}
											<span class="text-[9px] font-mono font-bold text-zinc-500">
												{fixture.home.slice(0, 2).toUpperCase()}
											</span>
										{/if}
									</div>
									<span class="text-xs font-bold text-zinc-900 group-hover:text-rose-600 transition-colors truncate">
										{fixture.home}
									</span>
								</div>
								<span class="font-mono text-xs font-black text-zinc-950 tabular-nums flex-shrink-0 px-1">
									{fixture.status === 'finished' && fixture.homeScore !== null ? fixture.homeScore : '-'}
								</span>
							</a>

							<!-- Away Team Row -->
							<a href={`/npfl/clubs/${awaySlug}`} class="flex items-center justify-between gap-2.5 group py-0.5 hover:translate-x-0.5 transition-transform">
								<div class="flex items-center gap-2.5 min-w-0 flex-1">
									<div class="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-100 p-0.5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
										{#if awayLogo}
											<img src={awayLogo} alt={fixture.away} class="max-w-full max-h-full object-contain" loading="lazy" />
										{:else}
											<span class="text-[9px] font-mono font-bold text-zinc-500">
												{fixture.away.slice(0, 2).toUpperCase()}
											</span>
										{/if}
									</div>
									<span class="text-xs font-bold text-zinc-900 group-hover:text-rose-600 transition-colors truncate">
										{fixture.away}
									</span>
								</div>
								<span class="font-mono text-xs font-black text-zinc-950 tabular-nums flex-shrink-0 px-1">
									{fixture.status === 'finished' && fixture.awayScore !== null ? fixture.awayScore : '-'}
								</span>
							</a>
						</div>

						<!-- Venue Footer -->
						{#if fixture.venue}
							<div class="mt-2 pt-1.5 border-t border-zinc-100 flex items-center justify-between text-[10.5px] text-zinc-400 font-mono">
								<span class="truncate pr-2">📍 {fixture.venue}</span>
								<a href={`/npfl/clubs/${homeSlug}`} class="text-rose-600 font-semibold hover:underline flex-shrink-0 text-[10px]">
									Club →
								</a>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<!-- Full Page Fixtures Layout -->
			<div class="space-y-3">
				{#each displayFixtures as fixture (fixture.kickoff + fixture.home)}
					{@const homeSlug = fixture.homeSlug || clubToSlug(fixture.home)}
					{@const awaySlug = fixture.awaySlug || clubToSlug(fixture.away)}
					{@const homeLogo = fixture.homeLogo || getClubLogo(homeSlug)}
					{@const awayLogo = fixture.awayLogo || getClubLogo(awaySlug)}

					<div class="bg-white rounded-2xl border border-zinc-200/90 p-4 md:p-5 hover:border-zinc-400/80 hover:shadow-md transition-all duration-300">
						<!-- Match Header info -->
						<div class="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
							<a href={`/npfl/matchday/${fixture.matchday}`} class="hover:text-rose-600 font-semibold transition-colors flex items-center gap-1">
								<span>Matchday {fixture.matchday}</span>
								<span class="text-zinc-300">›</span>
							</a>
							{#if fixture.status === 'finished'}
								<span class="px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-bold uppercase text-[10px] tracking-wider">
									Full Time
								</span>
							{:else}
								<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold uppercase text-[10px] tracking-wider">
									<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
									Upcoming
								</span>
							{/if}
						</div>

						<!-- Match Row -->
						<div class="flex items-center justify-between gap-3 md:gap-4">
							<!-- Home Team -->
							<a
								href={`/npfl/clubs/${homeSlug}`}
								class="flex-1 flex items-center justify-end gap-2.5 md:gap-3 group min-w-0"
							>
								<span class="text-xs sm:text-sm md:text-base font-bold text-zinc-950 group-hover:text-rose-600 transition-colors text-right truncate">
									{fixture.home}
								</span>
								<div class="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-zinc-50 border border-zinc-100 p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
									{#if homeLogo}
										<img src={homeLogo} alt={fixture.home} class="max-w-full max-h-full object-contain" loading="lazy" />
									{:else}
										<span class="text-[10px] font-mono font-bold text-zinc-600">
											{fixture.home.slice(0, 2).toUpperCase()}
										</span>
									{/if}
								</div>
							</a>

							<!-- Center Score / Kickoff Badge -->
							<div class="px-3 md:px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-200/60 min-w-[75px] md:min-w-[95px] text-center flex-shrink-0">
								{#if fixture.status === 'finished'}
									<div class="font-mono text-base md:text-xl font-black text-zinc-950 tabular-nums">
										{fixture.homeScore} - {fixture.awayScore}
									</div>
									<span class="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">FT</span>
								{:else}
									<div class="text-[10.5px] md:text-xs font-mono font-bold text-zinc-900 leading-tight">
										{formatDate(fixture.kickoff)}
									</div>
								{/if}
							</div>

							<!-- Away Team -->
							<a
								href={`/npfl/clubs/${awaySlug}`}
								class="flex-1 flex items-center justify-start gap-2.5 md:gap-3 group min-w-0"
							>
								<div class="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-zinc-50 border border-zinc-100 p-1 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
									{#if awayLogo}
										<img src={awayLogo} alt={fixture.away} class="max-w-full max-h-full object-contain" loading="lazy" />
									{:else}
										<span class="text-[10px] font-mono font-bold text-zinc-600">
											{fixture.away.slice(0, 2).toUpperCase()}
										</span>
									{/if}
								</div>
								<span class="text-xs sm:text-sm md:text-base font-bold text-zinc-950 group-hover:text-rose-600 transition-colors text-left truncate">
									{fixture.away}
								</span>
							</a>
						</div>

						{#if fixture.venue}
							<div class="mt-3 pt-2.5 border-t border-zinc-100 text-center text-xs text-zinc-400 font-mono truncate">
								📍 {fixture.venue}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.npfl-fixtures-wrapper {
		width: 100%;
	}
</style>
