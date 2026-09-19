import { error } from '@sveltejs/kit';
import { fetchNpflFixtures, fetchNpflTable } from '$lib/npfl';

export async function load({ params, fetch }) {
	const matchday = Number(params.n);

	if (!Number.isFinite(matchday) || matchday < 1) {
		throw error(400, 'Invalid matchday');
	}

	const [fixtures, table] = await Promise.all([
		fetchNpflFixtures(fetch),
		fetchNpflTable(fetch)
	]);

	const availableMatchdays = Array.from(new Set(fixtures.map((f) => f.matchday))).sort((a, b) => a - b);

	if (availableMatchdays.length > 0 && !availableMatchdays.includes(matchday)) {
		throw error(404, `Matchday ${matchday} not found in current season schedule`);
	}

	const matchdayFixtures = fixtures.filter((f) => f.matchday === matchday);

	const finished = matchdayFixtures.filter((f) => f.status === 'finished');
	const scheduled = matchdayFixtures.filter((f) => f.status === 'scheduled');
	const totalGoals = finished.reduce((sum, f) => sum + (f.homeScore ?? 0) + (f.awayScore ?? 0), 0);

	const prevMatchday = availableMatchdays.includes(matchday - 1) ? matchday - 1 : null;
	const nextMatchday = availableMatchdays.includes(matchday + 1) ? matchday + 1 : null;

	return {
		matchday,
		fixtures: matchdayFixtures,
		availableMatchdays,
		prevMatchday,
		nextMatchday,
		stats: {
			totalMatches: matchdayFixtures.length,
			finishedCount: finished.length,
			scheduledCount: scheduled.length,
			totalGoals
		},
		topTable: table.slice(0, 5)
	};
}
