<script lang="ts">
	import { onMount } from 'svelte';
	import { Save, Check } from 'lucide-svelte';

	let loading = $state(false);
	let saved = $state(false);

	let adsConfig = $state({
		mobileImg: "/ads/ILOT-WIN-A-HOUSE-FOOTBALL-IN-NIG-320X100.jpg",
		desktopImg: "/ads/ILOT-WIN-A-HOUSE-SPORT%20IN%20NIG728X90.jpg",
		mobileImgAlt: "/ads/ILOT-WIN-A-HOUSE-FOOTBALL-IN-NIG-320X100-I.jpg",
		desktopImgAlt: "/ads/ILOT-WIN-A-HOUSE-SPORT%20IN%20NIG-728X90-I.jpg",
		adUrl: "https://www.ilotbet.com/worldcup2026/?c=WCunlimitedbanner",
		bookAdImg: "/book.jpg",
		bookAdUrl: "",
		sidebarAd1Img: "/sidebar/ad1.png",
		sidebarAd1Url: "/ads/ad-1",
		sidebarAd2Img: "/sidebar/ad2.png",
		sidebarAd2Url: "/ads/ad-2",
		rateCardImg: "/sidebar/adrates.png",
		rateCardUrl: "/advertising"
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/admin/ads');
			if (res.ok) {
				const data = await res.json();
				adsConfig = { ...adsConfig, ...data };
			}
		} catch (e) {
			console.error('Failed to load ads config', e);
		}
	});

	async function handleFileUpload(e: Event, key: keyof typeof adsConfig) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		loading = true;
		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await fetch('/api/admin/upload', {
				method: 'POST',
				body: formData
			});
			if (res.ok) {
				const { url } = await res.json();
				adsConfig[key] = url as string;
			}
		} catch (err) {
			console.error('Upload failed', err);
		} finally {
			loading = false;
		}
	}

	async function saveAds() {
		loading = true;
		saved = false;
		try {
			const res = await fetch('/api/admin/ads', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(adsConfig)
			});
			if (res.ok) {
				saved = true;
				setTimeout(() => saved = false, 3000);
			}
		} catch (e) {
			console.error('Failed to save ads config', e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-8 max-w-3xl mx-auto space-y-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Ads Management</h1>
			<p class="text-[#9ca3af] mt-1">Configure banner ads shown on the site</p>
		</div>
		<button
			onclick={saveAds}
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
			<label class="block text-sm font-semibold text-white mb-2">Target URL</label>
			<input type="text" bind:value={adsConfig.adUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
		</div>
		
		<h2 class="text-xl font-semibold text-white pt-4 border-t border-[#333333]">Primary Ad</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Mobile Image (320x100)</label>
				<div class="flex flex-col gap-2 mb-2">
					<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'mobileImg')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
					<input type="text" bind:value={adsConfig.mobileImg} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
				</div>
				{#if adsConfig.mobileImg}<img src={adsConfig.mobileImg} class="mt-2 rounded h-20 object-contain bg-[#141414] border border-[#333333]" />{/if}
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Desktop Image (728x90)</label>
				<div class="flex flex-col gap-2 mb-2">
					<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'desktopImg')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
					<input type="text" bind:value={adsConfig.desktopImg} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
				</div>
				{#if adsConfig.desktopImg}<img src={adsConfig.desktopImg} class="mt-2 rounded h-20 object-contain bg-[#141414] border border-[#333333]" />{/if}
			</div>
		</div>

		<h2 class="text-xl font-semibold text-white pt-4 border-t border-[#333333]">Alternative Ad</h2>
		<p class="text-[#9ca3af] text-sm -mt-2">Shown interchangeably or in sidebars</p>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Mobile Image (320x100)</label>
				<div class="flex flex-col gap-2 mb-2">
					<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'mobileImgAlt')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
					<input type="text" bind:value={adsConfig.mobileImgAlt} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
				</div>
				{#if adsConfig.mobileImgAlt}<img src={adsConfig.mobileImgAlt} class="mt-2 rounded h-20 object-contain bg-[#141414] border border-[#333333]" />{/if}
			</div>
			<div>
				<label class="block text-sm font-semibold text-white mb-2">Desktop Image (728x90)</label>
				<div class="flex flex-col gap-2 mb-2">
					<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'desktopImgAlt')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
					<input type="text" bind:value={adsConfig.desktopImgAlt} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
				</div>
				{#if adsConfig.desktopImgAlt}<img src={adsConfig.desktopImgAlt} class="mt-2 rounded h-20 object-contain bg-[#141414] border border-[#333333]" />{/if}
			</div>
		</div>

		<h2 class="text-xl font-semibold text-white pt-4 border-t border-[#333333]">Sidebar Ads</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Book Ad -->
			<div class="space-y-4">
				<h3 class="font-medium text-white border-b border-[#333333] pb-2">Book Ad</h3>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Image</label>
					<div class="flex flex-col gap-2 mb-2">
						<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'bookAdImg')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
						<input type="text" bind:value={adsConfig.bookAdImg} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
					</div>
					{#if adsConfig.bookAdImg}<img src={adsConfig.bookAdImg} class="mt-2 rounded h-24 object-contain bg-[#141414] border border-[#333333]" />{/if}
				</div>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Target URL</label>
					<input type="text" bind:value={adsConfig.bookAdUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
				</div>
			</div>

			<!-- Rate Card -->
			<div class="space-y-4">
				<h3 class="font-medium text-white border-b border-[#333333] pb-2">Rate Card</h3>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Image</label>
					<div class="flex flex-col gap-2 mb-2">
						<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'rateCardImg')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
						<input type="text" bind:value={adsConfig.rateCardImg} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
					</div>
					{#if adsConfig.rateCardImg}<img src={adsConfig.rateCardImg} class="mt-2 rounded h-24 object-contain bg-[#141414] border border-[#333333]" />{/if}
				</div>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Target URL</label>
					<input type="text" bind:value={adsConfig.rateCardUrl} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
				</div>
			</div>

			<!-- Sidebar Ad 1 -->
			<div class="space-y-4">
				<h3 class="font-medium text-white border-b border-[#333333] pb-2">Featured Ad 1</h3>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Image</label>
					<div class="flex flex-col gap-2 mb-2">
						<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'sidebarAd1Img')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
						<input type="text" bind:value={adsConfig.sidebarAd1Img} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
					</div>
					{#if adsConfig.sidebarAd1Img}<img src={adsConfig.sidebarAd1Img} class="mt-2 rounded h-24 object-contain bg-[#141414] border border-[#333333]" />{/if}
				</div>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Target URL</label>
					<input type="text" bind:value={adsConfig.sidebarAd1Url} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
				</div>
			</div>

			<!-- Sidebar Ad 2 -->
			<div class="space-y-4">
				<h3 class="font-medium text-white border-b border-[#333333] pb-2">Featured Ad 2</h3>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Image</label>
					<div class="flex flex-col gap-2 mb-2">
						<input type="file" accept="image/*" onchange={(e) => handleFileUpload(e, 'sidebarAd2Img')} class="w-full text-sm text-[#9ca3af] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#333333] file:text-white hover:file:bg-[#2a2a2a]" />
						<input type="text" bind:value={adsConfig.sidebarAd2Img} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white text-xs" placeholder="Or enter URL directly" />
					</div>
					{#if adsConfig.sidebarAd2Img}<img src={adsConfig.sidebarAd2Img} class="mt-2 rounded h-24 object-contain bg-[#141414] border border-[#333333]" />{/if}
				</div>
				<div>
					<label class="block text-sm font-semibold text-white mb-2">Target URL</label>
					<input type="text" bind:value={adsConfig.sidebarAd2Url} class="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333333] rounded-md text-white" />
				</div>
			</div>
		</div>
	</div>
</div>
