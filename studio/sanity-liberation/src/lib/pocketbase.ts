import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { browser } from '$app/environment';

// For server-side, use the full URL. For client-side, use the public URL
const pbUrl = browser 
	? PUBLIC_POCKETBASE_URL
	: PUBLIC_POCKETBASE_URL;

export const pb = new PocketBase(pbUrl);
