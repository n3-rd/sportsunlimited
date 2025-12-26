<script lang="ts">
	import { createClient } from '@sanity/client';
	import { Loader2, Download } from 'lucide-svelte';

	let projectId = $state('');
	let dataset = $state('production');
	let token = $state(''); // Optional, for private datasets
	let limit = $state(10); // Limit number of posts to import
	let importing = $state(false);
	let logs: string[] = $state([]);
	let progress = $state(0);
	let total = $state(0);

	async function handleImport() {
		importing = true;
		logs = ['Starting import...'];
		progress = 0;

		try {
			const client = createClient({
				projectId,
				dataset,
				token: token || undefined,
				useCdn: true,
				apiVersion: '2023-05-03'
			});

			logs = [...logs, `Fetching up to ${limit} posts from Sanity...`];
			// Use GROQ query with limit to avoid overfetching
			const query = `*[_type == "post"] | order(_createdAt desc) [0...${limit}]`;
			const posts = await client.fetch(query);
			logs = [...logs, `Found ${posts.length} posts to import.`];
			total = posts.length;

			// Process posts one by one using API routes
			for (let i = 0; i < posts.length; i++) {
				const post = posts[i];
				try {
					// Check if exists
					try {
						const checkResponse = await fetch(`/api/posts?slug=${encodeURIComponent(post.slug?.current || '')}`);
						if (checkResponse.ok) {
							const data = await checkResponse.json();
							if (data.items && data.items.length > 0) {
								logs = [...logs, `Skipping ${post.title} (already exists)`];
								progress++;
								continue;
							}
						}
					} catch (e) {
						// Continue if check fails
					}

					// Prepare FormData
					const formData = new FormData();
					formData.append('title', post.title || '');
					formData.append('slug', post.slug?.current || '');
					formData.append('excerpt', post.excerpt || '');
					
					// Handle tags array
					if (post.tags && Array.isArray(post.tags)) {
						for (const tag of post.tags) {
							formData.append('tags', tag);
						}
					}
					
					// Handle keywords
					formData.append('keywords', JSON.stringify(post.keywords || []));
					
					// Preserve original timestamps from Sanity
					// Convert Sanity ISO timestamps to format PocketBase expects
					if (post._createdAt) {
						// Sanity timestamps are already ISO 8601, but ensure proper format
						const createdDate = new Date(post._createdAt).toISOString();
						formData.append('created', createdDate);
					}
					if (post._updatedAt) {
						const updatedDate = new Date(post._updatedAt).toISOString();
						formData.append('updated', updatedDate);
					}
					
					// Handle body - convert from Sanity blocks to HTML string
					let bodyContent = '';
					if (post.body) {
						if (typeof post.body === 'string') {
							bodyContent = post.body;
						} else if (Array.isArray(post.body)) {
							// If it's Sanity block content, convert to HTML
							bodyContent = JSON.stringify(post.body, null, 2);
						} else {
							bodyContent = JSON.stringify(post.body, null, 2);
						}
					}
					formData.append('body', bodyContent);

					// Image handling
					if (post.mainImage?.asset?._ref) {
						try {
							const ref = post.mainImage.asset._ref;
							// Sanity ref format: image-{id}-{width}x{height}-{format}
							// Example: image-abc123-1200x800-jpg
							const parts = ref.split('-');
							if (parts.length >= 4 && parts[0] === 'image') {
								const id = parts[1];
								const dimensions = parts[2];
								const format = parts[3] || 'jpg';
								
								const url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
								logs = [...logs, `Fetching image: ${id}.${format}`];
								
								const resp = await fetch(url);
								if (resp.ok) {
									const blob = await resp.blob();
									const mimeType = blob.type || `image/${format === 'jpg' ? 'jpeg' : format}`;
									const file = new File([blob], `${id}.${format}`, { type: mimeType });
									formData.append('mainImage', file);
									logs = [...logs, `✓ Image added for ${post.title} (${(blob.size / 1024).toFixed(1)}KB)`];
								} else {
									logs = [...logs, `⚠ Image fetch failed: ${resp.status} ${resp.statusText}`];
								}
							} else {
								logs = [...logs, `⚠ Invalid image ref format: ${ref}`];
							}
						} catch (e: any) {
							console.error('Image fetch failed', e);
							logs = [...logs, `⚠ Image error: ${e.message || e}`];
						}
					}

					// Create post via API
					const response = await fetch('/api/posts', {
						method: 'POST',
						body: formData
					});

					if (!response.ok) {
						const error = await response.json();
						throw new Error(error.error || 'Failed to create post');
					}

					logs = [...logs, `✓ Imported: ${post.title}`];
				} catch (err: any) {
					logs = [...logs, `✗ Error importing ${post.title}: ${err.message || err}`];
				}
				progress++;
			}

			logs = [...logs, `\nImport complete! ${progress}/${total} posts processed.`];
		} catch (error: any) {
			console.error('Import error:', error);
			logs = [...logs, `Error: ${error.message || error}`];
		} finally {
			importing = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<h1 class="text-2xl sm:text-3xl font-bold text-white mb-6">Import from Sanity</h1>

	<div class="bg-[#141414] border border-[#333333] rounded-lg p-6 sm:p-8 space-y-6">
		<div>
			<label for="projectId" class="block text-sm font-semibold text-white mb-2">
				Project ID <span class="text-[#ef4444]">*</span>
			</label>
			<input
				type="text"
				id="projectId"
				bind:value={projectId}
				required
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
				placeholder="your-project-id"
			/>
		</div>
		<div>
			<label for="dataset" class="block text-sm font-semibold text-white mb-2">Dataset</label>
			<input
				type="text"
				id="dataset"
				bind:value={dataset}
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
				placeholder="production"
			/>
		</div>
		<div>
			<label for="token" class="block text-sm font-semibold text-white mb-2">Token (Optional)</label>
			<input
				type="password"
				id="token"
				bind:value={token}
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
				placeholder="For private datasets"
			/>
			<p class="mt-2 text-sm text-[#9ca3af]">Required only for private datasets</p>
		</div>
		<div>
			<label for="limit" class="block text-sm font-semibold text-white mb-2">
				Import Limit <span class="text-[#9ca3af] font-normal">(posts to fetch)</span>
			</label>
			<input
				type="number"
				id="limit"
				bind:value={limit}
				min="1"
				max="1000"
				disabled={importing}
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
				placeholder="10"
			/>
			<p class="mt-2 text-sm text-[#9ca3af]">
				Number of posts to import (ordered by creation date, newest first). Prevents overfetching.
			</p>
		</div>

		<button
			onclick={handleImport}
			disabled={importing || !projectId}
			class="w-full inline-flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#141414] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
		>
			{#if importing}
				<Loader2 class="h-5 w-5 animate-spin" />
				<span>Importing... ({progress}/{total})</span>
			{:else}
				<Download class="h-5 w-5" />
				<span>Start Import</span>
			{/if}
		</button>

		{#if total > 0}
			<div class="w-full bg-[#1f1f1f] rounded-lg h-2 overflow-hidden">
				<div
					class="h-full bg-[#3b82f6] transition-all duration-300"
					style="width: {total > 0 ? (progress / total) * 100 : 0}%"
				></div>
			</div>
		{/if}
	</div>

	{#if logs.length > 0}
		<div
			class="bg-[#141414] border border-[#333333] rounded-lg p-4 sm:p-6 h-64 sm:h-96 overflow-auto font-mono text-sm"
		>
			{#each logs as log}
				<div class="text-[#d1d5db] mb-1 whitespace-pre-wrap">{log}</div>
			{/each}
		</div>
	{/if}
</div>
