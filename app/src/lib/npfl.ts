import * as cheerio from 'cheerio';

export const NPFL_FIXTURES_URL = 'https://npfl.com.ng/fixtures-results/';
export const NPFL_TABLE_URL = 'https://npfl.com.ng/npfl-table/';

export type NPFLFixture = {
	matchday: number;
	kickoff: string;     // ISO
	kickoff_ts: string;  // "YYYY-MM-DD HH:mm:ss"
	home: string;
	homeSlug: string;
	homeLogo: string | null;
	away: string;
	awaySlug: string;
	awayLogo: string | null;
	status: 'scheduled' | 'finished';
	homeScore: number | null;
	awayScore: number | null;
	venue: string | null;
	rawTail: string;
};

export type StandingRow = {
	pos: number;
	club: string;
	slug: string;
	logo: string | null;
	played: number;
	win: number;
	draw: number;
	loss: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDiff: number;
	points: number;
};

export function clubToSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s*\(\s*3sc\s*\)\s*/i, '')
		.replace(/\s+sports\s+club\s*/i, ' ')
		.replace(/\b(fc|sc)\b/gi, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// Initial known official NPFL CDN logo paths (dynamically updated by live scrape)
const KNOWN_LOGOS: Record<string, string> = {
	'shooting-stars': 'https://npfl.com.ng/wp-content/uploads/2019/04/Shooting-Stars-Sports-Club-3SC.png',
	'inter-lagos': 'https://npfl.com.ng/wp-content/uploads/2019/04/WhatsApp-Image-2026-08-04-at-3.12.49-PM-32x32.jpeg',
	'kwara-united': 'https://npfl.com.ng/wp-content/uploads/2019/04/Kwara-United-FC.png',
	'kano-pillars': 'https://npfl.com.ng/wp-content/uploads/2023/07/Kano-Pillars-FC.png',
	'barau': 'https://npfl.com.ng/wp-content/uploads/2025/08/Barau-FC-logo-32x32.jpg',
	'nasarawa-united': 'https://npfl.com.ng/wp-content/uploads/2024/08/Nasarawa-Utd-logo-25x32.jpg',
	'bendel-insurance': 'https://npfl.com.ng/wp-content/uploads/2019/04/Bendel-Insurance-FC.png',
	'warri-wolves': 'https://npfl.com.ng/wp-content/uploads/2025/08/Warri-Wolves-logo-32x32.jpg',
	'rangers-international': 'https://npfl.com.ng/wp-content/uploads/2023/07/Rangers-logo-32x32.jpg',
	'katsina-united': 'https://npfl.com.ng/wp-content/uploads/2023/07/Katsina-United-FC.png',
	'niger-tornadoes': 'https://npfl.com.ng/wp-content/uploads/2023/07/Niger-Tornadoes-FC.png',
	'enyimba': 'https://npfl.com.ng/wp-content/uploads/2020/10/Enyimba.png',
	'ikorodu-city': 'https://npfl.com.ng/wp-content/uploads/2024/07/Ikorodu-City-logo-32x32.jpeg',
	'ranchers-bees': 'https://npfl.com.ng/wp-content/uploads/2019/04/WhatsApp-Image-2026-08-04-at-3.12.49-PM-2-21x32.jpeg',
	'doma-united': 'https://npfl.com.ng/wp-content/uploads/2019/04/Doma-United-FC.png',
	'sporting-lagos': 'https://npfl.com.ng/wp-content/uploads/2023/07/Sporting-Lagos-FC.png',
	'rivers-united': 'https://npfl.com.ng/wp-content/uploads/2020/10/RiversUnited-FC.png',
	'plateau-united': 'https://npfl.com.ng/wp-content/uploads/2019/04/Plateau_United.png',
	'abia-warriors': 'https://npfl.com.ng/wp-content/uploads/2019/04/Abia-Warriors-FC.png',
	'kun-khalifat': 'https://npfl.com.ng/wp-content/uploads/2025/08/Ku-Khalifat-FC-logo-32x32.jpg',
	'remo-stars': 'https://npfl.com.ng/wp-content/uploads/2019/04/Remo-Stars-FC.png',
	'lobi-stars': 'https://npfl.com.ng/wp-content/uploads/2019/04/Lobi-Stars-FC.png',
	'sunshine-stars': 'https://npfl.com.ng/wp-content/uploads/2019/04/Sunshine-Stars-FC.png',
	'heartland': 'https://npfl.com.ng/wp-content/uploads/2019/04/Heartland-FC.png',
	'akwa-united': 'https://npfl.com.ng/wp-content/uploads/2019/04/Akwa-United-FC.png',
	'bayelsa-united': 'https://npfl.com.ng/wp-content/uploads/2023/07/Bayelsa-United-FC.png',
	'el-kanemi-warriors': 'https://npfl.com.ng/wp-content/uploads/2019/04/El-Kanemi-Warriors-FC.png'
};

export const KNOWN_CLUB_SLUGS = Object.keys(KNOWN_LOGOS);

const dynamicLogoCache = new Map<string, string>(Object.entries(KNOWN_LOGOS));

export function getClubLogo(nameOrSlug: string): string | null {
	const slug = clubToSlug(nameOrSlug);
	return dynamicLogoCache.get(slug) || dynamicLogoCache.get(nameOrSlug.toLowerCase()) || null;
}

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

		const matchCell = $(tds[1]);
		const matchText = norm(matchCell.text());
		if (!/ vs /i.test(matchText)) return;

		const [home, away] = matchText.split(/\s+vs\s+/i).map((s) => s.trim());
		if (!home || !away) return;

		// Extract logos from match cell
		const imgs = matchCell.find('img').map((_, img) => $(img).attr('src')).get();
		const homeSlug = clubToSlug(home);
		const awaySlug = clubToSlug(away);

		const homeLogo = imgs[0] || getClubLogo(homeSlug);
		const awayLogo = imgs[1] || getClubLogo(awaySlug);

		if (homeLogo) {
			dynamicLogoCache.set(homeSlug, homeLogo);
			dynamicLogoCache.set(home.toLowerCase(), homeLogo);
		}
		if (awayLogo) {
			dynamicLogoCache.set(awaySlug, awayLogo);
			dynamicLogoCache.set(away.toLowerCase(), awayLogo);
		}

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
			homeSlug,
			homeLogo,
			away,
			awaySlug,
			awayLogo,
			status,
			homeScore,
			awayScore,
			venue,
			rawTail: scoreMatch ? `${homeScore} - ${awayScore}` : resultText
		});
	});

	return fixtures;
}

