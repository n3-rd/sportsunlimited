import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPost, getRelatedPosts } from '$lib/utils/sanity.server';

export const load = (async ({ params }) => {
	const post = await getPost(params.slug);
	
	if (!post) {
		error(404, 'Not found');
	}

	// Fetch related posts based on text matching (title and excerpt)
	const relatedPosts = await getRelatedPosts(params.slug, post.title || '', post.excerpt || '', 4);

	return {
		post,
		relatedPosts
	};
}) satisfies PageServerLoad;
