<script lang="ts">
	import PostCard from '../../../components/PostCard.svelte';
	import Button from "$lib/components/ui/button/button.svelte";
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const posts = data.posts || [];
	const tagName = data.tag || '';
	
	let displayCount = $state(12); // Initial number of posts to display

	function loadMore() {
		displayCount += 12; // Load 12 more posts each time
	}
</script>

<svelte:head>
	<title>{tagName} News & Updates | Sports Unlimited - Nigerian Sports</title>
	<meta name="description" content="Read the latest {tagName} news, updates, and stories on Sports Unlimited. Comprehensive coverage of {tagName} in Nigerian sports including match reports, analysis, interviews and more." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/tags/{data.slug}" />
	<meta property="og:title" content="{tagName} News | Sports Unlimited" />
	<meta property="og:description" content="Read the latest {tagName} news and updates on Sports Unlimited. Find all {tagName} related sports stories, analysis and coverage." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/tags/{data.slug}" />
	<meta name="twitter:title" content="{tagName} News" />
	<meta name="twitter:description" content="Read the latest {tagName} news and updates on Sports Unlimited." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	
	<!-- Additional SEO -->
	<meta name="keywords" content="{tagName}, {tagName} news, Nigerian sports, sports unlimited, {tagName} updates, {tagName} articles" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/tags/{data.slug}" />
</svelte:head>

<main class="tag-page max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
	{#if posts.length === 0}
		<div class="no-posts text-center py-16">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">No Articles Found</h1>
			<p class="text-gray-600 mb-6">
				No articles tagged as "{tagName}" were found at this time.
			</p>
			<a href="/tags" class="text-red-600 hover:underline font-medium">Browse All Categories</a>
		</div>
	{:else}
		<header class="mb-8">
			<nav class="text-sm text-gray-600 mb-4">
				<a href="/" class="hover:text-gray-900">Home</a>
				<span class="mx-2">/</span>
				<a href="/tags" class="hover:text-gray-900">Categories</a>
				<span class="mx-2">/</span>
				<span class="text-gray-900">{tagName}</span>
			</nav>
			<h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
				{tagName} News & Updates
			</h1>
			<p class="text-lg text-gray-600">
				Stay updated with the latest {tagName.toLowerCase()} news, stories, and analysis from Nigerian sports.
			</p>
			<div class="mt-4">
				<span class="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
					{posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
				</span>
			</div>
		</header>

		<div class="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
			{#each posts.slice(0, displayCount) as post}
				<PostCard post={post} size="small" />
			{/each}
		</div>

		{#if posts.length > displayCount}
			<div class="flex justify-center mt-8">
				<Button onclick={loadMore} class="px-10 py-4 text-base font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-lg">
					Load More Articles
				</Button>
			</div>
		{/if}

		<section class="mt-12 bg-gray-50 rounded-xl p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">About {tagName} Coverage</h2>
			<p class="text-gray-700 leading-relaxed">
				Sports Unlimited provides comprehensive coverage of {tagName.toLowerCase()} in Nigerian sports. Our team of experienced sports journalists brings you the latest news, match reports, player updates, interviews, and in-depth analysis. Stay informed about all developments in {tagName.toLowerCase()} with our timely and accurate reporting.
			</p>
		</section>
	{/if}
</main>

<style>
	.tag-page {
		min-height: 60vh;
	}
	
	.no-posts {
		min-height: 50vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
