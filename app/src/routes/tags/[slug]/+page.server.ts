import { getTaggedPosts, getTags } from '$lib/utils/sanity.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const { slug } = params;
    
    // Get all tags to find the original one that matches this slug
    const allTags = await getTags();
    
    const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');
    
    // Find the tag that matches the slug
    const tag = allTags.find(t => slugify(t) === slug) || 
                slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const posts = await getTaggedPosts(tag);
    
    return { 
        posts,
        tag,
        slug
    };
}) satisfies PageServerLoad;

