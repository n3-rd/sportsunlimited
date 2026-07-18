import { json } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
	const defaultSettings = {
		siteName: "Sports Unlimited",
		tagline: "Nigeria's Premier Sports News",
		description: "Nigeria's premier destination for the latest sports news, interviews, and analysis covering NPFL, Football, Basketball, Athletics, and more.",
		facebookUrl: "https://facebook.com",
		twitterUrl: "https://twitter.com",
		instagramUrl: "https://instagram.com",
		youtubeUrl: "https://youtube.com",
		footerText: "© 2026 Trustymike Communications. All rights reserved."
	};

	try {
		const data = await fs.readFile(DATA_PATH, 'utf-8');
		const parsed = JSON.parse(data);
		return json({ ...defaultSettings, ...parsed });
	} catch (e) {
		return json(defaultSettings);
	}
}

export async function PUT({ request }) {
	try {
		const body = await request.json();
		await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
		await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2));
		return json({ success: true });
	} catch (e) {
		return json({ error: 'Failed to save settings' }, { status: 500 });
	}
}
