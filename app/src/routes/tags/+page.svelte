<script lang="ts">
	import type { PageData } from "./$types";
	import Button from "$lib/components/ui/button/button.svelte";

	let { data }: { data: PageData } = $props();

	// Get unique tags and sort them
	const uniqueTags = [...new Set(data.tags || [])].sort();
</script>

<svelte:head>
	<title>Browse Sports Categories & Tags | Sports Unlimited - Nigerian Sports News</title>
	<meta name="description" content="Browse all sports categories and tags on Sports Unlimited. Explore Nigerian sports news by topic including Football, NPFL, Basketball, Athletics, Interviews, Features and more." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/tags" />
	<meta property="og:title" content="Browse Sports Categories | Sports Unlimited" />
	<meta property="og:description" content="Browse all sports topics and tags on Sports Unlimited. Find Nigerian sports news by category including Football, NPFL, Basketball, Athletics and more." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/tags" />
	<meta name="twitter:title" content="Browse Sports Categories" />
	<meta name="twitter:description" content="Browse all sports topics and tags on Sports Unlimited. Find Nigerian sports news by category." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	
	<!-- Additional SEO -->
	<meta name="keywords" content="sports tags, sports categories, Nigerian sports topics, NPFL tags, football categories, basketball topics, athletics tags, sports news categories" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/tags" />
</svelte:head>

<main class="tags-page max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
	<header class="text-center mb-12">
		<h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">Browse Sports Categories</h1>
		<p class="text-lg text-gray-600 max-w-2xl mx-auto">
			Explore Nigerian sports news organized by topics and categories. Find articles about Football, NPFL, Basketball, Athletics, and more.
		</p>
	</header>

	{#if uniqueTags && uniqueTags.length > 0}
		<div class="tags-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
			{#each uniqueTags as tag}
				<a 
					href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} 
					class="tag-card group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 hover:shadow-lg transition-all duration-200 text-center"
				>
					<div class="tag-content">
						<h2 class="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
							{tag}
						</h2>
						<p class="text-sm text-gray-500">
							Explore {tag.toLowerCase()} news
						</p>
					</div>
				</a>
			{/each}
		</div>

		<section class="mt-12 bg-gray-50 rounded-xl p-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-4">About Our Categories</h2>
			<p class="text-gray-700 mb-4 leading-relaxed">
				Sports Unlimited covers a wide range of Nigerian sports topics to keep you informed about all aspects of the sports world. Our categories include:
			</p>
			<ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
				<li><strong>Football:</strong> Latest news, match reports, and updates from Nigerian football leagues including NPFL</li>
				<li><strong>Basketball:</strong> Coverage of Nigerian basketball leagues, players, and international competitions</li>
				<li><strong>Athletics:</strong> Track and field events, athletes, and competitions</li>
				<li><strong>Interviews:</strong> Exclusive conversations with athletes, coaches, and sports personalities</li>
				<li><strong>Features:</strong> In-depth stories and analysis of sports events and personalities</li>
				<li><strong>Other Sports:</strong> Coverage of various sports activities in Nigeria</li>
			</ul>
			<p class="text-gray-700 leading-relaxed">
				Browse through our categories to find the sports news that interests you most. Each category contains articles, analysis, and updates related to that specific topic.
			</p>
		</section>
	{:else}
		<div class="text-center py-16">
			<p class="text-gray-600 text-lg mb-4">No categories available at this time.</p>
			<a href="/" class="text-red-600 hover:underline font-medium">Return to Homepage</a>
		</div>
	{/if}
</main>

<style>
	.tags-page {
		min-height: 60vh;
	}
	
	.tag-card {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 120px;
	}
</style>
