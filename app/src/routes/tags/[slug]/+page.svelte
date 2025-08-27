<script lang="ts">
	import Card from '../../../components/Card.svelte';
	import { onDestroy } from 'svelte';
	import PostThumbs from '../../../components/PostThumbs.svelte';

	export let data;

	let posts: string | any[];
	posts = data.props.posts; // make posts reactive

	

let displayCount = 8; // Initial number of posts to display

function loadMore() {
	displayCount += 8; // Load 8 more posts each time
}

	onDestroy(() => {
		console.log('destroyed');
		posts = [];
	});
</script>

<svelte:head>
	<title>{data.props.slug} News | Sports Unlimited</title>
	<meta name="description" content="Read the latest {data.props.slug} news and updates on Sports Unlimited. Find all {data.props.slug} related sports stories, analysis and coverage." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/tags/{data.props.slug}" />
	<meta property="og:title" content="{data.props.slug} News | Sports Unlimited" />
	<meta property="og:description" content="Read the latest {data.props.slug} news and updates on Sports Unlimited. Find all {data.props.slug} related sports stories, analysis and coverage." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/tags/{data.props.slug}" />
	<meta name="twitter:title" content="{data.props.slug} News" />
	<meta name="twitter:description" content="Read the latest {data.props.slug} news and updates on Sports Unlimited." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	
	<!-- Additional SEO -->
	<meta name="keywords" content="{data.props.slug}, {data.props.slug} news, Nigerian sports, sports unlimited, {data.props.slug} updates" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/tags/{data.props.slug}" />
</svelte:head>

{#if posts.length === 0}
	<div class="no-tags">
		<h2>
			No post tagged as "{data.props.slug}" found.
		</h2>
	</div>
{:else}
	<h1 class="text-3xl font-bold text-center py-5">
		Tags for "{data.props.slug}"
	</h1>

    <div class="post-thumbs grid grid-cols-1 md:grid-cols-2 ">
<PostThumbs  posts={posts.slice(0, displayCount)}/>
</div>
{#if posts.length > displayCount}
<button on:click={loadMore}>Load More</button>
{/if}
{/if}

<style>
	h2 {
		text-align: center;
		padding: 1rem 0;
	}
	.no-tags {
		height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
