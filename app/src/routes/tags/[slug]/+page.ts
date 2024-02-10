import { getTaggedPosts } from '$lib/utils/sanity';

export const ssr = false;

export async function load({ params, page, fetch }) {
    const { slug } = params;
    const posts = await getTaggedPosts(slug);
    return { props: { posts } };
}