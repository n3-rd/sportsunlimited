# Google Indexing Guide - Fix "Crawled but Not Indexed"

## Common Reasons & Solutions

### 1. **Submit Sitemap to Google Search Console** ⚠️ CRITICAL
- Go to [Google Search Console](https://search.google.com/search-console)
- Add property: `https://www.sportsunlimited.ng`
- Navigate to **Sitemaps** section
- Submit: `https://www.sportsunlimited.ng/sitemap.xml`
- Also submit: `https://www.sportsunlimited.ng/rss.xml` (optional but helpful)

### 2. **Request Indexing for Key Pages**
- In Google Search Console, use **URL Inspection** tool
- Enter your homepage URL: `https://www.sportsunlimited.ng/`
- Click **Request Indexing**
- Repeat for 5-10 most important article pages

### 3. **Verify Site Ownership**
Add verification meta tag to `app.html` (if using HTML tag method):
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### 4. **Check for Indexing Issues**
Common problems:
- ❌ Too many ads relative to content
- ❌ Thin/duplicate content
- ❌ Slow page load times
- ❌ Mobile usability issues
- ❌ Security/HTTPS issues

### 5. **Improve Content Quality Signals**
✅ Already implemented:
- Unique, descriptive titles
- Meta descriptions
- Structured data (Schema.org)
- Proper heading hierarchy
- Internal linking

### 6. **Build Internal Links**
- Link from homepage to articles
- Link between related articles
- Create topic clusters
- Add breadcrumbs (✅ already done)

### 7. **Content Freshness**
- Publish new content regularly
- Update old articles
- Keep sitemap updated (✅ automatic)

### 8. **Check Robots.txt**
Current status: ✅ Allows all crawlers
- Verify at: `https://www.sportsunlimited.ng/robots.txt`

### 9. **Monitor in Search Console**
- Check **Coverage** report for errors
- Review **Page Experience** metrics
- Monitor **Core Web Vitals**

### 10. **Time Factor**
- New sites can take 1-4 weeks to index
- Be patient but proactive
- Continue publishing quality content

## Immediate Actions

1. ✅ Submit sitemap to Google Search Console
2. ✅ Request indexing for homepage
3. ✅ Request indexing for 5-10 key articles
4. ✅ Verify site ownership
5. ✅ Check for manual actions/penalties
6. ✅ Review content quality
7. ✅ Ensure HTTPS is working
8. ✅ Test mobile usability

## Testing Tools

- **Google Search Console**: https://search.google.com/search-console
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **URL Inspection Tool**: In Search Console

## Next Steps

1. Set up Google Search Console (if not done)
2. Submit sitemap
3. Request indexing for key pages
4. Monitor indexing status weekly
5. Continue publishing quality content


