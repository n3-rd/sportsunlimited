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
	<div class="npfl-fixtures-wrapper">
		{#if title}
			<h3 class="text-xl font-bold text-gray-900 mb-4">{title}</h3>
		{/if}
		<div class={compact ? 'space-y-2' : 'space-y-3'}>
			{#each displayFixtures as fixture (fixture.kickoff + fixture.home)}
				{@const homeSlug = fixture.homeSlug || clubToSlug(fixture.home)}
				{@const awaySlug = fixture.awaySlug || clubToSlug(fixture.away)}
				{@const homeLogo = fixture.homeLogo || getClubLogo(homeSlug)}
				{@const awayLogo = fixture.awayLogo || getClubLogo(awaySlug)}

				<div class="bg-white rounded-xl border border-zinc-200/80 {compact ? 'p-3' : 'p-4'} hover:border-zinc-400 hover:shadow-sm transition-all duration-300">
					<!-- Match Header info (Matchday link) -->
					{#if !compact}
						<div class="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
							<a href={`/npfl/matchday/${fixture.matchday}`} class="hover:text-rose-600 transition-colors">
								Matchday {fixture.matchday} →
							</a>
							{#if fixture.status === 'finished'}
								<span class="text-zinc-600 font-bold uppercase text-[9.5px]">FT</span>
							{:else}
								<span class="text-emerald-600 font-bold uppercase text-[9.5px]">Upcoming</span>
							{/if}
						</div>
					{/if}

					<div class="flex flex-col gap-2">
						<!-- Match Info -->
						<div class="flex items-center justify-between gap-2">
							<!-- Home Team -->
							<a
								href={`/npfl/clubs/${homeSlug}`}
								class="flex-1 flex items-center justify-end gap-2 group"
							>
								<div class="font-bold text-zinc-900 {compact ? 'text-xs' : 'text-sm'} leading-tight group-hover:text-rose-600 transition-colors text-right">
									{fixture.home}
								</div>
								{#if homeLogo}
									<img
										src={homeLogo}
										alt={fixture.home}
										class="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
										loading="lazy"
									/>
								{/if}
							</a>

							<!-- Score/Time -->
							<div class="flex flex-col items-center gap-0.5 min-w-[65px] px-2 py-1 rounded-lg bg-zinc-50 border border-zinc-100 flex-shrink-0">
								{#if fixture.status === 'finished'}
									<div class="{compact ? 'text-sm' : 'text-base'} font-mono font-black text-zinc-950 tabular-nums">
										{fixture.homeScore} - {fixture.awayScore}
									</div>
									<span class="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">FT</span>
								{:else}
									<div class="text-[10.5px] font-mono font-semibold text-zinc-800 text-center leading-tight tabular-nums">
										{formatDate(fixture.kickoff)}
									</div>
									<span class="text-[9px] font-mono text-emerald-600 uppercase tracking-wider font-bold">Upcoming</span>
								{/if}
							</div>

							<!-- Away Team -->
							<a
								href={`/npfl/clubs/${awaySlug}`}
								class="flex-1 flex items-center justify-start gap-2 group"
							>
								{#if awayLogo}
									<img
										src={awayLogo}
										alt={fixture.away}
										class="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
										loading="lazy"
									/>
								{/if}
								<div class="font-bold text-zinc-900 {compact ? 'text-xs' : 'text-sm'} leading-tight group-hover:text-rose-600 transition-colors text-left">
									{fixture.away}
								</div>
							</a>
						</div>

						{#if fixture.venue && !compact}
							<div class="text-[11px] text-zinc-400 mt-1 text-center">
								📍 {fixture.venue}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.npfl-fixtures-wrapper {
		width: 100%;
	}
</style>
