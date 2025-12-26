<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { FileText, Menu, X, Download } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/posts', label: 'Posts', icon: FileText },
		{ href: '/import', label: 'Import', icon: Download }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Close mobile menu when route changes
	$effect(() => {
		if ($page.url) {
			mobileMenuOpen = false;
		}
	});
</script>

<div class="flex h-screen bg-[#0a0a0a] text-white">
	<!-- Mobile Menu Overlay -->
	{#if mobileMenuOpen}
		<div
			class="fixed inset-0 bg-black/80 z-40 lg:hidden"
			onclick={toggleMobileMenu}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Escape' && toggleMobileMenu()}
			aria-label="Close menu"
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-[#333333] transform transition-transform duration-300 ease-in-out lg:translate-x-0 {mobileMenuOpen
			? 'translate-x-0'
			: '-translate-x-full lg:translate-x-0'}"
	>
		<div class="flex items-center justify-between p-6 border-b border-[#333333]">
			<h1 class="text-xl font-bold text-white">Studio</h1>
			<button
				type="button"
				onclick={toggleMobileMenu}
				class="lg:hidden p-2 rounded-md text-[#d1d5db] hover:bg-[#1f1f1f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#141414]"
				aria-label="Close menu"
			>
				<X class="h-5 w-5" />
			</button>
		</div>
		<nav class="px-4 py-4 space-y-1" role="navigation" aria-label="Main navigation">
			{#each navItems as item}
				{@const Icon = item.icon}
				{@const isActive = $page.url.pathname === item.href || ($page.url.pathname === '/' && item.href === '/posts')}
				<a
					href={item.href}
					class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 {isActive
						? 'bg-[#1f1f1f] text-white shadow-sm'
						: 'text-[#d1d5db] hover:bg-[#1f1f1f] hover:text-white'}"
					aria-current={isActive ? 'page' : undefined}
				>
					<Icon class="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto bg-[#0a0a0a]">
		<!-- Mobile Menu Button -->
		<div class="lg:hidden sticky top-0 z-30 bg-[#141414] border-b border-[#333333] px-4 py-3">
			<button
				type="button"
				onclick={toggleMobileMenu}
				class="p-2 rounded-md text-[#d1d5db] hover:bg-[#1f1f1f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2"
				aria-label="Open menu"
			>
				<Menu class="h-6 w-6" />
			</button>
		</div>
		<div class="p-4 sm:p-6 lg:p-8">
			{@render children()}
		</div>
	</main>
</div>
