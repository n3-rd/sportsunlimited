import { fetchNpflTable, fetchNpflFixtures, pickCurrentMatchday } from '$lib/npfl';
import { getPosts } from '$lib/utils/sanity.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
	});

	const [tableRows, allFixtures, allPosts] = await Promise.all([
		fetchNpflTable(fetch).catch((err) => {
			console.error('NPFL Hub table error:', err);
			return [];
		}),
		fetchNpflFixtures(fetch).catch((err) => {
			console.error('NPFL Hub fixtures error:', err);
			return [];
		}),
		getPosts(24).catch(() => [])
	]);

	const table = Array.isArray(tableRows) ? tableRows : [];
	const fixtures = Array.isArray(allFixtures) ? allFixtures : [];
	const currentMatchday = pickCurrentMatchday(fixtures);

	// Filter articles relevant to NPFL / Nigerian football
	const npflArticles = allPosts.filter((p) => {
		const title = (p.title || '').toLowerCase();
		const tags = (p.tags || []).map((t: string) => t.toLowerCase());
		return (
			tags.some((t: string) => t.includes('npfl') || t.includes('football') || t.includes('league') || t.includes('nigeria')) ||
			title.includes('npfl') ||
			title.includes('league') ||
			title.includes('football')
		);
	}).slice(0, 6);

	const articles = npflArticles.length > 0 ? npflArticles : allPosts.slice(0, 6);

	// Prioritize current matchday fixtures, otherwise upcoming scheduled
	const mdFixtures = currentMatchday
		? fixtures.filter((f) => f.matchday === currentMatchday)
		: [];

	const upcoming = fixtures.filter((f) => f.status === 'scheduled');
	const displayFixtures = mdFixtures.length > 0
		? mdFixtures
		: (upcoming.length > 0 ? upcoming.slice(0, 6) : fixtures.slice(0, 6));

	return {
		table,
		topTable: table.slice(0, 6),
		fixtures: displayFixtures,
		allFixturesCount: fixtures.length,
		currentMatchday,
		articles
	};
};

