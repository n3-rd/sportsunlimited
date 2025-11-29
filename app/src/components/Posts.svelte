<script lang="ts">
    import Welcome from "./Welcome.svelte";
    import HomepageHero from "./HomepageHero.svelte";
    import PostCard from "./PostCard.svelte";
    import CompactPostCard from "./CompactPostCard.svelte";
    import CategorySection from "./CategorySection.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
 
    interface Props {
        posts: any[];
        featuredPosts?: any[];
        categoryPosts?: Record<string, any[]>;
    }

    let { posts = [], featuredPosts = [], categoryPosts = {} }: Props = $props();
    
    // Organize posts for different sections
    // Use featured posts for carousel, or first 5 posts
    const heroPosts = featuredPosts.length > 0 
        ? featuredPosts.slice(0, 5) 
        : posts.slice(0, 5);
    // Include carousel posts in featured grid (first 5) + next 6 posts
    const featuredGrid = [...heroPosts, ...posts.slice(5, 11)].slice(0, 6); // Carousel posts + next posts, max 6
    const mainGrid = posts.slice(11, 23); // Next 12 posts for main grid
    const compactList = posts.slice(23, 35); // Next 12 for compact list
    const remainingPosts = posts.slice(35); // Rest of posts

    // Get category names from categoryPosts
    const categories = Object.keys(categoryPosts || {});

    let displayCount = $state(12); // Initial display count for remaining posts

    function loadMore() {
        displayCount += 12;
    }
</script>

<div class="homepage-content">
    <!-- Hero Carousel Section -->
    {#if heroPosts && heroPosts.length > 0}
        <section class="hero-section mb-12">
            <HomepageHero posts={heroPosts} />
        </section>
    {/if}

    <!-- Featured Grid - 6 posts in 3 columns -->
    {#if featuredGrid.length > 0}
        <section class="featured-grid mb-12">
            <div class="section-header mb-6">
                <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-2">Featured Stories</h2>
                <p class="text-gray-600 text-lg">Top stories and breaking news</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each featuredGrid as post}
                    <PostCard post={post} size="medium" />
                {/each}
            </div>
        </section>
    {/if}

    <!-- Main Content Grid - 12 posts -->
    {#if mainGrid.length > 0}
        <section class="main-grid mb-12">
            <div class="section-header mb-6">
                <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-2">Latest News</h2>
                <p class="text-gray-600 text-lg">Stay updated with the latest from Nigerian sports</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {#each mainGrid as post}
                    <PostCard post={post} size="small" />
                {/each}
            </div>
        </section>
    {/if}

    <!-- Category Sections -->
    {#each categories as category}
        <CategorySection category={category} posts={categoryPosts[category]} />
    {/each}

    <!-- Compact List Section -->
    {#if compactList.length > 0}
        <section class="compact-list mb-12">
            <div class="section-header mb-6">
                <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-2">More Stories</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each compactList as post}
                    <CompactPostCard post={post} />
                {/each}
            </div>
        </section>
    {/if}

    <!-- Remaining Posts Grid -->
    {#if remainingPosts.length > 0}
        <section class="remaining-posts mb-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {#each remainingPosts.slice(0, displayCount) as post}
                    <PostCard post={post} size="small" />
                {/each}
            </div>
            {#if remainingPosts.length > displayCount}
                <div class="flex justify-center">
                    <Button onclick={loadMore} class="px-10 py-4 text-base font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-lg">
                        Load More Articles
                    </Button>
                </div>
            {/if}
        </section>
    {/if}

    <!-- Empty State -->
    {#if posts.length === 0}
        <Welcome />
    {/if}
</div>

<style>
    .homepage-content {
        display: flex;
        flex-direction: column;
    }

    .section-header {
        border-bottom: 3px solid #ef4444;
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;
    }

    .featured-grid .section-header,
    .main-grid .section-header,
    .category-section .section-header {
        border-bottom: 3px solid #ef4444;
    }

    .compact-list .section-header {
        border-bottom: 2px solid #e5e7eb;
    }
</style>