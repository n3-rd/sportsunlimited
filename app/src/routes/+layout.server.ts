import { getTags, getTrendingPosts } from '$lib/utils/sanity.server';

export const load = async ({ url, fetch }) => {
	const { pathname } = url;

	// Load trending posts and tags for sidebar
	let trendingPosts: any[] = [];
	let tags: string[] = [];
	let npflTable: any[] = [];
	let npflFixtures: any[] = [];

	try {
		const [trendingPostsResult, tagsResult, tableRes, fixturesRes] = await Promise.allSettled([
			getTrendingPosts(5),
			getTags(),
			fetch('/api/npfl/table'),
			fetch('/api/npfl/matchday/current')
		]);

		if (trendingPostsResult.status === 'fulfilled') {
			trendingPosts = trendingPostsResult.value;
		}

		if (tagsResult.status === 'fulfilled') {
			tags = tagsResult.value;
		}

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
		console.error('Error in layout load data fetching:', err);
	}

	return {
		pathname,
		featuredPosts: trendingPosts,
		tags,
		npflTable,
		npflFixtures
	};
};

