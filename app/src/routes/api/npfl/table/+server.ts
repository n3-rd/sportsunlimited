import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

const NPFL_TABLE_URL = 'https://npfl.com.ng/npfl-table/';

type StandingRow = {
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
};

let cached: { at: number; data: unknown } | null = null;
const TTL_MS = 5 * 60 * 1000;

const n = (s: string) => Number(String(s).replace(/[^\d-]/g, '').trim()); // handles "-3" etc
const t = (s: string) => String(s).replace(/\s+/g, ' ').trim();

function parseNpflTable(html: string): StandingRow[] {
	console.log('[parseNpflTable] Starting parse, HTML length:', html.length);

	const $ = cheerio.load(html);

	// Pick the first table that has a thead "Pos"
	const table = $('table').filter((_idx, el) => t($(el).find('thead').text()).includes('Pos')).first();

	console.log('[parseNpflTable] Found', table.length, 'table(s) with "Pos" in thead');

	if (!table.length) {
		console.log('[parseNpflTable] No matching table found');
		return [];
	}

	const rows: StandingRow[] = [];

	table.find('tbody tr').each((_idx, tr) => {
		const tds = $(tr).find('td');
		console.log('[parseNpflTable] Row has', tds.length, 'td elements');

		if (tds.length < 10) {
			console.log('[parseNpflTable] Skipping row with insufficient columns');
			return;
		}

		const row: StandingRow = {
			pos: n(t(tds.eq(0).text())),
			club: t(tds.eq(1).text()),
			played: n(t(tds.eq(2).text())),
			win: n(t(tds.eq(3).text())),
			draw: n(t(tds.eq(4).text())),
			loss: n(t(tds.eq(5).text())),
			goalsFor: n(t(tds.eq(6).text())),
			goalsAgainst: n(t(tds.eq(7).text())),
			goalDiff: n(t(tds.eq(8).text())),
			points: n(t(tds.eq(9).text()))
		};

		console.log('[parseNpflTable] Parsed row:', { pos: row.pos, club: row.club, points: row.points });

		// sanity checks
		if (!Number.isFinite(row.pos) || !row.club) {
			console.log('[parseNpflTable] Skipping invalid row');
			return;
		}

		rows.push(row);
	});

	console.log('[parseNpflTable] Successfully parsed', rows.length, 'rows');
	return rows.sort((a, b) => a.pos - b.pos);
}


export async function GET({ fetch }) {
	console.log('[GET] /api/npfl/table - Request received at', new Date().toISOString());

	if (cached && Date.now() - cached.at < TTL_MS) {
		console.log('[GET] Returning cached data');
		return json(cached.data, { headers: { 'cache-control': 'public, max-age=60' } });
	}

	console.log('[GET] Fetching from NPFL:', NPFL_TABLE_URL);

	let html = '';
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

	try {
		const res = await fetch(NPFL_TABLE_URL, {
			headers: {
				'user-agent': 'sportsunlimited/1.0 (+https://sportsunlimited.ng)',
				accept: 'text/html'
			},
			signal: controller.signal
		});
		clearTimeout(timeoutId);

		if (!res.ok) {
			console.error('[GET] NPFL fetch failed:', res.status, res.statusText);
			return json({ ok: false, error: `NPFL fetch failed: ${res.status}` }, { status: 502 });
		}

		html = await res.text();
		console.log('[GET] Received HTML, length:', html.length);
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			console.error('[GET] NPFL fetch timed out after 8s');
			return json({ ok: false, error: 'NPFL fetch timed out' }, { status: 504 });
		}
		console.error('[GET] NPFL fetch error:', error);
		return json({ ok: false, error: 'Internal server error' }, { status: 500 });
	}

	const table = parseNpflTable(html);
	console.log('[GET] Parsed table with', table.length, 'rows');

	const data = {
		ok: true,
		count: table.length,
		table,
		source: NPFL_TABLE_URL,
		fetchedAt: new Date().toISOString()
	};

	cached = { at: Date.now(), data };
	return json(data, { headers: { 'cache-control': 'public, max-age=60' } });
}
