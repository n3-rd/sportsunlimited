import { getTags, getTrendingPosts } from '$lib/utils/sanity';

export const load = async ({ url, fetch }) => {
	const { pathname } = url;

	// Load trending posts and tags for sidebar
	const trendingPosts = await getTrendingPosts(5);
	const tags = await getTags();

	// Fetch NPFL data for sidebar
	let npflTable: any[] = [];
	let npflFixtures: any[] = [];
	
	try {
		const [tableRes, fixturesRes] = await Promise.allSettled([
			fetch('/api/npfl/table'),
			fetch('/api/npfl/matchday/current')
		]);

		if (tableRes.status === 'fulfilled' && tableRes.value.ok) {
			const tableData = await tableRes.value.json();
			if (tableData.ok && tableData.table) {
				npflTable = tableData.table;
			}
		}

		if (fixturesRes.status === 'fulfilled' && fixturesRes.value.ok) {
			const fixturesData = await fixturesRes.value.json();
			if (fixturesData.ok && fixturesData.fixtures) {
				npflFixtures = fixturesData.fixtures;
			}
		}
	} catch (err) {
		console.error('Error fetching NPFL data:', err);
	}

	return {
		pathname,
		trendingPosts,
		tags: [...new Set(tags)].slice(0, 10), // Top 10 unique tags
		npflTable,
		npflFixtures
	};
};