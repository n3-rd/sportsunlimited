<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Save, Image as ImageIcon, X, RefreshCw, Upload } from 'lucide-svelte';
	import MultiSelect from './MultiSelect.svelte';
	import RichTextEditor from './RichTextEditor.svelte';
	import { sanityBlocksToHTML, htmlToSanityBlocks, type SanityBlock } from '$lib/utils/sanity-blocks';

	let { post = null, onSave } = $props();

	let title = $state(post?.title || '');
	let slug = $state(post?.slug || '');
	let excerpt = $state(post?.excerpt || '');
	let tags = $state(post?.tags || []);
	let keywords = $state(post?.keywords || []); // JSON array of strings
	let body = $state(post?.body || '');
	let bodyHTML = $state('');

	// Convert body to HTML for editor if it's Sanity blocks
	$effect(() => {
		if (post?.body) {
			let blocks: SanityBlock[] | null = null;
			
			// Check if body is already an array
			if (Array.isArray(post.body)) {
				if (post.body.length > 0 && post.body[0]?._type === 'block') {
					blocks = post.body as SanityBlock[];
				}
			} 
			// Check if body is a JSON string
			else if (typeof post.body === 'string') {
				try {
					const parsed = JSON.parse(post.body);
					if (Array.isArray(parsed) && parsed[0]?._type === 'block') {
						blocks = parsed as SanityBlock[];
					}
				} catch {
					// Not JSON, treat as plain HTML/text
				}
			}
			
			// Convert blocks to HTML if we found blocks
			if (blocks) {
				bodyHTML = sanityBlocksToHTML(blocks);
			} else {
				// Fallback to treating as HTML/text
				bodyHTML = typeof post.body === 'string' ? post.body : '';
			}
		} else {
			bodyHTML = '';
		}
	});
	let mainImage = $state<File | null>(null); // File object
	let mainImagePreview = $state<string | null>(null);
	
		// Initialize preview from existing post image
		$effect(() => {
			if (post?.mainImage && !mainImage && !mainImagePreview) {
				try {
					mainImagePreview = pb.files.getURL(post, post.mainImage);
				} catch {
					// Fallback URL construction
					const pbUrl = import.meta.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8099';
					mainImagePreview = `${pbUrl}/api/files/posts/${post.id}/${post.mainImage}`;
				}
			}
		});

	let loading = $state(false);
	let keywordInput = $state('');

	const availableTags = [
		'Football',
		'Athletics',
		'Basketball',
		'Nigeria League',
		'Lifestyle',
		'Oddities',
		'Other Sports',
		'Interview',
		'Feature'
	];

	function generateSlug() {
		slug = title
			.toLowerCase()
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
		keywords = keywords.filter((w: string) => w !== k);
	}

	function handleImageSelect(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			mainImage = file;
			mainImagePreview = URL.createObjectURL(file);
		}
	}

	function removeImage() {
		mainImage = null;
		mainImagePreview = null;
	}

	async function handleSubmit() {
		loading = true;
		try {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('slug', slug);
			formData.append('excerpt', excerpt);
			tags.forEach((t: string) => formData.append('tags', t));

			formData.append('keywords', JSON.stringify(keywords));
			
			// Convert HTML to Sanity blocks format
			const sanityBlocks = htmlToSanityBlocks(bodyHTML);
			formData.append('body', JSON.stringify(sanityBlocks));
			
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

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	class="space-y-8"
>
	<div class="space-y-6">
		<!-- Title -->
		<div>
			<label for="title" class="block text-sm font-semibold text-white mb-2">
				Title <span class="text-[#ef4444]">*</span>
			</label>
			<input
				type="text"
				name="title"
				id="title"
				bind:value={title}
				required
				oninput={() => {
					if (!post) generateSlug();
				}}
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
				placeholder="Enter post title"
			/>
		</div>

		<!-- Slug -->
		<div>
			<label for="slug" class="block text-sm font-semibold text-white mb-2">
				Slug <span class="text-[#ef4444]">*</span>
			</label>
			<div class="flex gap-2">
				<input
					type="text"
					name="slug"
					id="slug"
					bind:value={slug}
					required
					class="flex-1 px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
					placeholder="post-slug"
				/>
				<button
					type="button"
					onclick={generateSlug}
					class="px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all flex items-center gap-2 font-medium"
					aria-label="Generate slug from title"
				>
					<RefreshCw class="h-4 w-4" />
					<span class="hidden sm:inline">Generate</span>
				</button>
			</div>
		</div>

		<!-- Excerpt -->
		<div>
			<label for="excerpt" class="block text-sm font-semibold text-white mb-2">
				Excerpt
			</label>
			<textarea
				id="excerpt"
				name="excerpt"
				rows="3"
				bind:value={excerpt}
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all resize-y text-base"
				placeholder="Brief description for the blog post"
			></textarea>
			<p class="mt-2 text-sm text-[#9ca3af]">A brief description that will appear in previews and search results.</p>
		</div>

		<!-- Tags -->
		<div>
			<MultiSelect
				id="tags"
				label="Tags"
				options={availableTags}
				bind:selected={tags}
				placeholder="Select tags..."
			/>
		</div>

		<!-- Keywords -->
		<div>
			<label for="keywords" class="block text-sm font-semibold text-white mb-2">
				Keywords
			</label>
			<input
				type="text"
				id="keywords"
				bind:value={keywordInput}
				onkeydown={addKeyword}
				class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base"
				placeholder="Type keyword and press Enter"
			/>
			<p class="mt-2 text-sm text-[#9ca3af]">Press Enter to add each keyword.</p>
			{#if keywords.length > 0}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each keywords as keyword}
						<span
							class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] text-white text-sm font-medium rounded-lg"
						>
							{keyword}
							<button
								type="button"
								onclick={() => removeKeyword(keyword)}
								class="hover:bg-[#2563eb] rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#3b82f6] transition-colors"
								aria-label="Remove {keyword}"
							>
								<X class="h-3.5 w-3.5" />
							</button>
						</span>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Main Image -->
		<div>
			<label for="image-upload" class="block text-sm font-semibold text-white mb-2">
				Main Image
			</label>
			<div class="space-y-4">
				{#if mainImagePreview}
					<div class="relative inline-block">
						<div
							class="relative w-full sm:w-64 h-48 sm:h-64 rounded-lg overflow-hidden border-2 border-[#333333] bg-[#1f1f1f]"
						>
							<img
								src={mainImagePreview}
								alt="Post preview"
								class="h-full w-full object-cover"
							/>
							<button
								type="button"
								onclick={removeImage}
								class="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-[#60a5fa] transition-colors"
								aria-label="Remove image"
							>
								<X class="h-5 w-5" />
							</button>
						</div>
					</div>
				{:else}
					<div
						class="w-full sm:w-64 h-48 sm:h-64 rounded-lg border-2 border-dashed border-[#333333] bg-[#1f1f1f] flex flex-col items-center justify-center text-[#9ca3af]"
					>
						<ImageIcon class="h-12 w-12 mb-2" />
						<p class="text-sm">No image selected</p>
					</div>
				{/if}
				<label
					for="image-upload"
					class="inline-flex items-center gap-2 px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white hover:bg-[#2a2a2a] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#60a5fa] focus-within:border-[#3b82f6] transition-all cursor-pointer"
				>
					<Upload class="h-5 w-5" />
					<span class="font-medium">{mainImagePreview ? 'Change Image' : 'Upload Image'}</span>
					<input
						type="file"
						id="image-upload"
						accept="image/*"
						onchange={handleImageSelect}
						class="hidden"
					/>
				</label>
			</div>
		</div>

		<!-- Body (WYSIWYG Editor) -->
		<div>
			<label for="body" class="block text-sm font-semibold text-white mb-2">
				Body <span class="text-[#ef4444]">*</span>
			</label>
			<RichTextEditor bind:value={bodyHTML} placeholder="Start writing your post content..." />
			<p class="mt-2 text-sm text-[#9ca3af]">
				Rich text editor. Content will be saved in Sanity block format.
			</p>
		</div>
	</div>

	<!-- Form Actions -->
	<div class="pt-6 border-t border-[#333333]">
		<div class="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
			<a
				href="/posts"
				class="inline-flex justify-center items-center px-6 py-3 border border-[#333333] rounded-lg text-sm font-semibold text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all"
			>
				Cancel
			</a>
			<button
				type="submit"
				disabled={loading}
				class="inline-flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
			>
				{#if loading}
					<RefreshCw class="h-4 w-4 animate-spin" />
					<span>Saving...</span>
				{:else}
					<Save class="h-4 w-4" />
					<span>Save Post</span>
				{/if}
			</button>
		</div>
	</div>
</form>
