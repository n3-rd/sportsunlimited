<script lang="ts">
	import { Save, Image as ImageIcon, X, RefreshCw, Upload, Calendar, Eye, EyeOff } from 'lucide-svelte';
	import MultiSelect from './MultiSelect.svelte';
	import RichTextEditor from './RichTextEditor.svelte';
	import { sanityBlocksToHTML, htmlToSanityBlocks, type SanityBlock } from '$lib/utils/sanity-blocks';

	let { post = null, onSave } = $props();

	let title = $state(post?.title || '');
	let slug = $state(post?.slug || '');
	let excerpt = $state(post?.excerpt || '');
	let tags = $state(post?.tags || []);
	let keywords = $state(post?.keywords || []); 
	let bodyHTML = $state('');

	function isoToLocalDateTime(iso: string | null | undefined): string {
		if (!iso) return '';
		const date = new Date(iso);
		if (isNaN(date.getTime())) return '';
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function getCurrentLocalDateTime(): string {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	let createdDate = $state(post?.created ? isoToLocalDateTime(post.created) : getCurrentLocalDateTime());
	let updatedDate = $state(post?.updated ? isoToLocalDateTime(post.updated) : getCurrentLocalDateTime());

	function normalizeStatus(postStatus: string | null | undefined): string {
		if (!postStatus || postStatus.trim() === '') return 'Published';
		return postStatus;
	}

	let currentPostId = $state(post?.id || null);
	let status = $state(post ? normalizeStatus(post.status) : 'Draft');

	$effect(() => {
		if (post) {
			createdDate = isoToLocalDateTime(post.created) || getCurrentLocalDateTime();
			updatedDate = isoToLocalDateTime(post.updated) || getCurrentLocalDateTime();
			status = normalizeStatus(post.status);
			currentPostId = post.id || null;
		} else {
			const now = getCurrentLocalDateTime();
			createdDate = now;
			updatedDate = now;
			status = 'Draft';
			currentPostId = null;
		}
	});

	let showDateDialog = $state(false);

	$effect(() => {
		if (!showDateDialog) return;
		function handleEscape(e: KeyboardEvent) { if (e.key === 'Escape') showDateDialog = false; }
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	});

	$effect(() => {
		if (post?.body) {
			let blocks: SanityBlock[] | null = null;
			if (Array.isArray(post.body)) {
				if (post.body.length > 0 && post.body[0]?._type === 'block') blocks = post.body as SanityBlock[];
			} else if (typeof post.body === 'string') {
				try {
					const parsed = JSON.parse(post.body);
					if (Array.isArray(parsed) && parsed[0]?._type === 'block') blocks = parsed as SanityBlock[];
				} catch {}
			}
			if (blocks) {
				bodyHTML = sanityBlocksToHTML(blocks);
			} else {
				bodyHTML = typeof post.body === 'string' ? post.body : '';
			}
		} else {
			bodyHTML = '';
		}
	});

	let mainImage = $state<File | null>(null);
	let mainImagePreview = $state<string | null>(null);
	
	$effect(() => {
		if (post?.mainImage && !mainImage && !mainImagePreview) {
			if (post.mainImageUrl) mainImagePreview = post.mainImageUrl;
			else if (post.id && post.mainImage) mainImagePreview = `/api/files/posts/${post.id}/${post.mainImage}`;
		}
	});

	let loading = $state(false);
	let keywordInput = $state('');

	let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
	let lastAutosave = $state<Date | null>(null);
	let autosaving = $state(false);
	
	let saveStatus = $derived(getSaveStatus());

	let availableTags = $state<string[]>([]);

	$effect(() => {
		async function fetchTags() {
			try {
				const res = await fetch('/api/admin/settings');
				if (res.ok) {
					const data = await res.json();
					if (data.availableTags) {
						availableTags = data.availableTags;
					}
				}
			} catch (e) {
				console.error('Failed to fetch tags', e);
			}
		}
		if (availableTags.length === 0) {
			fetchTags();
		}
	});

	function generateSlug() {
		slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
	}

	function addKeyword(e: KeyboardEvent) {
		if (e.key === 'Enter' && keywordInput.trim()) {
			e.preventDefault();
			if (!keywords.includes(keywordInput.trim())) keywords = [...keywords, keywordInput.trim()];
			keywordInput = '';
		}
	}

	function removeKeyword(k: string) { keywords = keywords.filter((w: string) => w !== k); }

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

	function buildFormData(newStatus?: string): FormData {
		const formData = new FormData();
		formData.append('title', title);
		formData.append('slug', slug);
		formData.append('excerpt', excerpt);
		tags.forEach((t: string) => formData.append('tags', t));
		formData.append('keywords', JSON.stringify(keywords));
		const sanityBlocks = htmlToSanityBlocks(bodyHTML);
		formData.append('body', JSON.stringify(sanityBlocks));
		if (mainImage) formData.append('mainImage', mainImage);
		if (createdDate) formData.append('created', createdDate);
		if (updatedDate) formData.append('updated', updatedDate);
		formData.append('status', newStatus || status);
		return formData;
	}

	async function savePost(newStatus?: string, showLoading = true) {
		if (showLoading) loading = true;
		try {
			const formData = buildFormData(newStatus);
			if (newStatus) status = newStatus;
			await onSave(formData);
		} catch (error) {
			console.error('Error saving post:', error);
			if (showLoading) alert('Failed to save post');
			throw error;
		} finally {
			if (showLoading) loading = false;
		}
	}

	async function handleSubmit() { await savePost(); }
	async function handlePublish() { await savePost('Published'); }
	async function handleUnpublish() { await savePost('Draft'); }

	function getSaveStatus(): { color: string; text: string } {
		if (loading) return { color: 'bg-yellow-500', text: 'Saving...' };
		if (autosaving) return { color: 'bg-yellow-500', text: 'Autosaving...' };
		if (lastAutosave) return { color: 'bg-green-500', text: 'Saved' };
		return { color: 'bg-gray-500', text: 'Not saved' };
	}

	$effect(() => {
		if (!title.trim() && !slug.trim()) return;
		const _ = title + slug + excerpt + bodyHTML + tags.join(',') + keywords.join(',');
		if (autosaveTimer) clearTimeout(autosaveTimer);
		autosaveTimer = setTimeout(async () => {
			autosaving = true;
			try {
				const formData = buildFormData(status);
				if (currentPostId) {
					const response = await fetch(`/api/admin/posts/${currentPostId}`, { method: 'PUT', body: formData });
					if (!response.ok) throw new Error('Autosave failed');
				} else {
					const response = await fetch('/api/admin/posts', { method: 'POST', body: formData });
					if (!response.ok) throw new Error('Autosave failed');
					const newPost = await response.json();
					currentPostId = newPost.id;
				}
				lastAutosave = new Date();
			} catch (error) {
				console.error('Autosave failed:', error);
			} finally {
				autosaving = false;
			}
		}, 3000);
		return () => { if (autosaveTimer) clearTimeout(autosaveTimer); };
	});
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-8 pb-24">
	<div class="space-y-6">
		<div>
			<label for="title" class="block text-sm font-semibold text-white mb-2">Title <span class="text-[#ef4444]">*</span></label>
			<input type="text" name="title" id="title" bind:value={title} required oninput={() => { if (!post) generateSlug(); }} class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base" placeholder="Enter post title" />
		</div>

		<div>
			<label for="slug" class="block text-sm font-semibold text-white mb-2">Slug <span class="text-[#ef4444]">*</span></label>
			<div class="flex gap-2">
				<input type="text" name="slug" id="slug" bind:value={slug} required class="flex-1 px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base" placeholder="post-slug" />
				<button type="button" onclick={generateSlug} class="px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all flex items-center gap-2 font-medium"><RefreshCw class="h-4 w-4" /><span class="hidden sm:inline">Generate</span></button>
			</div>
		</div>

		<div>
			<label for="excerpt" class="block text-sm font-semibold text-white mb-2">Excerpt</label>
			<textarea id="excerpt" name="excerpt" rows="3" bind:value={excerpt} class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all resize-y text-base" placeholder="Brief description for the blog post"></textarea>
		</div>

		<div>
			<button type="button" onclick={() => (showDateDialog = true)} class="inline-flex items-center gap-2 px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all"><Calendar class="h-4 w-4" /><span>Edit Dates</span></button>
		</div>

		<div>
			<MultiSelect id="tags" label="Tags" options={availableTags} bind:selected={tags} placeholder="Select tags..." />
		</div>

		<div>
			<label for="keywords" class="block text-sm font-semibold text-white mb-2">Keywords</label>
			<input type="text" id="keywords" bind:value={keywordInput} onkeydown={addKeyword} class="w-full px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] transition-all text-base" placeholder="Type keyword and press Enter" />
			{#if keywords.length > 0}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each keywords as keyword}
						<span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] text-white text-sm font-medium rounded-lg">{keyword} <button type="button" onclick={() => removeKeyword(keyword)} class="hover:bg-[#2563eb] rounded p-0.5" aria-label="Remove"><X class="h-3.5 w-3.5" /></button></span>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<label for="image-upload" class="block text-sm font-semibold text-white mb-2">Main Image</label>
			<div class="space-y-4">
				{#if mainImagePreview}
					<div class="relative inline-block">
						<div class="relative w-full sm:w-64 h-48 sm:h-64 rounded-lg overflow-hidden border-2 border-[#333333] bg-[#1f1f1f]">
							<img src={mainImagePreview} alt="Preview" class="h-full w-full object-cover" />
							<button type="button" onclick={removeImage} class="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white"><X class="h-5 w-5" /></button>
						</div>
					</div>
				{:else}
					<div class="w-full sm:w-64 h-48 sm:h-64 rounded-lg border-2 border-dashed border-[#333333] bg-[#1f1f1f] flex flex-col items-center justify-center text-[#9ca3af]"><ImageIcon class="h-12 w-12 mb-2" /><p class="text-sm">No image selected</p></div>
				{/if}
				<label for="image-upload" class="inline-flex items-center gap-2 px-4 py-3 bg-[#1f1f1f] border border-[#333333] rounded-lg text-white hover:bg-[#2a2a2a] cursor-pointer"><Upload class="h-5 w-5" /><span class="font-medium">{mainImagePreview ? 'Change Image' : 'Upload Image'}</span>
					<input type="file" id="image-upload" accept="image/*" onchange={handleImageSelect} class="hidden" />
				</label>
			</div>
		</div>

		<div>
			<label for="body" class="block text-sm font-semibold text-white mb-2">Body <span class="text-[#ef4444]">*</span></label>
			<RichTextEditor bind:value={bodyHTML} placeholder="Start writing your post content..." />
		</div>
	</div>

	{#if showDateDialog}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onclick={(e) => { if (e.target === e.currentTarget) showDateDialog = false; }} role="dialog">
			<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" onclick={(e) => e.stopPropagation()}>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-white">Edit Dates</h2>
					<button type="button" onclick={() => (showDateDialog = false)} class="p-1 text-[#9ca3af] hover:text-white hover:bg-[#2a2a2a] rounded-lg"><X class="h-5 w-5" /></button>
				</div>
				<div class="space-y-4">
					<div><label for="created" class="block text-sm font-semibold text-white mb-2">Created Date</label><input type="datetime-local" id="created" bind:value={createdDate} class="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white" /></div>
					<div><label for="updated" class="block text-sm font-semibold text-white mb-2">Updated Date</label><input type="datetime-local" id="updated" bind:value={updatedDate} class="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333333] rounded-lg text-white" /></div>
				</div>
				<div class="mt-6 flex justify-end"><button type="button" onclick={() => (showDateDialog = false)} class="px-4 py-2 border border-[#333333] rounded-lg text-sm font-semibold text-white bg-[#1f1f1f] hover:bg-[#2a2a2a]">Close</button></div>
			</div>
		</div>
	{/if}

	<div class="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#333333] px-4 sm:px-6 py-4 z-50 shadow-lg">
		<div class="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center">
			<a href="/admin/posts" class="inline-flex justify-center items-center px-6 py-3 border border-[#333333] rounded-lg text-sm font-semibold text-white bg-[#1f1f1f] hover:bg-[#2a2a2a]">Cancel</a>
			
			<div class="flex items-center gap-3 flex-1 sm:justify-between">
				<div class="flex items-center gap-2 text-xs text-[#9ca3af]"><span class="w-2 h-2 rounded-full {saveStatus.color}"></span><span>{saveStatus.text}</span></div>
				
				<div class="flex items-center gap-3">
				{#if slug}
					<a href="/post/{slug}?preview=true" target="_blank" class="inline-flex justify-center items-center gap-2 px-4 py-3 border border-[#333333] rounded-lg text-sm font-semibold text-[#9ca3af] hover:text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors">
						<Eye class="h-4 w-4" /><span class="hidden sm:inline">Preview</span>
					</a>
				{/if}
				{#if status === 'Published'}
					<button type="button" onclick={handleUnpublish} disabled={loading} class="inline-flex justify-center items-center gap-2 px-6 py-3 border border-[#333333] rounded-lg text-sm font-semibold text-white bg-[#1f1f1f] hover:bg-[#2a2a2a] disabled:opacity-50">
						{#if loading}<RefreshCw class="h-4 w-4 animate-spin" /><span>Unpublishing...</span>{:else}<EyeOff class="h-4 w-4" /><span>Unpublish</span>{/if}
					</button>
				{:else}
					<button type="button" onclick={handlePublish} disabled={loading} class="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#10b981] hover:bg-[#059669] disabled:opacity-50">
						{#if loading}<RefreshCw class="h-4 w-4 animate-spin" /><span>Publishing...</span>{:else}<Eye class="h-4 w-4" /><span>Publish</span>{/if}
					</button>
				{/if}
				
				<button type="submit" disabled={loading} class="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50">
					{#if loading}<RefreshCw class="h-4 w-4 animate-spin" />{:else}<Save class="h-4 w-4" />{/if}
					<span>Save Post</span>
				</button>
			</div>
		</div>
	</div>
</form>
