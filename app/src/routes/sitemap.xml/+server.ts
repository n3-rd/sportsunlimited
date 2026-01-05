import { getPosts, getTags } from "$lib/utils/sanity.server";

export async function GET({ setHeaders })  {
    setHeaders({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
    });

    const site = 'https://www.sportsunlimited.ng';
    
    try {
        const [posts, tags] = await Promise.all([
            getPosts(),
            getTags()
        ]);

        if (!posts) {
            return new Response("Not found", {
                status: 404,
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
        }

        const now = new Date().toISOString();
        const uniqueTags = [...new Set(tags)];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<!-- Homepage -->
<url>
    <loc>${site}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
</url>

<!-- Static Pages -->
<url>
    <loc>${site}/about</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
<url>
    <loc>${site}/contact</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
</url>
<url>
    <loc>${site}/privacy</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
</url>
<url>
    <loc>${site}/terms</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
</url>
<url>
    <loc>${site}/disclaimer</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
</url>

<!-- Tags Index -->
<url>
    <loc>${site}/tags</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
</url>

<!-- Individual Tag Pages -->
${uniqueTags.map(tag => `<url>
    <loc>${site}/tags/${encodeURIComponent(tag)}</loc>
    <lastmod>${now.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
</url>`).join('\n')}

<!-- Blog Posts -->
${posts.map(post => {
    const lastmod = (post._updatedAt || post._createdAt).split('T')[0];
    const isRecent = new Date(post._createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Escape XML entities
    const escapeXml = (str) => {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;');
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
        return new Response("Internal Server Error", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}
