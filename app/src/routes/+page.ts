import { getPosts, getTags } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async () => {
	const posts = await getPosts();
	const tags = await getTags();

	console.log(tags);	

	if (posts) {
		return {
			posts,
			tags
		};
	}




	throw error(404, 'Not found');
})