<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { LayoutDashboard, FileText, Settings } from 'lucide-svelte';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/posts', label: 'Posts', icon: FileText },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];
</script>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<aside class="w-64 bg-white border-r border-gray-200">
		<div class="p-6">
			<h1 class="text-xl font-bold text-gray-900">Studio</h1>
		</div>
		<nav class="px-4 space-y-1">
			{#each navItems as item}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                    {$page.url.pathname === item.href
						? 'bg-gray-100 text-gray-900'
						: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
				>
					<Icon class="mr-3 h-5 w-5" />
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		<div class="p-8">
			{@render children()}
		</div>
	</main>
</div>
