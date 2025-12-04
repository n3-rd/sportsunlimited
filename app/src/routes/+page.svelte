<script lang="ts">
	import Posts from '../components/Posts.svelte';
	import Tags from '../components/Tags.svelte';
	import { generateOrganizationStructuredData, generateWebsiteStructuredData } from '$lib/utils/seo';
	import { urlFor } from '$lib/utils/image';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Sports Unlimited - Latest Nigerian Sports News | NPFL, Football & More</title>
	<meta
		name="description"
		content="Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria. Breaking news, match reports, player interviews, and in-depth analysis."
	/>
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/" />
	<meta property="og:title" content="Sports Unlimited - Latest Nigerian Sports News | NPFL, Football & More" />
	<meta property="og:description" content="Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria. Breaking news, match reports, player interviews, and in-depth analysis." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Sports Unlimited - Nigerian Sports News" />
	<meta property="og:site_name" content="Sports Unlimited" />
	<meta property="og:locale" content="en_NG" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/" />
	<meta name="twitter:title" content="Sports Unlimited - Latest Nigerian Sports News" />
	<meta name="twitter:description" content="Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria. Breaking news, match reports, player interviews, and in-depth analysis." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta name="twitter:image:alt" content="Sports Unlimited - Nigerian Sports News" />
	
	<!-- Additional SEO meta tags -->
	<meta name="keywords" content="Nigerian sports news, NPFL, football Nigeria, basketball Nigeria, athletics Nigeria, sports unlimited, Nigeria league, sports interviews, African sports, Nigerian Premier League, Super Eagles, Nigerian football, sports analysis, match reports, player news, sports features" />
	<meta name="author" content="Michael Jemegah" />
	<meta name="publisher" content="Sports Unlimited" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="geo.region" content="NG" />
	<meta name="geo.country" content="Nigeria" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.sportsunlimited.ng/" />
	
	<!-- Sitemap and RSS -->
	<link rel="sitemap" type="application/xml" href="https://www.sportsunlimited.ng/sitemap.xml" />
	<link rel="alternate" type="application/rss+xml" title="Sports Unlimited RSS Feed" href="https://www.sportsunlimited.ng/rss.xml" />
	
	<!-- Additional SEO -->
	<meta name="news_keywords" content="Nigerian sports, NPFL, football, basketball, athletics, Super Eagles, sports news Nigeria" />
	<meta name="article:publisher" content="https://www.sportsunlimited.ng" />
	<meta name="application-name" content="Sports Unlimited" />
	<meta name="apple-mobile-web-app-title" content="Sports Unlimited" />
	<meta name="theme-color" content="#ef4444" />
	
	<!-- Google Search Console Verification (Add your verification code) -->
	<!-- <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> -->
	
	<!-- Structured Data for Organization -->
	{@html generateOrganizationStructuredData()}
	
	<!-- Structured Data for Website -->
	{@html generateWebsiteStructuredData()}
	
	<!-- Structured Data for CollectionPage -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": "Sports Unlimited - Latest Nigerian Sports News",
		"description": "Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more.",
		"url": "https://www.sportsunlimited.ng",
		"mainEntity": {
			"@type": "ItemList",
			"numberOfItems": ${data.posts?.length || 0},
			"itemListElement": [
				${data.posts?.slice(0, 10).map((post, index) => `{
					"@type": "ListItem",
					"position": ${index + 1},
					"item": {
						"@type": "NewsArticle",
						"headline": ${JSON.stringify(post.title || '')},
						"url": "https://www.sportsunlimited.ng/post/${post.slug?.current || ''}",
						"datePublished": "${post._createdAt || ''}",
						"image": "${post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : 'https://i.postimg.cc/CLVXPt7j/SU.png'}"
					}
				}`).join(',') || ''}
			]
		}
	}
	</script>`}
	
	<!-- Structured Data for Featured Article -->
	{#if data.posts && data.posts[0]}
		{@html `<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "NewsArticle",
			"headline": ${JSON.stringify(data.posts[0].title || '')},
			"description": ${JSON.stringify(data.posts[0].excerpt || data.posts[0].title || '')},
			"image": "${data.posts[0].mainImage ? urlFor(data.posts[0].mainImage).width(1200).height(630).url() : 'https://i.postimg.cc/CLVXPt7j/SU.png'}",
			"datePublished": "${data.posts[0]._createdAt || ''}",
			"dateModified": "${data.posts[0]._createdAt || ''}",
			"author": {
				"@type": "Organization",
				"name": "Sports Unlimited"
			},
			"publisher": {
				"@type": "Organization",
				"name": "Sports Unlimited",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.postimg.cc/CLVXPt7j/SU.png"
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://www.sportsunlimited.ng/post/${data.posts[0].slug?.current || ''}"
			}
		}
		</script>`}
	{/if}

	<!-- desktop in-feed ads -->
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3810788597906222"
	crossorigin="anonymous"></script>
<ins class="adsbygoogle"
	style="display:block"
	data-ad-format="fluid"
	data-ad-layout-key="+30+qn-3c-6z+rp"
	data-ad-client="ca-pub-3810788597906222"
	data-ad-slot="7096496582"></ins>
<script>
	(adsbygoogle = window.adsbygoogle || []).push({});
</script>

<!-- mobile in-feed ads -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3810788597906222"
crossorigin="anonymous"></script>
<ins class="adsbygoogle"
style="display:block"
data-ad-format="fluid"
data-ad-layout-key="-6t+ed+2i-1n-4w"
data-ad-client="ca-pub-3810788597906222"
data-ad-slot="9074248071"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
</svelte:head>

<main class="homepage-wrapper" itemscope itemtype="https://schema.org/CollectionPage">
	<!-- Main H1 for SEO -->
	<h1 class="sr-only">Sports Unlimited - Latest Nigerian Sports News</h1>
	
	<!-- Category Navigation - Sticky Top -->
	{#if data.tags && data.tags.length > 0}
		<nav class="category-nav top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-12 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-5" aria-label="Category navigation">
			<div class="max-w-7xl mx-auto">
				<Tags tags={data.tags} />
			</div>
		</nav>
	{/if}

	<!-- Main Content -->
	<Posts posts={data.posts} featuredPosts={data.featuredPosts} categoryPosts={data.categoryPosts} />
</main>
