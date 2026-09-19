<script lang="ts">
	interface Fixture {
		matchday: number;
		kickoff: string;
		kickoff_ts: string;
		home: string;
		away: string;
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
			{#each displayFixtures as fixture (fixture.kickoff)}
				<div class="bg-white rounded-xl border border-zinc-200/80 {compact ? 'p-3' : 'p-4'} hover:border-zinc-400 hover:shadow-sm transition-all duration-300">
					<div class="flex flex-col gap-2">
						<!-- Match Info -->
						<div class="flex items-center justify-between gap-2">
							<!-- Home Team -->
							<div class="flex-1 text-right">
								<div class="font-bold text-zinc-900 {compact ? 'text-xs' : 'text-sm'} leading-tight">{fixture.home}</div>
								{#if fixture.status === 'finished' && fixture.homeScore !== null}
									<div class="{compact ? 'text-base' : 'text-xl'} font-mono font-black text-zinc-950 mt-0.5">{fixture.homeScore}</div>
								{/if}
							</div>

							<!-- Score/Time -->
							<div class="flex flex-col items-center gap-0.5 min-w-[65px] px-2 py-1 rounded-lg bg-zinc-50 border border-zinc-100">
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
							<div class="flex-1 text-left">
								<div class="font-bold text-zinc-900 {compact ? 'text-xs' : 'text-sm'} leading-tight">{fixture.away}</div>
								{#if fixture.status === 'finished' && fixture.awayScore !== null}
									<div class="{compact ? 'text-base' : 'text-xl'} font-mono font-black text-zinc-950 mt-0.5">{fixture.awayScore}</div>
								{/if}
							</div>
						</div>
						{#if fixture.venue && !compact}
							<div class="text-xs text-gray-500 mt-1 text-center">
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

