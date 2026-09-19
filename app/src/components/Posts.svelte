<script lang="ts">
    import Welcome from "./Welcome.svelte";
    import HomepageHero from "./HomepageHero.svelte";
    import PostCard from "./PostCard.svelte";
    import CompactPostCard from "./CompactPostCard.svelte";
    import CategorySection from "./CategorySection.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import BannerAd from "./BannerAd.svelte";
 
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
    // Include carousel posts in featured grid (first 5) + next 1 post to make 6
    const featuredGrid = [...heroPosts, ...posts.slice(5, 11)].slice(0, 6);
    const mainGrid = posts.slice(6, 18); // Next 12 posts for main grid (Latest News)
    const compactList = posts.slice(18, 30); // Next 12 for compact list (More Stories)
    const remainingPosts = posts.slice(30); // Rest of posts

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
        
        <!-- Static Banner Ad -->
        <!-- <div class="mb-12 w-full flex justify-center">
            <img src="/ad-banner.jpeg" alt="Advertisement" class="w-full h-auto rounded-lg shadow-sm" />
        </div> -->
    {/if}

    <!-- Featured Grid - 6 posts in 3 columns -->
    {#if featuredGrid.length > 0}
        <section class="featured-grid mb-14">
            <div class="section-header mb-8 pb-3 border-b border-zinc-200/80">
                <h2 class="text-2xl md:text-3xl font-black tracking-tight text-zinc-950">Featured Stories</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each featuredGrid as post, index}
                    <PostCard 
                        post={post} 
                        size="medium" 
                        loading={index < 3 ? "eager" : "lazy"} 
                        fetchpriority={index < 3 ? "high" : "low"} 
                    />
                {/each}
            </div>
        </section>

        <!-- Banner Ad between Featured and Latest -->
        <div class="my-8 flex justify-center w-full">
            <BannerAd variant="landscape" isAlternative={true} />
        </div>
    {/if}

    <!-- Main Content Grid - 12 posts -->
    {#if mainGrid.length > 0}
        <section class="main-grid mb-14">
            <div class="section-header mb-8 pb-3 border-b border-zinc-200/80">
                <h2 class="text-2xl md:text-3xl font-black tracking-tight text-zinc-950">Latest Dispatches</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each mainGrid as post}
                    <PostCard post={post} size="medium" />
                {/each}
            </div>
        </section>

        <!-- Banner Ad after Latest News -->
        <div class="my-8 flex justify-center w-full">
            <BannerAd variant="landscape" isAlternative={false} />
        </div>
    {/if}

    <!-- Category Sections -->
    {#each categories as category}
        <CategorySection category={category} posts={categoryPosts[category]} />
    {/each}

    <!-- Compact List Section -->
    {#if compactList.length > 0}
        <section class="compact-list mb-14">
            <div class="section-header mb-6 pb-3 border-b border-zinc-200/80">
                <h2 class="text-2xl md:text-3xl font-black tracking-tight text-zinc-950">More Stories</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {#each compactList as post}
                    <CompactPostCard post={post} />
                {/each}
            </div>
        </section>
    {/if}

    <!-- Remaining Posts Grid -->
    {#if remainingPosts.length > 0}
        <section class="remaining-posts mb-14">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {#each remainingPosts.slice(0, displayCount) as post}
                    <PostCard post={post} size="medium" />
                {/each}
            </div>
            {#if remainingPosts.length > displayCount}
                <div class="flex justify-center">
                    <Button onclick={loadMore} class="px-8 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-widest border border-zinc-800 hover:border-zinc-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
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
</style>