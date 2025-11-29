import * as cheerio from 'cheerio';

export const NPFL_FIXTURES_URL = 'https://npfl.com.ng/fixtures-results/';

export type NPFLFixture = {
	matchday: number;
	kickoff: string;     // ISO
	kickoff_ts: string;  // "YYYY-MM-DD HH:mm:ss"
	home: string;
	away: string;
	status: 'scheduled' | 'finished';
	homeScore: number | null;
	awayScore: number | null;
	venue: string | null;
	rawTail: string;
};

function norm(s: string) {
	return s.replace(/\s+/g, ' ').trim();
}

// Nigeria is WAT (UTC+1) year-round
function parseWAT(ts: string) {
	return new Date(ts.replace(' ', 'T') + '+01:00');
}

export function parseNpflFixtures(html: string): NPFLFixture[] {
	const $ = cheerio.load(html);

	const fixtures: NPFLFixture[] = [];

	$('table tr').each((_idx, tr) => {
		const tds = $(tr).find('td');
		if (tds.length < 6) return;

		const dateText = norm($(tds[0]).text());
		const tsMatch = dateText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
		if (!tsMatch) return;

		const kickoff_ts = tsMatch[0];

		const matchText = norm($(tds[1]).text());
		if (!/ vs /i.test(matchText)) return;

		const [home, away] = matchText.split(/\s+vs\s+/i).map((s) => s.trim());
		if (!home || !away) return;

		const resultText = norm($(tds[2]).text());
		const scoreMatch = resultText.match(/(\d+)\s*-\s*(\d+)/);

		const homeScore = scoreMatch ? Number(scoreMatch[1]) : null;
		const awayScore = scoreMatch ? Number(scoreMatch[2]) : null;
		const status: NPFLFixture['status'] = scoreMatch ? 'finished' : 'scheduled';

		const venue = norm($(tds[4]).text()) || null;

		const mdText = norm($(tds[5]).text());
		const matchday = Number(mdText);
		if (!Number.isFinite(matchday)) return;

		fixtures.push({
			matchday,
			kickoff_ts,
			kickoff: parseWAT(kickoff_ts).toISOString(),
			home,
			away,
			status,
			homeScore,
			awayScore,
			venue,
			rawTail: scoreMatch ? `${homeScore} - ${awayScore}` : resultText
		});
	});

	return fixtures;
}

export function groupByMatchday(fixtures: NPFLFixture[]) {
	const map = new Map<number, NPFLFixture[]>();

	for (const f of fixtures) {
		const arr = map.get(f.matchday) ?? [];
		arr.push(f);
		map.set(f.matchday, arr);
	}

	for (const [k, arr] of map.entries()) {
		arr.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
		map.set(k, arr);
	}

	return map;
}

export function pickPreviousCompletedMatchday(fixtures: NPFLFixture[]) {
	// Find highest matchday that has at least 1 finished game.
	const finished = fixtures.filter((f) => f.status === 'finished');
	if (finished.length === 0) return null;

	// A matchday is "completed enough" if it has >=1 finished game; tweak if you want full completion.
	return Math.max(...finished.map((f) => f.matchday));
}

export function pickCurrentMatchday(fixtures: { matchday: number; kickoff: string }[]) {
	const now = new Date();
	const byMd = new Map<number, { min: Date; max: Date }>();

	for (const f of fixtures) {
		const dt = new Date(f.kickoff);
		if (Number.isNaN(dt.getTime())) continue;

		const cur = byMd.get(f.matchday);
		if (!cur) byMd.set(f.matchday, { min: dt, max: dt });
		else {
			if (dt < cur.min) cur.min = dt;
			if (dt > cur.max) cur.max = dt;
		}
	}

	const PRE_MS = 72 * 60 * 60 * 1000;  // 3 days before window
	const POST_MS = 24 * 60 * 60 * 1000; // 1 day after window

	const candidates = [...byMd.entries()]
		.filter(([, w]) => now >= new Date(w.min.getTime() - PRE_MS) && now <= new Date(w.max.getTime() + POST_MS))
		.sort((a, b) => b[0] - a[0]); // prefer higher matchday if multiple overlap

	if (candidates.length) return candidates[0][0];

	// fallback: nearest upcoming kickoff
	let best: { md: number; dt: Date } | null = null;
	for (const [md, w] of byMd.entries()) {
		const dt = w.min;
		if (!best || Math.abs(dt.getTime() - now.getTime()) < Math.abs(best.dt.getTime() - now.getTime())) {
			best = { md, dt };
		}
	}
	return best?.md ?? null;
}

