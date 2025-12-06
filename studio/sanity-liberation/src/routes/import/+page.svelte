<script lang="ts">
	import { createClient } from '@sanity/client';
	import { pb } from '$lib/pocketbase';
	import { Loader2 } from 'lucide-svelte';

	let projectId = $state('');
	let dataset = $state('production');
	let token = $state(''); // Optional, for private datasets
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
				useCdn: false,
				apiVersion: '2023-05-03'
			});

			logs = [...logs, 'Fetching posts from Sanity...'];
			const posts = await client.fetch('*[_type == "post"]');
			logs = [...logs, `Found ${posts.length} posts.`];
            total = posts.length;

			for (const post of posts) {
                try {
                    // Map Sanity fields to PocketBase
                    const pbPost = {
                        title: post.title,
                        slug: post.slug?.current,
                        excerpt: post.excerpt,
                        tags: post.tags || [],
                        keywords: post.keywords ? JSON.stringify(post.keywords) : '[]',
                        // Body needs conversion from Portable Text to HTML. 
                        // For now, we'll store JSON string of blocks if we can't convert easily, 
                        // OR we just leave it empty and warn user.
                        // Ideally we'd use @portabletext/to-html but that requires another package.
                        // We'll store the raw JSON for now in the editor field (it might look messy but preserves data).
                        body: JSON.stringify(post.body, null, 2), 
                        created: post._createdAt,
                        updated: post._updatedAt,
                    };

                    // Check if exists
                    try {
                        // Assuming slug is unique
                        const existing = await pb.collection('posts').getFirstListItem(`slug="${post.slug.current}"`);
                        if (existing) {
                             logs = [...logs, `Skipping ${post.title} (already exists)`];
                             progress++;
                             continue;
                        }
                    } catch (e) {
                        // Not found, proceed
                    }

                    await pb.collection('posts').create(pbPost);
                    logs = [...logs, `Imported: ${post.title}`];
                } catch (err) {
                    console.error(err);
                    logs = [...logs, `Failed to import ${post.title}: ${err.message}`];
                }
                progress++;
			}
            logs = [...logs, 'Import complete!'];

		} catch (error) {
			console.error('Import error:', error);
			logs = [...logs, `Error: ${error.message}`];
		} finally {
			importing = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<h1 class="text-2xl font-bold text-gray-900">Import from Sanity</h1>

	<div class="bg-white shadow sm:rounded-lg p-6 space-y-4">
		<div>
			<label for="projectId" class="block text-sm font-medium text-gray-700">Project ID</label>
			<input
				type="text"
				id="projectId"
				bind:value={projectId}
				class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			/>
		</div>
		<div>
			<label for="dataset" class="block text-sm font-medium text-gray-700">Dataset</label>
			<input
				type="text"
				id="dataset"
				bind:value={dataset}
				class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			/>
		</div>
		<div>
			<label for="token" class="block text-sm font-medium text-gray-700">Token (Optional)</label>
			<input
				type="password"
				id="token"
				bind:value={token}
				class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
			/>
		</div>

		<button
			onclick={handleImport}
			disabled={importing || !projectId}
			class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
		>
			{#if importing}
				<Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4" />
				Importing...
			{:else}
				Start Import
			{/if}
		</button>
	</div>

	{#if logs.length > 0}
		<div class="bg-gray-50 rounded-md p-4 h-64 overflow-auto border border-gray-200 font-mono text-sm">
			{#each logs as log}
				<div class="text-gray-700">{log}</div>
			{/each}
		</div>
	{/if}
</div>
