<script lang="ts">
	interface StandingRow {
		pos: number;
		club: string;
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
	<div class="overflow-x-auto">
		<table class="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
			<thead class="bg-gray-900 text-white">
				<tr>
					<th class={compact ? 'px-2 py-2 text-left text-sm font-semibold' : 'px-4 py-3 text-left text-sm font-semibold'}>Pos</th>
					<th class={compact ? 'px-2 py-2 text-left text-sm font-semibold' : 'px-4 py-3 text-left text-sm font-semibold'}>Club</th>
					{#if !compact}
						<th class="px-4 py-3 text-center text-sm font-semibold">P</th>
						<th class="px-4 py-3 text-center text-sm font-semibold">W</th>
						<th class="px-4 py-3 text-center text-sm font-semibold">D</th>
						<th class="px-4 py-3 text-center text-sm font-semibold">L</th>
						<th class="px-4 py-3 text-center text-sm font-semibold">F</th>
						<th class="px-4 py-3 text-center text-sm font-semibold">A</th>
						<th class="px-4 py-3 text-center text-sm font-semibold">GD</th>
					{/if}
					<th class={compact ? 'px-2 py-2 text-center text-sm font-bold' : 'px-4 py-3 text-center text-sm font-bold'}>Pts</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each displayTable as row (row.pos)}
					<tr class="hover:bg-gray-50 transition-colors {row.pos <= 3 ? 'bg-green-50' : row.pos >= 18 ? 'bg-red-50' : ''}">
						<td class="{compact ? 'px-2 py-2' : 'px-4 py-3'} text-sm font-semibold {row.pos <= 3 ? 'text-green-700' : row.pos >= 18 ? 'text-red-700' : 'text-gray-700'}">
							{row.pos}
						</td>
						<td class={compact ? 'px-2 py-2 text-xs font-medium text-gray-900' : 'px-4 py-3 text-sm font-medium text-gray-900'}>{row.club}</td>
						{#if !compact}
							<td class="px-4 py-3 text-sm text-center text-gray-600">{row.played}</td>
							<td class="px-4 py-3 text-sm text-center text-gray-600">{row.win}</td>
							<td class="px-4 py-3 text-sm text-center text-gray-600">{row.draw}</td>
							<td class="px-4 py-3 text-sm text-center text-gray-600">{row.loss}</td>
							<td class="px-4 py-3 text-sm text-center text-gray-600">{row.goalsFor}</td>
							<td class="px-4 py-3 text-sm text-center text-gray-600">{row.goalsAgainst}</td>
							<td class="px-4 py-3 text-sm text-center font-medium {row.goalDiff > 0 ? 'text-green-600' : row.goalDiff < 0 ? 'text-red-600' : 'text-gray-600'}">
								{row.goalDiff > 0 ? '+' : ''}{row.goalDiff}
							</td>
						{/if}
						<td class={compact ? 'px-2 py-2 text-sm text-center font-bold text-gray-900' : 'px-4 py-3 text-sm text-center font-bold text-gray-900'}>{row.points}</td>
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

