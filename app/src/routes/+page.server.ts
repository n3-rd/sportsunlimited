import { getPosts, getPostsByTag } from '$lib/utils/sanity.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	let posts: any[] = [];

	try {
		// Only fetch general posts here. Layout already fetches tags and featured posts.
		posts = await getPosts();
	} catch (err) {
		console.error('Error fetching posts:', err);
	}

	const parentData = await parent();
	const tags = parentData.tags || [];

	// Get posts by popular categories in parallel
	const categoryPosts: Record<string, any[]> = {};
	const popularTags = tags.slice(0, 4); // Top 4 categories

	if (popularTags.length > 0) {
		const categoryResults = await Promise.allSettled(
			popularTags.map(tag => getPostsByTag(tag, 4))
		);

		categoryResults.forEach((result, index) => {
			const tag = popularTags[index];
			if (result.status === 'fulfilled') {
				categoryPosts[tag] = result.value;
			} else {
				console.error(`Error fetching posts for tag ${tag}:`, result.reason);
				categoryPosts[tag] = [];
			}
		});
	}

	return {
		posts,
		categoryPosts
	};
}) satisfies PageServerLoad;
