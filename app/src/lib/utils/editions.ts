import type { Post } from '$lib/types';

export interface EditionTheme {
	id: string;
	name: string;
	tagline: string;
	accent: string;
	accentForeground: string;
	accentMuted: string;
	tickerBg: string;
	tickerText: string;
	paperBg: string;
	paperText: string;
	badgeBg: string;
	badgeText: string;
}

export interface CuratedEditionLayout {
	coverHero: Post;
	spotlightTop: Post | null;
	spotlightBottom: Post | null;
	broadsheetCol1: Post[];
	broadsheetCol2: Post[];
	broadsheetCol3: Post[];
	scorecardBriefs: Post[];
}

export interface WeeklyEdition {
	id: string; // e.g. "2026-w38"
	editionNumber: number;
	year: number;
	weekLabel: string; // "Edition No. 38"
	dateRange: string; // "Sep 14 – Sep 20, 2026"
	startDate: string;
	endDate: string;
	isCurrent: boolean;
	totalPosts: number;
	primaryTag: string;
	posts: Post[];
	theme: EditionTheme;
	curated: CuratedEditionLayout;
}

/**
 * Pre-calibrated high-fashion athletic editorial palettes
 * inspired by House of Heat (electric ultramarine / dark obsidian)
 * and The Free Press (newsprint cream / crimson & ink).
 */
export const EDITION_THEMES: Record<string, EditionTheme> = {
	'house-of-heat': {
		id: 'house-of-heat',
		name: 'Heat Ultramarine',
		tagline: 'HIGH CULTURE • HARDWOOD • SNEAKER HEAT',
		accent: '#2000F5',
		accentForeground: '#FFFFFF',
		accentMuted: 'rgba(32, 0, 245, 0.09)',
		tickerBg: '#2000F5',
		tickerText: '#FFFFFF',
		paperBg: '#F8F9FC',
		paperText: '#090A0F',
		badgeBg: '#2000F5',
		badgeText: '#FFFFFF'
	},
	'pitch-neon': {
		id: 'pitch-neon',
		name: 'Pitch Electric',
		tagline: 'NPFL DERBIES • CONTINENTAL GLORY • THE PITCH',
		accent: '#059669',
		accentForeground: '#FFFFFF',
		accentMuted: 'rgba(5, 150, 105, 0.1)',
		tickerBg: '#064E3B',
		tickerText: '#34D399',
		paperBg: '#F9FAF8',
		paperText: '#06140D',
		badgeBg: '#059669',
		badgeText: '#FFFFFF'
	},
	'fight-crimson': {
		id: 'fight-crimson',
		name: 'Fight Club Crimson',
		tagline: 'HEAVYWEIGHT CLASHES • RING MASTERY • RAW PASSION',
		accent: '#DC2626',
		accentForeground: '#FFFFFF',
		accentMuted: 'rgba(220, 38, 38, 0.08)',
		tickerBg: '#111827',
		tickerText: '#F87171',
		paperBg: '#FAF8F5',
		paperText: '#111111',
		badgeBg: '#DC2626',
		badgeText: '#FFFFFF'
	},
	'court-amber': {
		id: 'court-amber',
		name: 'Hardwood Amber',
		tagline: 'TRACK & FIELD • HOOP CHRONICLES • OLYMPIC SPIRIT',
		accent: '#D97706',
		accentForeground: '#FFFFFF',
		accentMuted: 'rgba(217, 119, 6, 0.1)',
		tickerBg: '#1E1B18',
		tickerText: '#FBBF24',
		paperBg: '#FDFBF7',
		paperText: '#18140E',
		badgeBg: '#D97706',
		badgeText: '#FFFFFF'
	},
	'vintage-broadsheet': {
		id: 'vintage-broadsheet',
		name: 'Classic Broadsheet',
		tagline: 'DEEP JOURNALISM • UNVARNISHED ANALYSIS • THE ARCHIVE',
		accent: '#18181B',
		accentForeground: '#FFFFFF',
		accentMuted: 'rgba(24, 24, 27, 0.08)',
		tickerBg: '#09090B',
		tickerText: '#E4E4E7',
		paperBg: '#F7F4EB',
		paperText: '#18181B',
		badgeBg: '#18181B',
		badgeText: '#FFFFFF'
	}
};

