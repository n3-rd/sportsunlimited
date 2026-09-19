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

<div class="npfl-table-wrapper">
	<div class="overflow-x-auto rounded-xl border border-zinc-200/80 shadow-sm bg-white">
		<table class="w-full border-collapse">
			<thead class="bg-zinc-950 text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
				<tr>
					<th class={compact ? 'px-2.5 py-2.5 text-left font-semibold' : 'px-4 py-3 text-left font-semibold'}>#</th>
					<th class={compact ? 'px-2.5 py-2.5 text-left font-semibold' : 'px-4 py-3 text-left font-semibold'}>Club</th>
					{#if !compact}
						<th class="px-3 py-3 text-center font-semibold">P</th>
						<th class="px-3 py-3 text-center font-semibold">W</th>
						<th class="px-3 py-3 text-center font-semibold">D</th>
						<th class="px-3 py-3 text-center font-semibold">L</th>
						<th class="px-3 py-3 text-center font-semibold">F</th>
						<th class="px-3 py-3 text-center font-semibold">A</th>
						<th class="px-3 py-3 text-center font-semibold">GD</th>
					{/if}
					<th class={compact ? 'px-2.5 py-2.5 text-center font-bold text-white' : 'px-4 py-3 text-center font-bold text-white'}>Pts</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-zinc-100 font-mono text-xs">
				{#each displayTable as row (row.pos)}
					{@const slug = row.slug || clubToSlug(row.club)}
					{@const logo = row.logo || getClubLogo(slug)}
					<tr class="hover:bg-zinc-50 transition-colors duration-150 {row.pos <= 3 ? 'bg-emerald-500/[0.03]' : row.pos >= 18 ? 'bg-rose-500/[0.03]' : ''}">
						<td class="{compact ? 'px-2.5 py-2.5' : 'px-4 py-3'} tabular-nums font-bold {row.pos <= 3 ? 'text-emerald-600' : row.pos >= 18 ? 'text-rose-600' : 'text-zinc-500'}">
							{row.pos}
						</td>
						<td class="{compact ? 'px-2.5 py-2.5' : 'px-4 py-3'}">
							<a href={`/npfl/clubs/${slug}`} class="flex items-center gap-2.5 group">
								{#if logo}
									<img
										src={logo}
										alt={row.club}
										class="w-5 h-5 object-contain flex-shrink-0"
										loading="lazy"
									/>
								{/if}
								<span class="{compact ? 'text-xs font-semibold' : 'text-sm font-semibold'} text-zinc-900 group-hover:text-rose-600 transition-colors">
									{row.club}
								</span>
							</a>
						</td>
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
						<td class="{compact ? 'px-2.5 py-2.5 text-center font-bold text-zinc-950 tabular-nums' : 'px-4 py-3 text-center font-bold text-zinc-950 tabular-nums'}">
							{row.points}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.npfl-table-wrapper {
		width: 100%;
	}
</style>
