import { getPostsForEditions } from '$lib/utils/sanity.server';
import { groupPostsIntoEditions } from '$lib/utils/editions';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	let posts: any[] = [];

	try {
		posts = await getPostsForEditions(1000);
	} catch (err) {
		console.error('Error fetching posts for editions:', err);
	}

	const parentData = await parent();
	const tags = parentData.tags || [];
	const editions = groupPostsIntoEditions(posts);

	return {
		posts,
		editions,
		tags
	};
}) satisfies PageServerLoad;
