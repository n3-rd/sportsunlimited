import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { browser } from '$app/environment';

// Default PocketBase URL (local development)
const DEFAULT_PB_URL = 'http://127.0.0.1:8099';

// For server-side, use the full URL. For client-side, use the public URL
const pbUrl = PUBLIC_POCKETBASE_URL || DEFAULT_PB_URL;

export const pb = new PocketBase(pbUrl);

// Disable auto-cancellation for server-side requests
if (!browser) {
	pb.autoCancellation(false);
}
