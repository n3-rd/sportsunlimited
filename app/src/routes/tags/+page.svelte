<script lang="ts">
    export let data;
    console.log(data);

    const tagCounts = data.tagCounts
</script>

<svelte:head>
	<title>Sports Tags | Browse Topics - Sports Unlimited</title>
	<meta name="description" content="Browse all sports topics and tags on Sports Unlimited. Find Nigerian sports news by category including Football, NPFL, Basketball, Athletics and more." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/tags" />
	<meta property="og:title" content="Sports Tags | Browse Topics - Sports Unlimited" />
	<meta property="og:description" content="Browse all sports topics and tags on Sports Unlimited. Find Nigerian sports news by category including Football, NPFL, Basketball, Athletics and more." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/tags" />
	<meta name="twitter:title" content="Sports Tags | Browse Topics" />
	<meta name="twitter:description" content="Browse all sports topics and tags on Sports Unlimited. Find Nigerian sports news by category." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	
	<!-- Additional SEO -->
	<meta name="keywords" content="sports tags, sports categories, Nigerian sports topics, NPFL tags, football categories, basketball topics" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/tags" />
</svelte:head>


{#if tagCounts?.size}
    {#each Array.from(tagCounts) as [tag, count]}
        <h2
        class="text-3xl font-bold text-center py-5 hover:text-blue-500"
        >
            <a href={`/tags/${tag}`} class="post__tag">{tag} ({count} posts)</a>
        </h2>
    {/each}
{/if}
