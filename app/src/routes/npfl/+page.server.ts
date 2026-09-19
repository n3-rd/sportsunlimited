import { fetchNpflTable, fetchNpflFixtures } from '$lib/npfl';
import { getPosts } from '$lib/utils/sanity.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [tableResult, fixturesResult, allPosts] = await Promise.all([
		fetchNpflTable().catch((err) => {
			console.error('NPFL Hub table error:', err);
			return { table: [] };
		}),
		fetchNpflFixtures().catch((err) => {
			console.error('NPFL Hub fixtures error:', err);
			return { fixtures: [], currentMatchday: null };
		}),
		getPosts(24).catch(() => [])
	]);

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

	const upcoming = (fixturesResult.fixtures || []).filter((f) => f.status === 'scheduled');
	const finished = (fixturesResult.fixtures || []).filter((f) => f.status === 'finished');

	return {
		table: tableResult.table || [],
		topTable: (tableResult.table || []).slice(0, 6),
		fixtures: fixturesResult.fixtures || [],
		upcomingFixtures: upcoming.length > 0 ? upcoming.slice(0, 4) : (fixturesResult.fixtures || []).slice(0, 4),
		finishedFixtures: finished.slice(0, 4),
		currentMatchday: fixturesResult.currentMatchday,
		articles
	};
};
