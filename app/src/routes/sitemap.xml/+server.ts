import { getPosts, getTags } from "$lib/utils/sanity.server";

export const prerender = false;

const site = 'https://www.sportsunlimited.ng';

function staticSitemapXml(lastmodDate: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${site}</loc><lastmod>${lastmodDate}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
<url><loc>${site}/about</loc><lastmod>${lastmodDate}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>${site}/contact</loc><lastmod>${lastmodDate}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>${site}/privacy</loc><lastmod>${lastmodDate}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
<url><loc>${site}/terms</loc><lastmod>${lastmodDate}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
<url><loc>${site}/disclaimer</loc><lastmod>${lastmodDate}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
<url><loc>${site}/tags</loc><lastmod>${lastmodDate}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
</urlset>`;
}

export async function GET({ setHeaders })  {
    setHeaders({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
    });

    const lastmodDate = new Date().toISOString().split('T')[0];
    const toLastmod = (value: string | undefined): string => {
        if (!value) return lastmodDate;
        const d = new Date(value);
        return isNaN(d.getTime()) ? lastmodDate : d.toISOString().split('T')[0];
    };

    let posts: Awaited<ReturnType<typeof getPosts>> = null;
    let tags: Awaited<ReturnType<typeof getTags>> = [];
    try {
        [posts, tags] = await Promise.all([getPosts(), getTags()]);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return new Response(staticSitemapXml(lastmodDate), {
            headers: { 'Content-Type': 'application/xml' }
        });
    }

    if (!posts || !Array.isArray(posts)) {
        return new Response(staticSitemapXml(lastmodDate), {
            headers: { 'Content-Type': 'application/xml' }
        });
    }

    try {
        const uniqueTags = [...new Set(Array.isArray(tags) ? tags : [])];
        const postsWithSlug = posts.filter((p) => !!p.slug?.current);

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<!-- Homepage -->
<url>
    <loc>${site}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
</url>

<!-- Static Pages -->
<url>
    <loc>${site}/about</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
<url>
    <loc>${site}/contact</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
<url>
    <loc>${site}/privacy</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
</url>
<url>
    <loc>${site}/terms</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
</url>
<url>
    <loc>${site}/disclaimer</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
</url>

<!-- Tags Index -->
<url>
    <loc>${site}/tags</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
</url>

<!-- Individual Tag Pages -->
${uniqueTags.map(tag => `<url>
    <loc>${site}/tags/${encodeURIComponent(tag)}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
</url>`).join('\n')}

<!-- Blog Posts -->
${postsWithSlug.map(post => {
    const lastmod = toLastmod(post._updatedAt ?? post._createdAt);
    const isRecent = new Date(post._createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Escape XML entities and backtick (so template literal isn't broken by content)
    const escapeXml = (str: string | undefined) => {
        if (str == null || str === '') return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/`/g, '&#96;');
    };
    
    return `<url>
    <loc>${site}/post/${encodeURIComponent(post.slug.current)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${isRecent ? 'daily' : 'weekly'}</changefreq>
    <priority>${isRecent ? '0.9' : '0.8'}</priority>
    ${post.mainImage && post.mainImage.asset && post.mainImage.asset.url ? `<image:image>
        <image:loc>${escapeXml(post.mainImage.asset.url)}</image:loc>
        <image:title>${escapeXml(post.title)}</image:title>
        <image:caption>${escapeXml(post.excerpt || post.title)}</image:caption>
    </image:image>` : ''}
</url>`;
}).join('\n')}
</urlset>`;

        return new Response(sitemap);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return new Response(staticSitemapXml(lastmodDate), {
            headers: { 'Content-Type': 'application/xml' }
        });
    }
}
