import { json } from '@sveltejs/kit';
import { NPFL_FIXTURES_URL, parseNpflFixtures, pickPreviousCompletedMatchday } from '$lib/npfl';

let cached: { at: number; data: unknown } | null = null;
const TTL_MS = 5 * 60 * 1000;

export async function GET({ fetch }) {
	if (cached && Date.now() - cached.at < TTL_MS) {
		return json(cached.data, { headers: { 'cache-control': 'public, max-age=60' } });
	}

	const res = await fetch(NPFL_FIXTURES_URL, {
		headers: {
			'user-agent': 'sportsunlimited/1.0 (+https://sportsunlimited.ng)',
			accept: 'text/html'
		}
	});

	if (!res.ok) {
		return json({ ok: false, error: `NPFL fetch failed: ${res.status}` }, { status: 502 });
	}

	const html = await res.text();
	const fixtures = parseNpflFixtures(html);
	const previousMatchday = pickPreviousCompletedMatchday(fixtures);

	if (previousMatchday == null) {
		const data = { ok: true, previousMatchday: null, count: 0, results: [], source: NPFL_FIXTURES_URL };
		cached = { at: Date.now(), data };
		return json(data);
	}

	const results = fixtures
		.filter((f) => f.matchday === previousMatchday && f.status === 'finished')
		.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());

	const data = {
		ok: true,
		previousMatchday,
		count: results.length,
		results,
		source: NPFL_FIXTURES_URL
	};

	cached = { at: Date.now(), data };
	return json(data, { headers: { 'cache-control': 'public, max-age=60' } });
}

