import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getPost } from '$lib/utils/sanity';

export const load = (async ({ params }) => {
	const post = await getPost(params.slug);
	const meta = {
		title: post.title,
		description: post.excerpt,
	};
	return { props: { post, meta } };
	

	throw error(404, 'Not found');
}) satisfies PageLoad;