const n = (s: string) => Number(String(s).replace(/[^\d-]/g, '').trim());
const t = (s: string) => String(s).replace(/\s+/g, ' ').trim();

export function parseNpflTable(html: string): StandingRow[] {
	const $ = cheerio.load(html);
	const table = $('table').filter((_idx, el) => t($(el).find('thead').text()).includes('Pos')).first();

	if (!table.length) return [];

	const rows: StandingRow[] = [];

	table.find('tbody tr').each((_idx, tr) => {
		const tds = $(tr).find('td');
		if (tds.length < 10) return;

		const club = t(tds.eq(1).text());
		const slug = clubToSlug(club);
		const logo = getClubLogo(slug) || getClubLogo(club);

		const row: StandingRow = {
			pos: n(t(tds.eq(0).text())),
			club,
			slug,
			logo,
			played: n(t(tds.eq(2).text())),
			win: n(t(tds.eq(3).text())),
			draw: n(t(tds.eq(4).text())),
			loss: n(t(tds.eq(5).text())),
			goalsFor: n(t(tds.eq(6).text())),
			goalsAgainst: n(t(tds.eq(7).text())),
			goalDiff: n(t(tds.eq(8).text())),
			points: n(t(tds.eq(9).text()))
		};

		if (!Number.isFinite(row.pos) || !row.club) return;
		rows.push(row);
	});

	return rows.sort((a, b) => a.pos - b.pos);
}

