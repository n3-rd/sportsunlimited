import { json } from '@sveltejs/kit';
import { fetchNpflFixtures, pickCurrentMatchday, NPFL_FIXTURES_URL } from '$lib/npfl';

export async function GET({ fetch }) {
	try {
		const fixtures = await fetchNpflFixtures(fetch);
		const currentMatchday = pickCurrentMatchday(fixtures);

		if (currentMatchday == null) {
			return json({ ok: true, currentMatchday: null, fixtures: [], source: NPFL_FIXTURES_URL });
		}

		const mdFixtures = fixtures
			.filter((f) => f.matchday === currentMatchday)
			.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());

		const data = {
			ok: true,
			currentMatchday,
			count: mdFixtures.length,
			fixtures: mdFixtures,
			source: NPFL_FIXTURES_URL
		};

		return json(data, { headers: { 'cache-control': 'public, max-age=60' } });
	} catch (error: any) {
		console.error('[GET] /api/npfl/matchday/current error:', error);
		return json({ ok: false, error: error.message || 'Failed to fetch matchday' }, { status: 500 });
	}
}
