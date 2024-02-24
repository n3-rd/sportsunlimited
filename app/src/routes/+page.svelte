<script lang="ts">
	import Card from '../components/Card.svelte';
	import Welcome from '../components/Welcome.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<svelte:head>
	<title>Sports Unlimited || Get updated sports news on NPFL and more</title>
	<meta
		name="description"
		content="Get updated sports news on  Football, Athletics, Basketball, Nigeria League, NPFL, Lifestyle, Oddities, Other Sports, npfl and Interviews"
	/>
	<meta property="og:title" content="Sports Unlimited" />
	<meta
		property="og:description"
		content="Get updated sports news on  Football, Athletics, Basketball, Nigeria League, Lifestyle, Oddities, Other Sports, npfl and Interviews"
	/>

	<meta property="og:url" content={`https://www.sportsunlimited.ng`} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Sports Unlimited" />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Sports Unlimited " />
	<meta
		name="twitter:description"
		content="Get updated sports news on  Football, Athletics, Basketball, Nigeria League, Lifestyle, Oddities, Other Sports, npfl and Interviews"
	/>
	<meta name="twitter:url" content={`https://www.sportsunlimited.ng/post`} />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<!-- add other meta tags -->
	<meta
		name="keywords"
		content="Football, Athletics, Basketball, Nigeria League, Lifestyle, Oddities, Other Sports, Interviews, npfl, sports unlimited, sportsunlimited, league, nigeria"
	/>
	<meta name="author" content="Emmanuel Jemegah" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/post" />
</svelte:head>

<section>
	{#if data.tags?.length}
		<p class="post__tags">
			{#each data.tags as tag}
				<h2>
					<a href={`/tags/${tag}`} class="post__tag">{tag}</a>
				</h2>
			{/each}
		</p>
	{/if}

	{#if data.posts?.length}
		{#each data.posts as post}
			<Card {post} />
		{/each}
	{:else}
		<Welcome />
	{/if}
</section>
