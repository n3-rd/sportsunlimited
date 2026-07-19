<script lang="ts">
	import { onMount } from 'svelte';
	import { Save, Check, Plus, Trash2 } from 'lucide-svelte';

	let loading = $state(false);
	let saved = $state(false);

	let settingsConfig = $state<any>(null);
	let tags = $state<string[]>([]);
	let newTag = $state('');

	onMount(async () => {
		try {
			const res = await fetch('/api/admin/settings');
			if (res.ok) {
				const data = await res.json();
				settingsConfig = data;
				tags = data.availableTags || [];
			}
		} catch (e) {
			console.error('Failed to load settings', e);
		}
	});

	function addTag() {
		const trimmed = newTag.trim();
		if (trimmed && !tags.includes(trimmed)) {
			tags = [...tags, trimmed];
			newTag = '';
		}
	}

	function removeTag(tagToRemove: string) {
		tags = tags.filter(t => t !== tagToRemove);
	}

	async function saveTags() {
		if (!settingsConfig) return;
		loading = true;
		saved = false;
		
		const updatedConfig = { ...settingsConfig, availableTags: tags };

		try {
			const res = await fetch('/api/admin/settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedConfig)
			});
			if (res.ok) {
				saved = true;
				settingsConfig = updatedConfig;
				setTimeout(() => saved = false, 3000);
			}
		} catch (e) {
			console.error('Failed to save tags', e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-8 max-w-3xl mx-auto space-y-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Category Management</h1>
			<p class="text-[#9ca3af] mt-1">Manage the tags available for your posts</p>
		</div>
		<button
			onclick={saveTags}
			disabled={loading}
			class="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-[#2563eb] disabled:opacity-50"
		>
			{#if saved}
				<Check class="w-4 h-4" /> Saved!
			{:else}
				<Save class="w-4 h-4" /> Save Changes
			{/if}
		</button>
	</div>

	<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg p-6 space-y-6">
		<div>
			<label class="block text-sm font-semibold text-white mb-2">Add New Tag</label>
			<div class="flex gap-2">
				<input 
					type="text" 
					bind:value={newTag} 
					onkeydown={(e) => e.key === 'Enter' && addTag()}
					placeholder="Enter a new category name..." 
					class="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white placeholder-[#9ca3af] focus:outline-none focus:border-[#3b82f6]"
				/>
				<button 
					type="button" 
					onclick={addTag}
					class="flex items-center gap-2 px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#444444]"
				>
					<Plus class="w-4 h-4" /> Add
				</button>
			</div>
		</div>

		<div class="pt-4 border-t border-[#333333]">
			<h2 class="text-sm font-semibold text-[#9ca3af] mb-4 uppercase tracking-wider">Current Tags</h2>
			
			{#if tags.length === 0}
				<p class="text-[#9ca3af] text-sm">No tags found. Add one above.</p>
			{:else}
				<div class="space-y-2">
					{#each tags as tag}
						<div class="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-[#333333] rounded-md group">
							<span class="text-white font-medium">{tag}</span>
							<button 
								onclick={() => removeTag(tag)}
								class="text-[#ef4444] hover:text-[#f87171] opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-[#1a1a1a] rounded"
								aria-label="Remove {tag}"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
