<script lang="ts">
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import { Clock } from "svelte-radix";
    import Button from "$lib/components/ui/button/button.svelte";
    dayjs.extend(relativeTime);

    interface Props {
        trendingPosts?: any[];
        tags?: string[];
    }

    let { trendingPosts = [], tags: popularTags = [] }: Props = $props();
</script>

<div class="flex flex-col h-full w-full gap-6 sticky top-24">
    <!-- Trending Posts Section -->
    {#if trendingPosts && trendingPosts.length > 0}
        <section class="trending-posts bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Trending Now</h3>
            <div class="flex flex-col gap-4">
                {#each trendingPosts as post, index}
                    <a href={`/post/${post.slug.current}`} class="trending-post-item group">
                        <div class="flex gap-3">
                            <div class="trending-number flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                                    {post.title}
                                </h4>
                                <div class="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock size="14" />
                                    <span>{dayjs(post._createdAt).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Popular Tags Section -->
    {#if popularTags.length > 0}
        <section class="popular-tags bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Popular Categories</h3>
            <div class="flex flex-wrap gap-2">
                {#each popularTags as tag}
                    <a href={`/tags/${tag}`} class="tag-link">
                        <Button variant="outline" size="sm" class="text-xs">
                            {tag}
                        </Button>
                    </a>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Ad/Book Section -->
    <section class="ad-section">
        <img src="/book.jpg" alt="Eyes on the Nigerian League book" class="w-full rounded-lg shadow-sm">
    </section>
</div>

<style>
    .trending-post-item {
        transition: transform 0.2s;
    }
    .trending-post-item:hover {
        transform: translateX(4px);
    }
    .tag-link {
        text-decoration: none;
    }
</style>