import type { PortableTextBlock } from '@portabletext/types';

export interface Post {
    _type: 'post';
    _createdAt: string;
    _updatedAt?: string;
    title?: string;
    slug: { current: string };
    excerpt?: string;
    mainImage?: {
        asset: {
            url: string;
        };
        mainImageUrl?: string; // For compatibility
    };
    tags?: string[];
    keywords?: string[];
    body: PortableTextBlock[];
}

export interface PocketBasePost {
    id: string;
    collectionId?: string;
    collectionName?: string;
    created: string;
    updated?: string;
    title?: string;
    slug: string;
    excerpt?: string;
    mainImage?: string;
    tags?: string[];
    keywords?: string[] | string; // array from API or JSON string
    body?: string; // JSON string
    status?: string;
}

export interface PocketBaseListResponse {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: PocketBasePost[];
}
