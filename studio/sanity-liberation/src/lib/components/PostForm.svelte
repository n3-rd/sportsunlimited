<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { Save, Image as ImageIcon, X } from 'lucide-svelte';

	let { post = null, onSave } = $props();

	let title = $state(post?.title || '');
	let slug = $state(post?.slug || '');
	let excerpt = $state(post?.excerpt || '');
	let tags = $state(post?.tags || []);
	let keywords = $state(post?.keywords || []); // JSON array of strings
	let body = $state(post?.body || '');
	let mainImage = $state(null); // File object
    let mainImagePreview = $state(post?.mainImage ? pb.files.getUrl(post, post.mainImage) : null);

	let loading = $state(false);
    let keywordInput = $state('');

	const availableTags = [
		"Football", "Athletics", "Basketball", "Nigeria League",
		"Lifestyle", "Oddities", "Other Sports", "Interview", "Feature"
	];

	function generateSlug() {
		slug = title.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '');
	}

    function addKeyword(e: KeyboardEvent) {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault();
            if (!keywords.includes(keywordInput.trim())) {
                keywords = [...keywords, keywordInput.trim()];
            }
            keywordInput = '';
        }
    }

    function removeKeyword(k: string) {
        keywords = keywords.filter(w => w !== k);
    }

    function handleImageSelect(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            mainImage = file;
            mainImagePreview = URL.createObjectURL(file);
        }
    }

	async function handleSubmit() {
		loading = true;
		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('slug', slug);
			formData.append('excerpt', excerpt);
            // PocketBase handles multi-select as individual appends or array?
            // For 'select' type with multiple values, we usually append multiple times or send as JSON?
            // PocketBase JS SDK handles array for select.
            tags.forEach(t => formData.append('tags', t));
            
			formData.append('keywords', JSON.stringify(keywords));
			formData.append('body', body);
			if (mainImage) {
				formData.append('mainImage', mainImage);
			}

			await onSave(formData);
		} catch (error) {
			console.error('Error saving post:', error);
			alert('Failed to save post');
		} finally {
			loading = false;
		}
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-8 divide-y divide-gray-200">
	<div class="space-y-8 divide-y divide-gray-200">
		<div>
			<div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
				
                <!-- Title -->
				<div class="sm:col-span-4">
					<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
					<div class="mt-1">
						<input
							type="text"
							name="title"
							id="title"
                            bind:value={title}
                            oninput={() => { if (!post) generateSlug(); }}
							class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
						/>
					</div>
				</div>

                <!-- Slug -->
				<div class="sm:col-span-4">
					<label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
					<div class="mt-1 flex rounded-md shadow-sm">
						<input
							type="text"
							name="slug"
							id="slug"
                            bind:value={slug}
							class="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
						/>
                        <button
                            type="button"
                            onclick={generateSlug}
                            class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                        >
                            Generate
                        </button>
					</div>
				</div>

                <!-- Excerpt -->
				<div class="sm:col-span-6">
					<label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
					<div class="mt-1">
						<textarea
							id="excerpt"
							name="excerpt"
							rows="3"
                            bind:value={excerpt}
							class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
						></textarea>
					</div>
					<p class="mt-2 text-sm text-gray-500">Brief description for the blog post.</p>
				</div>

                <!-- Tags -->
                <div class="sm:col-span-6">
                    <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
                    <div class="mt-1">
                        <select
                            multiple
                            id="tags"
                            name="tags"
                            bind:value={tags}
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md h-32"
                        >
                            {#each availableTags as tag}
                                <option value={tag}>{tag}</option>
                            {/each}
                        </select>
                    </div>
                    <p class="mt-2 text-sm text-gray-500">Hold Cmd/Ctrl to select multiple.</p>
                </div>

                <!-- Keywords -->
                <div class="sm:col-span-6">
                    <label for="keywords" class="block text-sm font-medium text-gray-700">Keywords</label>
                    <div class="mt-1">
                        <input
                            type="text"
                            id="keywords"
                            bind:value={keywordInput}
                            onkeydown={addKeyword}
                            placeholder="Type and press Enter"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div class="mt-2 flex flex-wrap gap-2">
                        {#each keywords as keyword}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {keyword}
                                <button type="button" onclick={() => removeKeyword(keyword)} class="ml-1 text-blue-600 hover:text-blue-800">
                                    <X class="h-3 w-3" />
                                </button>
                            </span>
                        {/each}
                    </div>
                </div>

                <!-- Main Image -->
                <div class="sm:col-span-6">
                    <label class="block text-sm font-medium text-gray-700">Main Image</label>
                    <div class="mt-1 flex items-center space-x-5">
                        <span class="inline-block h-32 w-32 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                            {#if mainImagePreview}
                                <img src={mainImagePreview} alt="Preview" class="h-full w-full object-cover" />
                            {:else}
                                <ImageIcon class="h-full w-full text-gray-300 p-8" />
                            {/if}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onchange={handleImageSelect}
                            class="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <!-- Body (Editor) -->
                <div class="sm:col-span-6">
                    <label for="body" class="block text-sm font-medium text-gray-700">Body (HTML)</label>
                    <div class="mt-1">
                        <textarea
                            id="body"
                            name="body"
                            rows="15"
                            bind:value={body}
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md font-mono"
                        ></textarea>
                    </div>
                    <p class="mt-2 text-sm text-gray-500">HTML content for the post.</p>
                </div>

			</div>
		</div>
	</div>

	<div class="pt-5">
		<div class="flex justify-end">
            <a href="/posts" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
            </a>
			<button
				type="submit"
                disabled={loading}
				class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
			>
				<Save class="mr-2 h-4 w-4" />
				{loading ? 'Saving...' : 'Save'}
			</button>
		</div>
	</div>
</form>
