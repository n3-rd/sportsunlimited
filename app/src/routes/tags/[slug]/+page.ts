import { getTaggedPosts } from '$lib/utils/sanity';

export const ssr = false;

export async function load({ params}) {
    const { slug } = params;
    const posts = await getTaggedPosts(slug);
    return { props: { posts, slug } };
}