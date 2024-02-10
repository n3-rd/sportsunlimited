import { getPosts, getTags } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	const posts = await getPosts();
	let tags = await getTags();

	// Remove duplicates
	tags = [...new Set(tags)];

	console.log(tags);  

	if (posts) {
		return {
			posts,
			tags
		};
	}

	throw error(404, 'Not found');
})