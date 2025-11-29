import { json } from '@sveltejs/kit';
import { NPFL_FIXTURES_URL, parseNpflFixtures } from '$lib/npfl';

export async function GET({ params, fetch }) {
	const n = Number(params.n);

	if (!Number.isFinite(n)) {
		return json({ ok: false, error: 'Invalid matchday' }, { status: 400 });
	}

	const res = await fetch(NPFL_FIXTURES_URL, {
		headers: { 'user-agent': 'sportsunlimited/1.0 (+https://sportsunlimited.ng)', accept: 'text/html' }
	});

	if (!res.ok) return json({ ok: false, error: `NPFL fetch failed: ${res.status}` }, { status: 502 });

	const html = await res.text();
	const fixtures = parseNpflFixtures(html).filter((f) => f.matchday === n);

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
}

