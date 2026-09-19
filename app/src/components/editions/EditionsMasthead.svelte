<script lang="ts">
	import type { EditionTheme, WeeklyEdition } from '$lib/utils/editions';
	import { EDITION_THEMES } from '$lib/utils/editions';

	interface Props {
		edition: WeeklyEdition;
		editionsList: WeeklyEdition[];
		selectedThemeId: string;
		selectedCategory: string;
		categories: string[];
		onSelectEdition: (editionId: string) => void;
		onSelectCategory: (category: string) => void;
		onOpenArchives: () => void;
	}

	let {
		edition,
		editionsList,
		selectedThemeId,
		selectedCategory,
		categories,
		onSelectEdition,
		onSelectCategory,
		onOpenArchives
	}: Props = $props();

	let isEditionMenuOpen = $state(false);

	const activeTheme = $derived(EDITION_THEMES[selectedThemeId] || edition.theme);
</script>

<header class="editions-masthead border-b border-black/10 bg-inherit transition-colors duration-300">
	<!-- Top Utility Bar: Edition info, date, quick jump, palette mood -->
	<div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-black/5">
		<!-- Left: Issue Volume & Date -->
		<div class="flex items-center gap-3">
			<span class="font-bold tracking-wider text-black">
				VOL. {edition.year} // {edition.weekLabel.toUpperCase()}
			</span>
			<span class="text-zinc-300">•</span>
			<span class="text-zinc-500 uppercase">
				{edition.dateRange}
			</span>
			<span class="hidden md:inline text-zinc-300">•</span>
			<span class="hidden md:inline px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest" style="background-color: {activeTheme.accentMuted}; color: {activeTheme.accent}">
				{edition.totalPosts} ARTICLES THIS WEEK
			</span>
		</div>

		<!-- Right: Controls for Edition Switcher & Colorways -->
		<div class="flex items-center gap-2 sm:gap-3 ml-auto">
			<!-- Edition Selector Dropdown -->
			<div class="relative">
				<button
					type="button"
					onclick={() => {
						isEditionMenuOpen = !isEditionMenuOpen;
						isThemeMenuOpen = false;
					}}
					class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black/15 bg-white/70 hover:bg-white text-zinc-800 text-[11px] font-mono tracking-tight font-medium transition-all shadow-sm"
				>
					<span>Browse Issue: <strong class="text-black">#{edition.editionNumber}</strong></span>
					<svg class="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{#if isEditionMenuOpen}
					<!-- Dropdown menu -->
					<div
						class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
					>
						<div class="px-3 py-1.5 border-b border-zinc-100 flex items-center justify-between text-[10px] font-mono uppercase text-zinc-400">
							<span>Select Weekly Edition</span>
							<button type="button" onclick={onOpenArchives} class="text-blue-600 hover:underline">Full Index</button>
						</div>
						<div class="max-h-64 overflow-y-auto py-1">
							{#each editionsList as item}
								<button
									type="button"
									onclick={() => {
										onSelectEdition(item.id);
										isEditionMenuOpen = false;
									}}
									class="w-full text-left px-3.5 py-2 hover:bg-zinc-50 flex items-center justify-between text-xs transition-colors {item.id === edition.id ? 'bg-zinc-100 font-bold' : ''}"
								>
									<div>
										<div class="font-sans font-semibold text-zinc-900 flex items-center gap-2">
											<span>{item.weekLabel}</span>
											{#if item.isCurrent}
												<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold uppercase">Latest</span>
											{/if}
										</div>
										<div class="text-[10px] font-mono text-zinc-500 mt-0.5">{item.dateRange}</div>
									</div>
									<span class="text-[11px] font-mono text-zinc-400">{item.totalPosts} stories</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Main Colossal Masthead (House of Heat aesthetic) -->
	<div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<!-- Colossal Title -->
			<div>
				<div class="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
					<span class="inline-block w-2 h-2 rounded-full" style="background-color: {activeTheme.accent}"></span>
					<span>Sports Unlimited</span>
					<span class="text-zinc-300">/</span>
					<span class="font-bold text-zinc-900">Editions</span>
				</div>
				<h1
					class="text-[44px] sm:text-[72px] md:text-[96px] lg:text-[116px] leading-[0.88] font-black tracking-tighter text-zinc-950 font-display transition-colors select-none"
				>
					•Sports Unlimited°
				</h1>
			</div>

			<!-- Issue Tagline & Micro Stats (Free Press aesthetic) -->
			<div class="md:max-w-xs text-left md:text-right flex flex-col justify-end">
				<p class="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
					{activeTheme.tagline}
				</p>
				<p class="font-serif italic text-zinc-700 text-sm leading-snug">
					"The uncompromised weekly gazette of Nigerian athletics, African football, and high sport culture."
				</p>
			</div>
		</div>
	</div>

	<!-- Sub-navigation: Category Filter Pills -->
	<div class="border-t border-black/10 bg-white/40 backdrop-blur-sm">
		<div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2.5 gap-3 scrollbar-none">
			<div class="flex items-center gap-1.5">
				<button
					type="button"
					onclick={() => onSelectCategory('All')}
					class="px-3.5 py-1 text-xs font-mono uppercase tracking-wider font-semibold rounded-full transition-all duration-200 {selectedCategory === 'All' ? 'text-white shadow-sm' : 'text-zinc-600 hover:text-black hover:bg-black/5'}"
					style={selectedCategory === 'All' ? `background-color: ${activeTheme.accent}` : ''}
				>
					All Stories
				</button>
				{#each categories as cat}
					<button
						type="button"
						onclick={() => onSelectCategory(cat)}
						class="px-3 py-1 text-xs font-mono uppercase tracking-wider font-semibold rounded-full transition-all duration-200 {selectedCategory === cat ? 'text-white shadow-sm' : 'text-zinc-600 hover:text-black hover:bg-black/5'}"
						style={selectedCategory === cat ? `background-color: ${activeTheme.accent}` : ''}
					>
						{cat}
					</button>
				{/each}
			</div>

			<div class="hidden lg:flex items-center gap-3 text-xs font-mono text-zinc-500 shrink-0">
				<span>EDITION {edition.editionNumber} OF {edition.year}</span>
				<span class="text-zinc-300">|</span>
				<a href="/npfl" class="hover:text-black font-semibold uppercase tracking-wider transition-colors">NPFL Hub →</a>
			</div>
		</div>
	</div>
</header>