// In-memory caches with 5-minute TTL
let fixturesCache: { at: number; data: NPFLFixture[] } | null = null;
let tableCache: { at: number; data: StandingRow[] } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

function getFastApiUrl(): string | null {
	if (typeof process !== 'undefined' && process.env.NPFL_API_URL) {
		return process.env.NPFL_API_URL.replace(/\/+$/, '');
	}
	return null;
}

export async function fetchNpflFixtures(fetchFn: typeof fetch = fetch): Promise<NPFLFixture[]> {
	if (fixturesCache && Date.now() - fixturesCache.at < CACHE_TTL) {
		return fixturesCache.data;
	}

	// Try external Python FastAPI if configured
	const fastApiUrl = getFastApiUrl();
	if (fastApiUrl) {
		try {
			const res = await fetchFn(`${fastApiUrl}/api/fixtures`);
			if (res.ok) {
				const json = await res.json();
				if (json.ok && Array.isArray(json.fixtures) && json.fixtures.length > 0) {
					const mapped: NPFLFixture[] = json.fixtures.map((f: any) => ({
						matchday: f.matchday,
						kickoff: f.kickoff,
						kickoff_ts: f.kickoff_ts,
						home: f.home,
						homeSlug: f.home_slug || f.homeSlug,
						homeLogo: f.home_logo || f.homeLogo,
						away: f.away,
						awaySlug: f.away_slug || f.awaySlug,
						awayLogo: f.away_logo || f.awayLogo,
						status: f.status,
						homeScore: f.home_score ?? f.homeScore,
						awayScore: f.away_score ?? f.awayScore,
						venue: f.venue,
						rawTail: f.score_display || `${f.home_score} - ${f.away_score}`
					}));
					fixturesCache = { at: Date.now(), data: mapped };
					return mapped;
				}
			}
		} catch (err) {
			console.log('[fetchNpflFixtures] FastAPI unavailable, falling back to direct scraper');
		}
	}

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10000);

		const res = await fetchFn(NPFL_FIXTURES_URL, {
			headers: {
				'user-agent': 'sportsunlimited/1.0 (+https://sportsunlimited.ng)',
				accept: 'text/html'
			},
			signal: controller.signal
		});
		clearTimeout(timeout);

		if (res.ok) {
			const html = await res.text();
			const data = parseNpflFixtures(html);
			if (data.length > 0) {
				fixturesCache = { at: Date.now(), data };
				return data;
			}
		}
	} catch (err) {
		console.error('[fetchNpflFixtures] Live fetch failed, using fallback/cached if present:', err);
	}

	return fixturesCache?.data || [];
}

export async function fetchNpflTable(fetchFn: typeof fetch = fetch): Promise<StandingRow[]> {
	if (tableCache && Date.now() - tableCache.at < CACHE_TTL) {
		return tableCache.data;
	}

	// Try external Python FastAPI if configured
	const fastApiUrl = getFastApiUrl();
	if (fastApiUrl) {
		try {
			const res = await fetchFn(`${fastApiUrl}/api/table`);
			if (res.ok) {
				const json = await res.json();
				if (json.ok && Array.isArray(json.table) && json.table.length > 0) {
					const mapped: StandingRow[] = json.table.map((r: any) => ({
						pos: r.pos,
						club: r.club,
						slug: r.slug,
						logo: r.logo,
						played: r.played,
						win: r.win,
						draw: r.draw,
						loss: r.loss,
						goalsFor: r.goals_for ?? r.goalsFor,
						goalsAgainst: r.goals_against ?? r.goalsAgainst,
						goalDiff: r.goal_diff ?? r.goalDiff,
						points: r.points
					}));
					tableCache = { at: Date.now(), data: mapped };
					return mapped;
				}
			}
		} catch (err) {
			console.log('[fetchNpflTable] FastAPI unavailable, falling back to direct scraper');
		}
	}

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 10000);

		const res = await fetchFn(NPFL_TABLE_URL, {
			headers: {
				'user-agent': 'sportsunlimited/1.0 (+https://sportsunlimited.ng)',
				accept: 'text/html'
			},
			signal: controller.signal
		});
		clearTimeout(timeout);

		if (res.ok) {
			const html = await res.text();
			const data = parseNpflTable(html);
			if (data.length > 0) {
				tableCache = { at: Date.now(), data };
				return data;
			}
		}
	} catch (err) {
		console.error('[fetchNpflTable] Live fetch failed, using fallback/cached if present:', err);
	}

	return tableCache?.data || [];
}

