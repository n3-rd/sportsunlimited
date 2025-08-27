<script lang="ts">
    import Card from "./Card.svelte";
    import Welcome from "./Welcome.svelte";
    import HomeCarousel from "./HomeCarousel.svelte";
    import PairPosts from "./PairPosts.svelte";
    import { Clock } from "svelte-radix";
    import { urlFor } from "$lib/utils/image";
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import { truncateText } from "$lib/utils/index";
    import PostThumbs from "./PostThumbs.svelte";
    dayjs.extend(relativeTime);
 
    let { posts = $bindable(), latest = posts.slice(0, 8), pairPosts = latest.slice(0, 2) } = $props();
    posts = posts.slice(2); // Remove the first 2 posts from the `posts` array

    let displayCount = $state(8); // Initial number of posts to display

    function loadMore() {
        displayCount += 8; // Load 8 more posts each time
    }
</script>

<div class="flex flex-col gap-8">
    <HomeCarousel items={latest} />
    <PairPosts pair={pairPosts} /> <!-- Include only the pairPosts array -->
    <div class="posts">
     
    </div>
    {#if posts?.length}
    <div class="post-thumbs grid grid-cols-1 md:grid-cols-2 ">
        <PostThumbs posts={posts.slice(0, displayCount)} /> <!-- Include only the posts array -->
    </div>
    {#if posts.length > displayCount}
        <button onclick={loadMore}>Load More</button>
    {/if}
    {:else}
        <Welcome />
    {/if}
</div>