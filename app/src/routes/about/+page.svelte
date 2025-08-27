<script>
	let blogName = 'Sports Unlimited';
	let authorName = 'Michael Jemegah';
</script>

<svelte:head>
	<title>About Sports Unlimited | Nigerian Sports News Website</title>
	<meta name="description" content="Learn about Sports Unlimited, Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics and more. Meet our team and mission." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/about" />
	<meta property="og:title" content="About Sports Unlimited | Nigerian Sports News Website" />
	<meta property="og:description" content="Learn about Sports Unlimited, Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics and more. Meet our team and mission." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	
	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/about" />
	<meta name="twitter:title" content="About Sports Unlimited" />
	<meta name="twitter:description" content="Learn about Sports Unlimited, Nigeria's premier sports news website covering NPFL, Football, Basketball, Athletics and more." />
	<meta name="twitter:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	
	<!-- Additional SEO -->
	<meta name="keywords" content="about sports unlimited, Nigerian sports news, sports blogger, Michael Jemegah, NPFL coverage" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/about" />
</svelte:head>

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
