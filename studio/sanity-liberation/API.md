# Posts API Documentation

This document describes how to use the Posts API to fetch, list, and search posts from the Sanity Liberation Studio.

## Base URL

The API base URL depends on your deployment. For local development:
```
http://localhost:5173/api
```

For production, replace with your deployed domain:
```
https://your-domain.com/api
```

## Authentication

Currently, the API endpoints for reading posts do not require authentication. All endpoints return JSON responses.

---

## Endpoints

### 1. List All Posts

Get a paginated list of all posts.

**Endpoint:** `GET /api/posts`

**Query Parameters:**
- `page` (optional, default: `1`) - Page number
- `perPage` (optional, default: `50`) - Number of posts per page
- `sort` (optional, default: `-created`) - Sort order (use `-created` for newest first, `created` for oldest first)
- `slug` (optional) - Filter by exact slug match

**Example Request:**
```bash
# Get first page of posts (newest first)
GET /api/posts

# Get second page with 20 posts per page
GET /api/posts?page=2&perPage=20

# Search by slug
GET /api/posts?slug=my-post-slug

# Get oldest posts first
GET /api/posts?sort=created
```

**Example Response:**
```json
{
  "page": 1,
  "perPage": 50,
  "totalItems": 100,
  "totalPages": 2,
  "items": [
    {
      "id": "abc123def456",
      "collectionId": "pbc_posts_collection",
      "collectionName": "posts",
      "created": "2025-01-15T10:30:00.000Z",
      "updated": "2025-01-15T10:30:00.000Z",
      "title": "My Post Title",
      "slug": "my-post-title",
      "excerpt": "A brief description of the post",
      "tags": ["Football", "Feature"],
      "keywords": ["sports", "football"],
      "mainImage": "image_filename.jpg",
      "mainImageUrl": "http://localhost:5173/api/files/posts/abc123def456/image_filename.jpg",
      "body": "[{\"_key\":\"ba4b8e778229\",\"_type\":\"block\",\"children\":[...]}]",
      "status": "Published"
    }
  ]
}
```

---

### 2. Get Single Post by ID

Get a specific post by its ID.

**Endpoint:** `GET /api/posts/{id}`

**Path Parameters:**
- `id` (required) - The post ID

**Example Request:**
```bash
GET /api/posts/abc123def456
```

**Example Response:**
```json
{
  "id": "abc123def456",
  "collectionId": "pbc_posts_collection",
  "collectionName": "posts",
  "created": "2025-01-15T10:30:00.000Z",
  "updated": "2025-01-15T10:30:00.000Z",
  "title": "My Post Title",
  "slug": "my-post-title",
  "excerpt": "A brief description of the post",
  "tags": ["Football", "Feature"],
  "keywords": ["sports", "football"],
  "mainImage": "image_filename.jpg",
  "mainImageUrl": "http://localhost:5173/api/files/posts/abc123def456/image_filename.jpg",
  "body": "[{\"_key\":\"ba4b8e778229\",\"_type\":\"block\",\"children\":[...]}]",
  "status": "Published"
}
```

---

### 3. Get Latest Posts

Get the most recent posts, limited by count.

**Endpoint:** `GET /api/posts/latest`

**Query Parameters:**
- `limit` (optional, default: `1`) - Number of posts to return (1-50)

**Example Request:**
```bash
# Get the latest post
GET /api/posts/latest

# Get the latest 10 posts
GET /api/posts/latest?limit=10
```

**Example Response:**
```json
[
  {
    "id": "abc123def456",
    "title": "Latest Post",
    "slug": "latest-post",
    "excerpt": "This is the most recent post",
    "tags": ["Football"],
    "keywords": ["sports"],
    "mainImage": "image.jpg",
    "mainImageUrl": "http://localhost:5173/api/files/posts/abc123def456/image.jpg",
    "body": "[{\"_key\":\"ba4b8e778229\",\"_type\":\"block\",\"children\":[...]}]",
    "created": "2025-01-15T10:30:00.000Z",
    "updated": "2025-01-15T10:30:00.000Z"
  }
]
```

---

## Post Data Structure

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique post identifier |
| `title` | string | Post title |
| `slug` | string | URL-friendly post identifier (unique) |
| `excerpt` | string | Brief description/summary |
| `tags` | string[] | Array of tags (e.g., "Football", "Feature", "Interview") |
| `keywords` | string[] | Array of keywords for SEO/search |
| `body` | string | Post content in Sanity block format (JSON string) |
| `mainImage` | string | Image filename |
| `mainImageUrl` | string | Full URL to the post image (automatically included) |
| `status` | string | Post status (e.g., "Published") |
| `created` | string | ISO 8601 timestamp of creation |
| `updated` | string | ISO 8601 timestamp of last update |

### Available Tags

The following tags are available:
- `Football`
- `Athletics`
- `Basketball`
- `Nigeria League`
- `Lifestyle`
- `Oddities`
- `Other Sports`
- `Interview`
- `Feature`

### Body Format

The `body` field contains Sanity block content as a JSON string. Each block has this structure:

