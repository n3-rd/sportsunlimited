import { getTags, getTrendingPosts } from '$lib/utils/sanity.server';

const LAYOUT_FETCH_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return Promise.race([
		promise,
		new Promise<never>((_, reject) => {
			timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
		})
	]).finally(() => {
		if (timer) clearTimeout(timer);
	});
}

export const load = async ({ url, fetch }) => {
	const { pathname } = url;

	// Load trending posts and tags for sidebar
	let trendingPosts: any[] = [];
	let tags: string[] = [];
	let npflTable: any[] = [];
	let npflFixtures: any[] = [];

	try {
		const [trendingPostsResult, tagsResult, tableRes, fixturesRes] = await Promise.allSettled([
			withTimeout(getTrendingPosts(5), LAYOUT_FETCH_TIMEOUT_MS, 'getTrendingPosts'),
			withTimeout(getTags(), LAYOUT_FETCH_TIMEOUT_MS, 'getTags'),
			withTimeout(fetch('/api/npfl/table'), LAYOUT_FETCH_TIMEOUT_MS, '/api/npfl/table'),
			withTimeout(fetch('/api/npfl/matchday/current'), LAYOUT_FETCH_TIMEOUT_MS, '/api/npfl/matchday/current')
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