/**
 * Get ISO week number and year from a Date object
 */
export function getIsoWeek(date: Date): { year: number; week: number } {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	return { year: d.getUTCFullYear(), week: weekNo };
}

/**
 * Format a Date object to "Sep 14"
 */
function formatShortDate(d: Date): string {
	return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Compute week bounds (Monday to Sunday) for given year and week number
 */
export function getWeekBounds(year: number, week: number): { start: Date; end: Date; label: string } {
	// Simple ISO week to date conversion
	const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
	const dayOfWeek = simple.getUTCDay();
	const ISOweekStart = new Date(simple);
	if (dayOfWeek <= 4) {
		ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
	} else {
		ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
	}
	const ISOweekEnd = new Date(ISOweekStart);
	ISOweekEnd.setUTCDate(ISOweekStart.getUTCDate() + 6);

	const label = `${formatShortDate(ISOweekStart)} – ${formatShortDate(ISOweekEnd)}, ${year}`;
	return { start: ISOweekStart, end: ISOweekEnd, label };
}

/**
 * Calculate post editorial & visual impact score
 * Chooses the best image and story dynamically
 */
export function calculatePostVisualScore(post: Post): number {
	let score = 0;

	// 1. Mandatory image scoring
	const hasImg = !!post.mainImage?.asset?.url || !!post.mainImage?.mainImageUrl;
	if (hasImg) {
		score += 60;
	} else {
		// heavily penalize posts without imagery for top slots
		score -= 100;
	}

	// 2. High-impact keyword resonance in title
	const title = (post.title || '').toLowerCase();
	const powerWords = [
		'championship',
		'trophy',
		'super eagles',
		'el-kanemi',
		'victor',
		'osimhen',
		'derby',
		'final',
		'clash',
		'soar',
		'record',
		'olympic',
		'exclusive',
		'gold',
		'flamingos',
		'kida',
		'mourns',
		'invest'
	];

	for (const word of powerWords) {
		if (title.includes(word)) {
			score += 15;
		}
	}

	// 3. Category & Tag weight
	const tags = post.tags || [];
	if (tags.includes('Feature')) score += 20;
	if (tags.includes('Interview')) score += 18;
	if (tags.includes('Nigeria League') || tags.includes('NPFL')) score += 14;
	if (tags.includes('Football')) score += 10;
	if (tags.includes('Basketball')) score += 12;
	if (tags.includes('Other Sports')) score += 8;

	// 4. Content richness
	if (post.excerpt && post.excerpt.length > 50) score += 10;
	if (post.body && Array.isArray(post.body) && post.body.length > 2) score += 15;

	// 5. Image filename clue (e.g. high-resolution indicators)
	const imgUrl = post.mainImage?.asset?.url || post.mainImage?.mainImageUrl || '';
	if (imgUrl.endsWith('.jpg') || imgUrl.endsWith('.png') || imgUrl.endsWith('.webp')) {
		score += 5;
	}

	return score;
}

/**
 * Pick dynamic colorway based on dominant tag and edition number
 */
export function getEditionTheme(weekNumber: number, dominantTag = 'Football'): EditionTheme {
	const tagLower = dominantTag.toLowerCase();

	if (tagLower.includes('basketball') || tagLower.includes('culture') || tagLower.includes('kicks')) {
		return EDITION_THEMES['house-of-heat'];
	}
	if (tagLower.includes('fight') || tagLower.includes('box') || tagLower.includes('combat') || tagLower.includes('derby')) {
		return EDITION_THEMES['fight-crimson'];
	}
	if (tagLower.includes('football') || tagLower.includes('league') || tagLower.includes('npfl')) {
		return weekNumber % 2 === 0 ? EDITION_THEMES['pitch-neon'] : EDITION_THEMES['house-of-heat'];
	}
	if (tagLower.includes('athletics') || tagLower.includes('track') || tagLower.includes('olympic')) {
		return EDITION_THEMES['court-amber'];
	}

	// Dynamic deterministic rotation
	const themeKeys = Object.keys(EDITION_THEMES);
	const key = themeKeys[weekNumber % themeKeys.length];
	return EDITION_THEMES[key];
}

/**
 * Curate layout positions for a week's posts
 */
export function curateEditionLayout(posts: Post[]): CuratedEditionLayout {
	if (posts.length === 0) {
		const emptyPost: Post = {
			_type: 'post',
			_createdAt: new Date().toISOString(),
			title: 'Awaiting Stories for this Edition',
			slug: { current: 'welcome' },
			excerpt: 'Coverage is updating live.',
			body: []
		};
		return {
			coverHero: emptyPost,
			spotlightTop: null,
			spotlightBottom: null,
			broadsheetCol1: [],
			broadsheetCol2: [],
			broadsheetCol3: [],
			scorecardBriefs: []
		};
	}

	// Score all posts
	const scored = posts.map(post => ({
		post,
		score: calculatePostVisualScore(post)
	}));

	// Sort by visual/editorial impact score descending
	scored.sort((a, b) => b.score - a.score);

	// Slot 1: Cover Hero (top scored story with best image)
	const coverHero = scored[0].post;

	// Remaining posts
	const remaining = scored.slice(1).map(s => s.post);

	// Slot 2: Spotlight Top (second best visual story)
	const spotlightTop = remaining[0] || null;

	// Slot 3: Spotlight Bottom (third best visual story)
	const spotlightBottom = remaining[1] || null;

	// The rest are organized into 3-column broadsheet and scorecard briefs
	const pool = remaining.slice(2);

	const broadsheetCol1: Post[] = [];
	const broadsheetCol2: Post[] = [];
	const broadsheetCol3: Post[] = [];
	const scorecardBriefs: Post[] = [];

	pool.forEach((p, idx) => {
		if (idx < 3) {
			broadsheetCol1.push(p);
		} else if (idx < 6) {
			broadsheetCol2.push(p);
		} else if (idx < 9) {
			broadsheetCol3.push(p);
		} else if (idx < 18) {
			scorecardBriefs.push(p);
		} else {
			// Distribute evenly among columns
			const colIndex = idx % 3;
			if (colIndex === 0) broadsheetCol1.push(p);
			else if (colIndex === 1) broadsheetCol2.push(p);
			else broadsheetCol3.push(p);
		}
	});

	return {
		coverHero,
		spotlightTop,
		spotlightBottom,
		broadsheetCol1,
		broadsheetCol2,
		broadsheetCol3,
		scorecardBriefs
	};
}

/**
 * Group raw posts into weekly editions
 */
export function groupPostsIntoEditions(posts: Post[]): WeeklyEdition[] {
	if (!posts || posts.length === 0) return [];

	const weekMap: Record<string, { year: number; week: number; posts: Post[] }> = {};

	posts.forEach(post => {
		const dateStr = post._createdAt;
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return;

		const { year, week } = getIsoWeek(d);
		const key = `${year}-w${String(week).padStart(2, '0')}`;

		if (!weekMap[key]) {
			weekMap[key] = { year, week, posts: [] };
		}
		weekMap[key].posts.push(post);
	});

	// Sort week keys descending (latest week first)
	const sortedKeys = Object.keys(weekMap).sort().reverse();
	const currentIso = getIsoWeek(new Date());
	const currentKey = `${currentIso.year}-w${String(currentIso.week).padStart(2, '0')}`;

	return sortedKeys.map((key, index) => {
		const { year, week, posts: weekPosts } = weekMap[key];
		const bounds = getWeekBounds(year, week);

		// Find most frequent tag in this week
		const tagCounts: Record<string, number> = {};
		weekPosts.forEach(p => {
			(p.tags || []).forEach(t => {
				tagCounts[t] = (tagCounts[t] || 0) + 1;
			});
		});
		const dominantTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Football';

		const theme = getEditionTheme(week, dominantTag);
		const curated = curateEditionLayout(weekPosts);

		return {
			id: key,
			editionNumber: week,
			year,
			weekLabel: `Edition No. ${week}`,
			dateRange: bounds.label,
			startDate: bounds.start.toISOString(),
			endDate: bounds.end.toISOString(),
			isCurrent: index === 0 || key === currentKey,
			totalPosts: weekPosts.length,
			primaryTag: dominantTag,
			posts: weekPosts,
			theme,
			curated
		};
	});
}