```json
[
  {
    "_key": "unique-key",
    "_type": "block",
    "style": "normal",
    "children": [
      {
        "_key": "child-key",
        "_type": "span",
        "marks": [],
        "text": "The actual text content"
      }
    ],
    "markDefs": []
  }
]
```

**Block Styles:**
- `normal` - Regular paragraph
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `blockquote` - Quote block

**Marks (formatting):**
- `strong` - Bold text
- `em` - Italic text
- `code` - Inline code

---

## Usage Examples

### JavaScript/TypeScript (Fetch API)

```javascript
// Get all posts
async function getAllPosts() {
  const response = await fetch('http://localhost:5173/api/posts');
  const data = await response.json();
  return data.items;
}

// Get a single post
async function getPost(id) {
  const response = await fetch(`http://localhost:5173/api/posts/${id}`);
  return await response.json();
}

// Get latest 5 posts
async function getLatestPosts() {
  const response = await fetch('http://localhost:5173/api/posts/latest?limit=5');
  return await response.json();
}

// Search by slug
async function getPostBySlug(slug) {
  const response = await fetch(`http://localhost:5173/api/posts?slug=${encodeURIComponent(slug)}`);
  const data = await response.json();
  return data.items[0]; // Returns first match
}

// Example usage
const posts = await getAllPosts();
console.log(`Found ${posts.length} posts`);

const latest = await getLatestPosts();
console.log('Latest posts:', latest);
```

### Python

```python
import requests

BASE_URL = "http://localhost:5173/api"

def get_all_posts(page=1, per_page=50):
    """Get all posts with pagination"""
    response = requests.get(f"{BASE_URL}/posts", params={
        "page": page,
        "perPage": per_page,
        "sort": "-created"
    })
    return response.json()

def get_post(post_id):
    """Get a single post by ID"""
    response = requests.get(f"{BASE_URL}/posts/{post_id}")
    return response.json()

def get_latest_posts(limit=5):
    """Get latest N posts"""
    response = requests.get(f"{BASE_URL}/posts/latest", params={"limit": limit})
    return response.json()

def search_by_slug(slug):
    """Search for a post by slug"""
    response = requests.get(f"{BASE_URL}/posts", params={"slug": slug})
    data = response.json()
    return data["items"][0] if data["items"] else None

# Example usage
posts = get_all_posts()
print(f"Found {posts['totalItems']} total posts")

latest = get_latest_posts(limit=10)
print(f"Latest {len(latest)} posts")
```

### cURL

```bash
# Get all posts
curl http://localhost:5173/api/posts

# Get paginated posts
curl "http://localhost:5173/api/posts?page=2&perPage=20"

# Get single post
curl http://localhost:5173/api/posts/abc123def456

# Get latest 10 posts
curl "http://localhost:5173/api/posts/latest?limit=10"

# Search by slug
curl "http://localhost:5173/api/posts?slug=my-post-slug"
```

### React/Next.js Example

```tsx
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  keywords: string[];
  mainImageUrl?: string;
  body: string;
  created: string;
  updated: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5173/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.items);
        setLoading(false);
      });
  }, []);

  return { posts, loading };
}

export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5173/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [id]);

  return { post, loading };
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200 OK` - Success
- `404 Not Found` - Post not found
- `500 Internal Server Error` - Server error

Error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Example Error Response:**
```json
{
  "error": "Post not found"
}
```

---

## Image URLs

Post images are automatically included in responses via the `mainImageUrl` field. This URL points directly to the image file and can be used in `<img>` tags or image components.

**Image URL Format:**
```
{baseUrl}/api/files/posts/{postId}/{imageFilename}
```

**Example:**
```
http://localhost:5173/api/files/posts/abc123def456/image.jpg
```

If a post doesn't have an image, the `mainImage` and `mainImageUrl` fields will be `null` or undefined.

---

## Filtering and Sorting

### Sorting

Use the `sort` parameter to control the order:

- `-created` - Newest first (default)
- `created` - Oldest first
- `-updated` - Recently updated first
- `updated` - Oldest updated first
- `title` - Alphabetical by title
- `-title` - Reverse alphabetical

### Filtering by Slug

To find a specific post by its slug:

```bash
GET /api/posts?slug=exact-slug-name
```

This returns a paginated response, but typically you'll want the first item if the slug is unique.

---

## Best Practices

1. **Pagination**: Always use pagination for large datasets. The default `perPage` is 50, but you can adjust based on your needs.

2. **Caching**: Consider caching post data on the client side since posts don't change frequently.

3. **Error Handling**: Always check the response status and handle errors gracefully.

4. **Image Loading**: Use the `mainImageUrl` field for displaying images. Implement lazy loading for better performance.

5. **Body Parsing**: The `body` field is a JSON string. Parse it before using:
   ```javascript
   const bodyBlocks = JSON.parse(post.body);
   ```

---

## Rate Limiting

Currently, there are no rate limits on the API endpoints. However, be respectful of server resources and implement appropriate caching strategies in your application.

---

## Support

For issues or questions about the API, please refer to the project repository or contact the development team.