export async function fetchClubData(slug: string, fetchFn: typeof fetch = fetch) {
	// Parallel fetch live table and live fixtures
	const [table, fixtures] = await Promise.all([
		fetchNpflTable(fetchFn),
		fetchNpflFixtures(fetchFn)
	]);

	const normalizedSlug = clubToSlug(slug);

	// Find standing row
	const standing = table.find((row) => row.slug === normalizedSlug || clubToSlug(row.club) === normalizedSlug) || null;

	// Find all club matches
	const allMatches = fixtures.filter((f) => f.homeSlug === normalizedSlug || f.awaySlug === normalizedSlug);

	// Sort finished matches by matchday / kickoff descending
	const finishedMatches = allMatches
		.filter((f) => f.status === 'finished')
		.sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());

	// Sort upcoming matches by kickoff ascending
	const upcomingMatches = allMatches
		.filter((f) => f.status === 'scheduled')
		.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());

	// Calculate form from last 5 finished matches
	const form = finishedMatches.slice(0, 5).map((m) => {
		const isHome = m.homeSlug === normalizedSlug;
		const teamScore = isHome ? m.homeScore! : m.awayScore!;
		const oppScore = isHome ? m.awayScore! : m.homeScore!;
		const result: 'W' | 'D' | 'L' = teamScore > oppScore ? 'W' : teamScore < oppScore ? 'L' : 'D';
		return {
			result,
			matchday: m.matchday,
			opponent: isHome ? m.away : m.home,
			score: `${m.homeScore} - ${m.awayScore}`,
			isHome
		};
	}).reverse(); // chronological order for form strip

	// Extract home venue from fixtures
	const homeMatchWithVenue = allMatches.find((m) => m.homeSlug === normalizedSlug && m.venue);
	const stadium = homeMatchWithVenue?.venue || 'NPFL Home Ground';

	// Determine club name
	const clubName = standing?.club || allMatches[0]?.home || allMatches[0]?.away || slug.replace(/-/g, ' ').toUpperCase();

	// Determine logo
	const logo = standing?.logo || getClubLogo(normalizedSlug);

	return {
		slug: normalizedSlug,
		clubName,
		logo,
		stadium,
		standing,
		form,
		finishedMatches,
		upcomingMatches,
		totalMatches: allMatches.length
	};
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
	const finished = fixtures.filter((f) => f.status === 'finished');
	if (finished.length === 0) return null;
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

	const PRE_MS = 72 * 60 * 60 * 1000;
	const POST_MS = 24 * 60 * 60 * 1000;

	const candidates = [...byMd.entries()]
		.filter(([, w]) => now >= new Date(w.min.getTime() - PRE_MS) && now <= new Date(w.max.getTime() + POST_MS))
		.sort((a, b) => b[0] - a[0]);

	if (candidates.length) return candidates[0][0];

	let best: { md: number; dt: Date } | null = null;
	for (const [md, w] of byMd.entries()) {
		const dt = w.min;
		if (!best || Math.abs(dt.getTime() - now.getTime()) < Math.abs(best.dt.getTime() - now.getTime())) {
			best = { md, dt };
		}
	}
	return best?.md ?? null;
}
