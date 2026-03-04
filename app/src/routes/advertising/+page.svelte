<script lang="ts">
	const ngnRates = [
		{ item: 'Sponsored/Promoted', rate: '100,000' },
		{ item: 'Page Branding (3 days)', rate: '1,600,000' },
		{ item: 'Banner 160x600 (Skyscraper)', rate: '540/CPM' },
		{ item: 'Banner 300x250 (MPU)', rate: '540/CPM' },
		{ item: 'Banner 720x90 (Leaderboard)', rate: '540/CPM' },
		{ item: 'Social: Facebook', rate: '85,000' },
		{ item: 'Social: X & Instagram', rate: '85,000' },
		{ item: 'Pinning a Post', rate: '110,000' },
		{ item: 'Live Coverage (FB/IG)', rate: '800,000' },
		{ item: 'Video Player (Web)', rate: '1,500/CPM' },
		{ item: 'Animated Promotions', rate: '300,000' },
		{ item: 'Product Placement/Affiliated', rate: '400,000' },
		{ item: 'Text Link Ad (Per Week)', rate: '150,000' }
	];

	const usdRates = [
		{ item: 'Sponsored Post', rate: '$250' },
		{ item: 'Link Insertion', rate: '$100' },
		{ item: 'Facebook Post', rate: '$100' },
		{ item: 'Twitter Post', rate: '$100' }
	];

	const usdTenancy = [{ item: 'Tenancy 300x250 Pixels', rate: '$1,000 per week' }];
</script>

<svelte:head>
	<title>Advertising | Sports Unlimited - Online Rate Card</title>
	<meta name="description" content="Sports Unlimited advertising rates. Sponsored posts, banners, social media, video player, and tenancy options. NGN and USD rates available." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.sportsunlimited.ng/advertising" />
	<meta property="og:title" content="Advertising | Sports Unlimited" />
	<meta property="og:description" content="Sports Unlimited advertising rates. NGN and USD rate card for sponsored posts, banners, and more." />
	<meta property="og:image" content="https://i.postimg.cc/CLVXPt7j/SU.png" />
	<meta property="og:site_name" content="Sports Unlimited" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.sportsunlimited.ng/advertising" />
	<meta name="twitter:title" content="Advertising | Sports Unlimited" />
	<meta name="twitter:description" content="Sports Unlimited advertising rates and rate card." />
	<meta name="keywords" content="sports unlimited advertising, ad rates, NGN rates, sports media Nigeria" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://www.sportsunlimited.ng/advertising" />
</svelte:head>

<main class="pt-8">
	<h1 class="text-4xl font-bold text-gray-900 mb-2">Advertising</h1>
	<p class="text-gray-600 mb-8">
		Reach sports fans across Nigeria. Below are our current online advertising rates. For inquiries, <a href="/contact" class="text-red-600 hover:text-red-700 font-medium">contact us</a>.
	</p>

	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-10">
		<table class="w-full min-w-[320px] text-left text-sm">
			<thead>
				<tr class="bg-gray-900 text-white">
					<th scope="col" class="px-4 py-3 font-semibold">Updated Rates (NGN)</th>
					<th scope="col" class="px-4 py-3 font-semibold text-right w-32">Rate</th>
				</tr>
			</thead>
			<tbody>
				{#each ngnRates as row, i}
					<tr class="{i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0">
						<td class="px-4 py-3 text-gray-900">{row.item}</td>
						<td class="px-4 py-3 text-right font-medium text-gray-900">{row.rate}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-10">
		<table class="w-full min-w-[320px] text-left text-sm">
			<thead>
				<tr class="bg-gray-900 text-white">
					<th scope="col" class="px-4 py-3 font-semibold">Rates (USD)</th>
					<th scope="col" class="px-4 py-3 font-semibold text-right w-32">Rate</th>
				</tr>
			</thead>
			<tbody>
				{#each usdRates as row, i}
					<tr class="{i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0">
						<td class="px-4 py-3 text-gray-900">{row.item}</td>
						<td class="px-4 py-3 text-right font-medium text-gray-900">{row.rate}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
		<table class="w-full min-w-[320px] text-left text-sm">
			<thead>
				<tr class="bg-gray-800 text-white">
					<th scope="col" class="px-4 py-3 font-semibold">USD Tenancy</th>
					<th scope="col" class="px-4 py-3 font-semibold text-right w-40">Rate</th>
				</tr>
			</thead>
			<tbody>
				{#each usdTenancy as row}
					<tr class="bg-gray-50 border-b border-gray-200 last:border-b-0">
						<td class="px-4 py-3 text-gray-900">{row.item}</td>
						<td class="px-4 py-3 text-right font-medium text-gray-900">{row.rate}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
