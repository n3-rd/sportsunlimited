<script lang="ts">
	import Posts from '../components/Posts.svelte';
	import Tags from '../components/Tags.svelte';
	import SEO from '../components/SEO.svelte';
	import {
		generateOrganizationStructuredData,
		generateWebsiteStructuredData,
		generateCollectionPageStructuredData
	} from '$lib/utils/seo';
	import { urlFor } from '$lib/utils/image';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const seoData = {
		title: 'Sports Unlimited - Latest Nigerian Sports News | NPFL, Football & More',
		description: 'Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria.',
		keywords: 'Nigerian sports news, NPFL, football Nigeria, basketball Nigeria, athletics Nigeria, sports unlimited, Nigeria league, sports interviews, African sports, Super Eagles, sports analysis',
		image: 'https://i.postimg.cc/CLVXPt7j/SU.png'
	};

	const organizationSchema = generateOrganizationStructuredData();
	const websiteSchema = generateWebsiteStructuredData();
	const collectionSchema = generateCollectionPageStructuredData({
		name: seoData.title,
		description: seoData.description,
		url: 'https://www.sportsunlimited.ng',
		posts: data.posts?.slice(0, 10).map(post => ({
			title: post.title,
			slug: post.slug,
			_createdAt: post._createdAt,
			mainImage: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : 'https://i.postimg.cc/CLVXPt7j/SU.png'
		})) || []
	});

	const schemas = [organizationSchema, websiteSchema, collectionSchema];
</script>

<SEO 
	{...seoData}
	schemaorg={schemas}
/>

<svelte:head>
	<!-- Sitemap and RSS -->
	<link rel="sitemap" type="application/xml" href="https://www.sportsunlimited.ng/sitemap.xml" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Sports Unlimited RSS Feed"
		href="https://www.sportsunlimited.ng/rss.xml"
	/>
	<meta
		name="news_keywords"
		content="Nigerian sports, NPFL, football, basketball, athletics, Super Eagles, sports news Nigeria"
	/>
</svelte:head>

<main class="homepage-wrapper" itemscope itemtype="https://schema.org/CollectionPage">
	<!-- Main H1 for SEO -->
	<h1 class="sr-only">Sports Unlimited - Latest Nigerian Sports News</h1>

	<!-- Ad placement - Top of page -->
	<div class="ad-container my-4 flex justify-center overflow-hidden min-h-[90px]">
		<ins
			class="adsbygoogle"
			style="display:block"
			data-ad-format="fluid"
			data-ad-layout-key="+30+qn-3c-6z+rp"
			data-ad-client="ca-pub-3810788597906222"
			data-ad-slot="7096496582"
		></ins>
		<script>
			(adsbygoogle = window.adsbygoogle || []).push({});
		</script>
	</div>

	<!-- Category Navigation - Sticky Top -->
	{#if data.tags && data.tags.length > 0}
		<nav
			class="category-nav top-16 z-40 -mx-4 mb-12 border-b border-gray-200 bg-white/95 px-4 py-5 shadow-sm backdrop-blur-sm md:-mx-6 md:px-6 lg:-mx-8 lg:px-8"
			aria-label="Category navigation"
		>
			<div class="mx-auto max-w-7xl">
				<Tags tags={data.tags} />
			</div>
		</nav>
	{/if}

	<!-- Main Content -->
	<Posts posts={data.posts} featuredPosts={data.featuredPosts} categoryPosts={data.categoryPosts} />
</main>
