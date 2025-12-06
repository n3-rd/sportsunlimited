import PocketBase from 'pocketbase';

// Initialize PocketBase client
// Replace with your actual PocketBase URL
const pb = new PocketBase('http://127.0.0.1:8090');

export interface Post {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    keywords: string[]; // Parsed from JSON
    mainImage: string; // URL or filename
    body: string; // HTML
}

// Helper to map PocketBase record to Post interface
function mapRecordToPost(record: any): Post {
    return {
        ...record,
        keywords: record.keywords ? (typeof record.keywords === 'string' ? JSON.parse(record.keywords) : record.keywords) : [],
        mainImage: record.mainImage ? pb.files.getUrl(record, record.mainImage) : '',
    };
}

export async function getPosts(): Promise<Post[]> {
    const records = await pb.collection('posts').getFullList({
        sort: '-created',
    });
    return records.map(mapRecordToPost);
}

export async function getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    const records = await pb.collection('posts').getList(1, limit, {
        sort: '-created',
    });
    return records.items.map(mapRecordToPost);
}

export async function getRelatedPosts(currentSlug: string, title: string, excerpt: string, limit: number = 4): Promise<Post[]> {
    // PocketBase doesn't have advanced full-text search relevance scoring like Sanity/Groq in the same way.
    // We can try to match tags or title words.
    // For now, we'll fetch recent posts excluding the current one.
    // A better approach would be to filter by tags if available.

    const records = await pb.collection('posts').getList(1, limit, {
        filter: `slug != "${currentSlug}"`,
        sort: '-created',
    });
    return records.items.map(mapRecordToPost);
}

export async function getPostsByTag(tag: string, limit: number = 6): Promise<Post[]> {
    // PocketBase 'select' field (multiple) can be filtered using ~
    const records = await pb.collection('posts').getList(1, limit, {
        filter: `tags ~ "${tag}"`,
        sort: '-created',
    });
    return records.items.map(mapRecordToPost);
}

export async function getTrendingPosts(limit: number = 5): Promise<Post[]> {
    // "Trending" usually implies views or recent activity. 
    // Without a views counter, we'll return latest posts.
    return getFeaturedPosts(limit);
}

export async function getTags(): Promise<string[]> {
    // Return the static list from schema, or fetch unique tags.
    // Since we defined specific values in schema:
    return [
        "Football", "Athletics", "Basketball", "Nigeria League",
        "Lifestyle", "Oddities", "Other Sports", "Interview", "Feature"
    ];
}

export async function getTaggedPosts(tag: string): Promise<Post[]> {
    const records = await pb.collection('posts').getFullList({
        filter: `tags ~ "${tag}"`,
        sort: '-created',
    });
    return records.map(mapRecordToPost);
}

export async function getPost(slug: string): Promise<Post | null> {
    try {
        const record = await pb.collection('posts').getFirstListItem(`slug="${slug}"`);
        return mapRecordToPost(record);
    } catch (e) {
        return null;
    }
}

export async function searchPosts(query: string): Promise<Post[]> {
    const records = await pb.collection('posts').getFullList({
        filter: `title ~ "${query}" || excerpt ~ "${query}"`, // Body search might be slow if not indexed or too large
        sort: '-created',
    });
    return records.map(mapRecordToPost);
}
