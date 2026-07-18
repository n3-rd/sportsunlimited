import { getTags, getTrendingPosts } from '$lib/utils/sanity.server';

export const load = async ({ url, fetch }) => {
	const { pathname } = url;

	// Load trending posts and tags for sidebar
	let trendingPosts: any[] = [];
	let tags: string[] = [];
	let npflTable: any[] = [];
	let npflFixtures: any[] = [];

	let adsConfig = {
		mobileImg: "/ads/ILOT-WIN-A-HOUSE-FOOTBALL-IN-NIG-320X100.jpg",
		desktopImg: "/ads/ILOT-WIN-A-HOUSE-SPORT%20IN%20NIG728X90.jpg",
		mobileImgAlt: "/ads/ILOT-WIN-A-HOUSE-FOOTBALL-IN-NIG-320X100-I.jpg",
		desktopImgAlt: "/ads/ILOT-WIN-A-HOUSE-SPORT%20IN%20NIG-728X90-I.jpg",
		adUrl: "https://www.ilotbet.com/worldcup2026/?c=WCunlimitedbanner",
		bookAdImg: "/book.jpg",
		bookAdUrl: "",
		sidebarAd1Img: "/sidebar/ad1.png",
		sidebarAd1Url: "/ads/ad-1",
		sidebarAd2Img: "/sidebar/ad2.png",
		sidebarAd2Url: "/ads/ad-2",
		rateCardImg: "/sidebar/adrates.png",
		rateCardUrl: "/advertising"
	};

	let settingsConfig = {
		siteName: "Sports Unlimited",
		tagline: "Nigeria's Premier Sports News",
		description: "Nigeria's premier destination for the latest sports news.",
		facebookUrl: "",
		twitterUrl: "",
		instagramUrl: "",
		youtubeUrl: "",
		footerText: "© 2026 Trustymike Communications. All rights reserved."
	};

	try {
		const [trendingPostsResult, tagsResult, tableRes, fixturesRes] = await Promise.allSettled([
			getTrendingPosts(5),
			getTags(),
			fetch('/api/npfl/table'),
			fetch('/api/npfl/matchday/current')
		]);

		if (trendingPostsResult.status === 'fulfilled') {
			trendingPosts = trendingPostsResult.value;
		}

		if (tagsResult.status === 'fulfilled') {
			tags = tagsResult.value;
		}

		// Read ads config directly or fallback
		try {
			const adsRes = await fetch('/api/admin/ads');
			if (adsRes.ok) {
				adsConfig = await adsRes.json();
			}
		} catch(e) {}

		// Read settings config directly or fallback
		try {
			const settingsRes = await fetch('/api/admin/settings');
			if (settingsRes.ok) {
				settingsConfig = await settingsRes.json();
			}
		} catch(e) {}

		if (tableRes.status === 'fulfilled' && tableRes.value.ok) {
			const tableData = await tableRes.value.json();
			if (tableData.ok && tableData.table) {
				npflTable = tableData.table;
			}
		}

		if (fixturesRes.status === 'fulfilled' && fixturesRes.value.ok) {
			const fixturesData = await fixturesRes.value.json();
			if (fixturesData.ok && fixturesData.fixtures) {
				npflFixtures = fixturesData.fixtures;
			}
		}
	} catch (err) {
		console.error('Error in layout load data fetching:', err);
	}

	return {
		pathname,
		featuredPosts: trendingPosts,
		tags,
		npflTable,
		npflFixtures,
		adsConfig,
		settingsConfig
	};
};
