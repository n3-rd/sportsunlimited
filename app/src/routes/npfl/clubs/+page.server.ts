import { fetchNpflTable, fetchNpflFixtures } from '$lib/npfl';

export async function load({ fetch }) {
	const [table, fixtures] = await Promise.all([
		fetchNpflTable(fetch),
		fetchNpflFixtures(fetch)
	]);

	// Enrich clubs with latest fixture and stadium
	const clubs = table.map((row) => {
		const clubMatches = fixtures.filter((f) => f.homeSlug === row.slug || f.awaySlug === row.slug);
		const homeMatch = clubMatches.find((f) => f.homeSlug === row.slug && f.venue);
		const recentMatches = clubMatches.filter((f) => f.status === 'finished').slice(-3);
		
		return {
			...row,
			stadium: homeMatch?.venue || 'NPFL Stadium',
			recentMatches
		};
	});

	return {
		clubs
	};
}
