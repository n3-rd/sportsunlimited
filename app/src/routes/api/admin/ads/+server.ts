import { json } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'ads.json');

export async function GET() {
	const defaultAds = {
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

	try {
		const data = await fs.readFile(DATA_PATH, 'utf-8');
		const parsed = JSON.parse(data);
		return json({ ...defaultAds, ...parsed });
	} catch (e) {
		// Return defaults if file doesn't exist or is invalid
		return json(defaultAds);
	}
}

export async function PUT({ request }) {
	try {
		const body = await request.json();
		// Ensure directory exists
		await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
		await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2));
		return json({ success: true });
	} catch (e) {
		return json({ error: 'Failed to save ads config' }, { status: 500 });
	}
}
