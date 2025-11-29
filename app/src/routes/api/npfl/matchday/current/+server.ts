import { json } from '@sveltejs/kit';
import { NPFL_FIXTURES_URL, parseNpflFixtures, pickCurrentMatchday } from '$lib/npfl';

// simple in-memory cache (5 mins)
type MatchdayResponse = {
	ok: boolean;
	currentMatchday: number | null;
	count?: number;
	fixtures?: Array<{
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
	}>;
	source?: string;
	error?: string;
};
let cached: { at: number; data: MatchdayResponse } | null = null;
const TTL_MS = 5 * 60 * 1000;

export async function GET({ fetch }) {
	try {
		console.log('[GET] /api/npfl/matchday/current - Request received at', new Date().toISOString());

		if (cached && Date.now() - cached.at < TTL_MS) {
			console.log('[GET] Returning cached data');
			return json(cached.data, { headers: { 'cache-control': 'public, max-age=60' } });
		}

		console.log('[GET] Fetching from NPFL:', NPFL_FIXTURES_URL);
		const fetchStart = Date.now();
		
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
		
		let res;
		try {
			res = await fetch(NPFL_FIXTURES_URL, {
				headers: {
					'user-agent': 'sportsunlimited/1.0 (+https://sportsunlimited.ng)',
					'accept': 'text/html'
				},
				signal: controller.signal
			});
			clearTimeout(timeoutId);
		} catch (fetchError: unknown) {
			const error = fetchError as Error;
			clearTimeout(timeoutId);
			console.error('[GET] Fetch error:', error.message, error.name);
			return json({ 
				ok: false, 
				error: `Fetch failed: ${error.message || 'Network error'}` 
			}, { status: 502 });
		}

		const fetchTime = Date.now() - fetchStart;
		console.log(`[GET] Fetch completed in ${fetchTime}ms, status: ${res.status}`);

		if (!res.ok) {
			console.error(`[GET] NPFL fetch failed: ${res.status} ${res.statusText}`);
			const errorText = await res.text().catch(() => '');
			console.error('[GET] Error response body:', errorText.substring(0, 500));
			return json({ ok: false, error: `NPFL fetch failed: ${res.status}` }, { status: 502 });
		}

		const html = await res.text();
		console.log(`[GET] Received HTML, length: ${html.length}`);
		
		if (html.length < 100) {
			console.error('[GET] HTML too short, might be an error page');
			return json({ ok: false, error: 'Received invalid HTML response' }, { status: 502 });
		}

		const fixtures = parseNpflFixtures(html);
		
		console.log('[debug] fixtures parsed:', fixtures.length);
		console.log('[debug] sample:', fixtures.slice(0, 3));

		const currentMatchday = pickCurrentMatchday(fixtures);
		if (currentMatchday == null) {
			console.log('[GET] No current matchday found');
			return json({ ok: true, currentMatchday: null, fixtures: [], source: NPFL_FIXTURES_URL });
		}

		const mdFixtures = fixtures
			.filter((f) => f.matchday === currentMatchday)
			.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());

		console.log(`[GET] Returning Matchday ${currentMatchday} with ${mdFixtures.length} fixtures`);

		const data = {
			ok: true,
			currentMatchday,
			count: mdFixtures.length,
			fixtures: mdFixtures,
			source: NPFL_FIXTURES_URL
		};

		cached = { at: Date.now(), data };
		console.log('[GET] Cached response, returning');
		return json(data, { headers: { 'cache-control': 'public, max-age=60' } });
	} catch (error: unknown) {
		const err = error as Error;
		console.error('[GET] Unexpected error:', err);
		console.error('[GET] Error stack:', err.stack);
		return json({ 
			ok: false, 
			error: `Internal error: ${err.message || 'Unknown error'}` 
		}, { status: 500 });
	}
}

