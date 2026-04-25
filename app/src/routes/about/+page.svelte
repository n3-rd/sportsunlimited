<script>
	import SEO from '../../components/SEO.svelte';
	import { generateBreadcrumbStructuredData } from '$lib/utils/seo';

	let blogName = 'Sports Unlimited';
	let authorName = 'Michael Jemegah';

	const seoData = {
		title: 'About Sports Unlimited | Nigerian Sports News Website',
		description: "Learn about Sports Unlimited, Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics and more. Meet our team and mission.",
		keywords: 'about sports unlimited, Nigerian sports news, sports blogger, Michael Jemegah, NPFL coverage',
	};

	const breadcrumbSchema = generateBreadcrumbStructuredData([
		{ name: 'Home', url: '/' },
		{ name: 'About', url: '/about' }
	]);
</script>

<SEO {...seoData} schemaorg={[breadcrumbSchema]} />


<main class="pt-8">
	<h1 class="text-5xl font-bold pb-6">About {blogName}</h1>
	<p>
		{blogName} is a blog dedicated to all things sports. From the latest news and updates in the world
		of sports to in-depth analysis and commentary, we've got you covered.
	</p>
	<h2 class="text-3xl font-semibold py-4">About the Author</h2>
	<p>
		{authorName} is a creative sports content writer, blogger and sports lover. His passion for sports and writing is the inspiration to create content. He also holds a degree in mathematics from University of Ilorin, Ilorin, Kwara State.	</p>
</main>

<style>
	main {
		font-family: Arial, sans-serif;
		margin: 0 auto;
		max-width: 800px;
		padding: 1em;
	}

	h1,
	h2 {
		color: #333;
	}

	p {
		line-height: 1.6;
		color: #666;
	}
</style>
