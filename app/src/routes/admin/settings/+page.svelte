<script lang="ts">
	import { onMount } from 'svelte';
	import { Save, Check } from 'lucide-svelte';

	let loading = $state(false);
	let saved = $state(false);

	let settingsConfig = $state({
		siteName: "",
		tagline: "",
		description: "",
		facebookUrl: "",
		twitterUrl: "",
		instagramUrl: "",
		youtubeUrl: "",
		footerText: ""
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/admin/settings');
			if (res.ok) {
				const data = await res.json();
				settingsConfig = { ...settingsConfig, ...data };
			}
		} catch (e) {
			console.error('Failed to load settings', e);
		}
	});

	async function saveSettings() {
		loading = true;
		saved = false;
		try {
			const res = await fetch('/api/admin/settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settingsConfig)
			});
			if (res.ok) {
				saved = true;
				setTimeout(() => saved = false, 3000);
			}
		} catch (e) {
			console.error('Failed to save settings', e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-8 max-w-3xl mx-auto space-y-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Global Settings</h1>
			<p class="text-[#9ca3af] mt-1">Configure site branding and social links</p>
		</div>
		<button
			onclick={saveSettings}
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
		<h2 class="text-xl font-semibold text-white border-b border-[#333333] pb-2">Branding</h2>
		
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Site Name</label>
				<input type="text" bind:value={settingsConfig.siteName} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Tagline</label>
				<input type="text" bind:value={settingsConfig.tagline} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Description</label>
				<textarea rows="3" bind:value={settingsConfig.description} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white resize-y"></textarea>
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Footer Copyright Text</label>
				<input type="text" bind:value={settingsConfig.footerText} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
		</div>

		<h2 class="text-xl font-semibold text-white border-b border-[#333333] pb-2 pt-4">Social Links</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Facebook URL</label>
				<input type="url" bind:value={settingsConfig.facebookUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Twitter / X URL</label>
				<input type="url" bind:value={settingsConfig.twitterUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Instagram URL</label>
				<input type="url" bind:value={settingsConfig.instagramUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">YouTube URL</label>
				<input type="url" bind:value={settingsConfig.youtubeUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
			</div>
		</div>
	</div>
</div>
