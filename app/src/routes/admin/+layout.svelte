<script lang="ts">
	import { page } from '$app/stores';
	import { FileText, LayoutDashboard, Settings as SettingsIcon, Image } from 'lucide-svelte';

	let { children } = $props();
</script>

<div class="flex h-screen bg-[#0a0a0a] text-white">
	<!-- Sidebar -->
	<div class="w-64 bg-[#141414] border-r border-[#333333] p-4 flex flex-col gap-4">
		<h1 class="text-xl font-bold px-2 py-4 border-b border-[#333333]">CMS Admin</h1>
		
		<nav class="flex-1 space-y-1">
			<a href="/admin/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-md {$page.url.pathname === '/admin/dashboard' ? 'bg-[#3b82f6] text-white' : 'text-[#d1d5db] hover:bg-[#2a2a2a]'}">
				<LayoutDashboard class="w-5 h-5" />
				Dashboard
			</a>
			<a href="/admin/posts" class="flex items-center gap-3 px-3 py-2 rounded-md {$page.url.pathname.includes('/admin/posts') ? 'bg-[#3b82f6] text-white' : 'text-[#d1d5db] hover:bg-[#2a2a2a]'}">
				<FileText class="w-5 h-5" />
				Posts
			</a>
			<a href="/admin/ads" class="flex items-center gap-3 px-3 py-2 rounded-md {$page.url.pathname.includes('/admin/ads') ? 'bg-[#3b82f6] text-white' : 'text-[#d1d5db] hover:bg-[#2a2a2a]'}">
				<Image class="w-5 h-5" />
				Ads
			</a>
			<a href="/admin/settings" class="flex items-center gap-3 px-3 py-2 rounded-md {$page.url.pathname.includes('/admin/settings') ? 'bg-[#3b82f6] text-white' : 'text-[#d1d5db] hover:bg-[#2a2a2a]'}">
				<SettingsIcon class="w-5 h-5" />
				Settings
			</a>
		</nav>
	</div>

	<!-- Main Content -->
	<div class="flex-1 overflow-auto">
		{@render children()}
	</div>
</div>
