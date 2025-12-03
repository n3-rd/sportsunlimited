import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	if (data.post) {
		return {
			...data.post,
			relatedPosts: data.relatedPosts
		};
	}

	error(404, 'Not found');
}) satisfies PageLoad;
