import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const { id } = params;
    
    // Import all markdown files in the ads directory
    // This works better for both dev and production (Vercel)
    const ads = import.meta.glob('$lib/ads/*.md', { query: '?raw', eager: true });
    
    const adPath = `/src/lib/ads/${id}.md`;
    const ad = ads[adPath];

    if (!ad) {
        throw error(404, 'Ad not found');
    }

    return {
        content: (ad as any).default || ad,
        id
    };
};
