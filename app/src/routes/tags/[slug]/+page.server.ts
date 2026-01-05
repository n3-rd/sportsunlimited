import { getTaggedPosts } from '$lib/utils/sanity.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const capitalizeFirstLetter = (string: string) => {
        const words = string.split('-');
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    const { slug } = params;
    const tag = capitalizeFirstLetter(slug);
    const posts = await getTaggedPosts(tag);
    return { 
        posts,
        tag,
        slug
    };
}) satisfies PageServerLoad;

