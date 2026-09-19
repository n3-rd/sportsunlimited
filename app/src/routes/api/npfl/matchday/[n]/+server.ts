import { json } from '@sveltejs/kit';
import { fetchNpflFixtures, NPFL_FIXTURES_URL } from '$lib/npfl';

export async function GET({ params, fetch }) {
	const n = Number(params.n);

	if (!Number.isFinite(n)) {
		return json({ ok: false, error: 'Invalid matchday' }, { status: 400 });
	}

	try {
		const allFixtures = await fetchNpflFixtures(fetch);
		const fixtures = allFixtures.filter((f) => f.matchday === n);

		const finished = fixtures.filter((f) => f.status === 'finished');
		const scheduled = fixtures.filter((f) => f.status === 'scheduled');

		return json({
			ok: true,
			matchday: n,
			count: fixtures.length,
			finishedCount: finished.length,
			scheduledCount: scheduled.length,
			fixtures,
			source: NPFL_FIXTURES_URL
		});
	} catch (error: any) {
		console.error(`[GET] /api/npfl/matchday/${n} error:`, error);
		return json({ ok: false, error: error.message || 'Failed to fetch matchday' }, { status: 500 });
	}
}
