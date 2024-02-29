import { getTaggedPosts } from '$lib/utils/sanity';


export async function load({ params}) {
    const capitalizeFirstLetter = (string:string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const { slug } = params;
    const posts = await getTaggedPosts(capitalizeFirstLetter(slug));
    return { props: { posts, slug } };
}