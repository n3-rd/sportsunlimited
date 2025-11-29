import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPost, getRelatedPosts } from '$lib/utils/sanity';

export const load = (async ({ params }) => {
	const post = await getPost(params.slug);
	
	if (!post) {
		error(404, 'Not found');
	}

	// Fetch related posts based on tags
	const relatedPosts = await getRelatedPosts(params.slug, post.tags || [], 4);

	return {
		post,
		relatedPosts
	};
}) satisfies PageServerLoad;
