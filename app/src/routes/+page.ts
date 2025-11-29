import { getPosts, getTags, getFeaturedPosts, getPostsByTag } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export const load = (async () => {
	const posts = await getPosts();
	const featuredPosts = await getFeaturedPosts(5);
	let tags = await getTags();

	// Remove duplicates
	tags = [...new Set(tags)];

	// Get posts by popular categories
	const categoryPosts: Record<string, any[]> = {};
	const popularTags = tags.slice(0, 4); // Top 4 categories
	
	for (const tag of popularTags) {
		categoryPosts[tag] = await getPostsByTag(tag, 4);
	}

	if (posts) {
		return {
			posts,
			featuredPosts,
			tags,
			categoryPosts
		};
	}

	error(404, 'Not found');
})