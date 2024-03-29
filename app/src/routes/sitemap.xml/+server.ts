import { getPosts } from "$lib/utils/sanity";

export async function GET({ setHeaders })  {
    setHeaders({
    'Content-Type': 'application/xml'
    });

    const site  =  'https://www.sportsunlimited.ng';
const response  =  await  getPosts();
const posts =  response;
console.log("posts",response);
if(!response){
    return new Response("Not found", {
        status: 404,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${site}</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/about</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/contact</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/tags</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/tags/Football</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/tags/Basketball</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/tags/Nigeria League</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/tags/Interview</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
<url>
<loc>${site}/tags/Other Sports</loc>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
${posts.map(post  =>  `
<url>
<loc>${site}/post/${post.slug.current}</loc>
<changefreq>daily</changefreq>
<lastmod>${post._createdAt.split('T')[0]}</lastmod>
</url>
`).join('')}
</urlset>`;
return new Response(sitemap);
}
