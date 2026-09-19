<script lang="ts">
	import { clubToSlug, getClubLogo } from '$lib/npfl';

	interface StandingRow {
		pos: number;
		club: string;
		slug?: string;
		logo?: string | null;
		played: number;
		win: number;
		draw: number;
		loss: number;
		goalsFor: number;
		goalsAgainst: number;
		goalDiff: number;
		points: number;
	}

	interface Props {
		table: StandingRow[];
		limit?: number;
		showFull?: boolean;
		compact?: boolean;
	}

	let { table = [], limit, showFull = false, compact = false }: Props = $props();

	const displayTable = limit ? table.slice(0, limit) : table;
</script>

<div class="npfl-table-wrapper w-full">
	<div class="overflow-x-auto rounded-2xl border border-zinc-200/90 shadow-sm bg-white">
		<table class="w-full border-collapse">
			<thead class="bg-zinc-950 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
				<tr>
					<th class="{compact ? 'px-2.5 py-2.5' : 'px-4 py-3'} text-left font-semibold w-8">#</th>
					<th class="{compact ? 'px-2 py-2.5' : 'px-4 py-3'} text-left font-semibold">Club</th>
					{#if !compact}
						<th class="px-3 py-3 text-center font-semibold">P</th>
						<th class="px-3 py-3 text-center font-semibold">W</th>
						<th class="px-3 py-3 text-center font-semibold">D</th>
						<th class="px-3 py-3 text-center font-semibold">L</th>
						<th class="px-3 py-3 text-center font-semibold">F</th>
						<th class="px-3 py-3 text-center font-semibold">A</th>
						<th class="px-3 py-3 text-center font-semibold">GD</th>
					{/if}
					<th class="{compact ? 'px-3 py-2.5' : 'px-4 py-3'} text-center font-bold text-white">Pts</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100 font-mono text-xs">
				{#each displayTable as row (row.pos)}
					{@const slug = row.slug || clubToSlug(row.club)}
					{@const logo = row.logo || getClubLogo(slug)}
					{@const isLeader = row.pos === 1}
					{@const isContinental = row.pos === 2 || row.pos === 3}
					{@const isRelegation = row.pos >= 17}

					<tr
						class="hover:bg-zinc-50/90 transition-colors duration-150 {isLeader
							? 'border-l-[3px] border-amber-500 bg-amber-500/[0.04]'
							: isContinental
								? 'border-l-[3px] border-emerald-500 bg-emerald-500/[0.03]'
								: isRelegation
									? 'border-l-[3px] border-rose-500 bg-rose-500/[0.03]'
									: 'border-l-[3px] border-transparent'}"
					>
						<!-- Position Column with Sports Badge -->
						<td class="{compact ? 'px-2.5 py-2' : 'px-4 py-3'} tabular-nums">
							{#if isLeader}
								<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-black border border-amber-300 shadow-xs">
									1
								</span>
							{:else if isContinental}
								<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
									{row.pos}
								</span>
							{:else if isRelegation}
								<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
									{row.pos}
								</span>
							{:else}
								<span class="inline-flex items-center justify-center w-5 h-5 text-zinc-500 font-medium">
									{row.pos}
								</span>
							{/if}
						</td>

						<!-- Club Crest + Name -->
						<td class="{compact ? 'px-2 py-2 min-w-0' : 'px-4 py-3'}">
							<a href={`/npfl/clubs/${slug}`} class="flex items-center gap-2 group min-w-0">
								<div class="w-5 h-5 rounded-md bg-zinc-50 border border-zinc-100 p-0.5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
									{#if logo}
										<img
											src={logo}
											alt={row.club}
											class="max-w-full max-h-full object-contain"
											loading="lazy"
										/>
									{:else}
										<span class="text-[8.5px] font-mono font-bold text-zinc-500">
											{row.club.slice(0, 2).toUpperCase()}
										</span>
									{/if}
								</div>
								<span class="{compact ? 'text-xs font-semibold' : 'text-sm font-semibold'} text-zinc-900 group-hover:text-rose-600 transition-colors truncate">
									{row.club}
								</span>
							</a>
						</td>

						<!-- Detailed Stats (Non-compact) -->
						{#if !compact}
							<td class="px-3 py-3 tabular-nums text-center text-zinc-600">{row.played}</td>
							<td class="px-3 py-3 tabular-nums text-center text-zinc-600">{row.win}</td>
							<td class="px-3 py-3 tabular-nums text-center text-zinc-600">{row.draw}</td>
							<td class="px-3 py-3 tabular-nums text-center text-zinc-600">{row.loss}</td>
							<td class="px-3 py-3 tabular-nums text-center text-zinc-600">{row.goalsFor}</td>
							<td class="px-3 py-3 tabular-nums text-center text-zinc-600">{row.goalsAgainst}</td>
							<td class="px-3 py-3 tabular-nums text-center font-semibold {row.goalDiff > 0 ? 'text-emerald-600' : row.goalDiff < 0 ? 'text-rose-600' : 'text-zinc-500'}">
								{row.goalDiff > 0 ? '+' : ''}{row.goalDiff}
							</td>
						{/if}

						<!-- Points Column -->
						<td class="{compact ? 'px-3 py-2 text-center' : 'px-4 py-3 text-center'}">
							<span class="inline-block px-2 py-0.5 rounded bg-zinc-100 text-zinc-950 font-mono font-black text-xs tabular-nums shadow-2xs">
								{row.points}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Sports Legend for Standings -->
	{#if showFull || !compact}
		<div class="mt-3.5 flex items-center gap-4 flex-wrap text-[11px] font-mono text-zinc-500 px-2 py-1 bg-zinc-50 rounded-xl border border-zinc-100">
			<div class="flex items-center gap-1.5">
				<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
				<span class="font-semibold text-zinc-700">1st: Leader & CAF Champions League</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
				<span class="font-semibold text-zinc-700">2nd–3rd: CAF Continental Spots</span>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
				<span class="font-semibold text-zinc-700">17th–20th: Relegation Zone (NNL)</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.npfl-table-wrapper {
		width: 100%;
	}
</style>
