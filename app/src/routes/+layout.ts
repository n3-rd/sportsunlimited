import { getTags, getTrendingPosts } from '$lib/utils/sanity';

export const load = async ({ url }) => {
	const { pathname } = url;

	// Load trending posts and tags for sidebar
	const trendingPosts = await getTrendingPosts(5);
	const tags = await getTags();

	return {
		pathname,
		trendingPosts,
		tags: [...new Set(tags)].slice(0, 10) // Top 10 unique tags
	};
};