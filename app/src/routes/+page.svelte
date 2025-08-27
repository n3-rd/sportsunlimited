<script lang="ts">
	import Card from '../components/Card.svelte';
	import Posts from '../components/Posts.svelte';
	import Tags from '../components/Tags.svelte';
	import Welcome from '../components/Welcome.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	console.log(data);
</script>

<svelte:head>
	<title>Sports Unlimited - Latest Nigerian Sports News | NPFL, Football & More</title>
	<meta
		name="description"
		content="Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria."
	/>
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/" />
	<meta property="og:title" content="Sports Unlimited - Latest Nigerian Sports News | NPFL, Football & More" />
	<meta property="og:description" content="Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria." />
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
	<meta name="twitter:description" content="Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more. Your premier destination for sports updates, interviews, and analysis in Nigeria." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta name="twitter:image:alt" content="Sports Unlimited - Nigerian Sports News" />
	
	<!-- Additional SEO meta tags -->
	<meta name="keywords" content="Nigerian sports news, NPFL, football Nigeria, basketball Nigeria, athletics Nigeria, sports unlimited, Nigeria league, sports interviews, African sports, Nigerian Premier League" />
	<meta name="author" content="Michael Jemegah" />
	<meta name="publisher" content="Sports Unlimited" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow" />
	<meta name="language" content="English" />
	<meta name="geo.region" content="NG" />
	<meta name="geo.country" content="Nigeria" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.sportsunlimited.ng/" />
	
	<!-- Structured Data for Organization -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Sports Unlimited",
		"url": "https://www.sportsunlimited.ng",
		"logo": "https://i.postimg.cc/CLVXPt7j/SU.png",
		"description": "Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics and more.",
		"address": {
			"@type": "PostalAddress",
			"addressCountry": "Nigeria"
		},
		"sameAs": []
	}
	</script>
	
	<!-- Structured Data for Website -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Sports Unlimited",
		"url": "https://www.sportsunlimited.ng",
		"description": "Get the latest Nigerian sports news on Football, NPFL, Basketball, Athletics, and more.",
		"publisher": {
			"@type": "Organization",
			"name": "Sports Unlimited"
		},
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://www.sportsunlimited.ng/search?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	}
	</script>
</svelte:head>

<section>
	
		<Tags tags={data.tags} />
<Posts posts={data.posts} />
</section>
