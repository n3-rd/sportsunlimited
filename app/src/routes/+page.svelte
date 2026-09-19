<script lang="ts">
	import SEO from '../components/SEO.svelte';
	import type { PageData } from './$types';
	import type { Post } from '$lib/types';
	import {
		EDITION_THEMES,
		curateEditionLayout,
		type EditionTheme
	} from '$lib/utils/editions';
	import EditionsTicker from '../components/editions/EditionsTicker.svelte';
	import EditionsMasthead from '../components/editions/EditionsMasthead.svelte';
	import CoverHero from '../components/editions/CoverHero.svelte';
	import SpotlightStack from '../components/editions/SpotlightStack.svelte';
	import BroadsheetGrid from '../components/editions/BroadsheetGrid.svelte';
	import ScorecardWire from '../components/editions/ScorecardWire.svelte';
	import SplitReader from '../components/editions/SplitReader.svelte';
	import EditionArchiveDrawer from '../components/editions/EditionArchiveDrawer.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Primary interactive state
	let selectedEditionId = $state(data.editions?.[0]?.id || '');
	let selectedCategory = $state('All');
	let activeReaderPost = $state<Post | null>(null);
	let isArchiveOpen = $state(false);

	// Currently active weekly edition
	const activeEdition = $derived.by(() => {
		const found = data.editions?.find(e => e.id === selectedEditionId);
		return found || data.editions?.[0];
	});

	const activeEditionIndex = $derived.by(() => {
		if (!data.editions || !activeEdition) return 0;
		return data.editions.findIndex(e => e.id === activeEdition.id);
	});

	const prevEdition = $derived.by(() => {
		if (!data.editions || activeEditionIndex >= data.editions.length - 1) return null;
		return data.editions[activeEditionIndex + 1];
	});

	const nextEdition = $derived.by(() => {
		if (!data.editions || activeEditionIndex <= 0) return null;
		return data.editions[activeEditionIndex - 1];
	});

	// Dynamic theme calculated for current edition
	const activeTheme: EditionTheme = $derived.by(() => {
		return activeEdition?.theme || EDITION_THEMES['house-of-heat'];
	});

	// Filtered posts based on category
	const filteredPosts = $derived.by(() => {
		if (!activeEdition?.posts) return [];
		if (selectedCategory === 'All') return activeEdition.posts;
		return activeEdition.posts.filter(p =>
			p.tags?.some(t => t.toLowerCase() === selectedCategory.toLowerCase())
		);
	});

	// Curated layout positions
	const curatedLayout = $derived.by(() => {
		if (selectedCategory === 'All' && activeEdition?.curated) {
			return activeEdition.curated;
		}
		return curateEditionLayout(filteredPosts);
	});

	// Popular categories for navigation
	const popularCategories = $derived.by(() => {
		return ['Football', 'Nigeria League', 'Basketball', 'Athletics', 'Feature', 'Interview'];
	});

	function handleSelectEdition(editionId: string) {
		selectedEditionId = editionId;
		selectedCategory = 'All';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleSelectCategory(cat: string) {
		selectedCategory = cat;
	}

	const seoData = $derived({
		title: activeEdition
			? `Sports Unlimited // ${activeEdition.weekLabel} (${activeEdition.dateRange})`
			: 'Sports Unlimited - Editions',
		description: activeEdition
			? `Read ${activeEdition.weekLabel} of Sports Unlimited: ${activeEdition.totalPosts} curated stories on Nigerian athletics, football, basketball and sports culture.`
			: 'The weekly curated sports gazette.',
		keywords: 'Sports Unlimited Editions, Nigerian sports, NPFL, Football, Super Eagles, Basketball, Athletics',
		image: curatedLayout?.coverHero?.mainImage?.asset?.url || 'https://i.postimg.cc/CLVXPt7j/SU.png'
	});
</script>

<SEO {...seoData} />

{#if activeEdition}
	<div
		class="editions-page min-h-screen transition-colors duration-500 selection:bg-black selection:text-white"
		style="background-color: {activeTheme.paperBg}; color: {activeTheme.paperText};"
	>
		<!-- 1. Electric Marquee Ticker (Inspo 1 House of Heat) -->
		<EditionsTicker
			edition={activeEdition}
			theme={activeTheme}
			onOpenArchives={() => (isArchiveOpen = true)}
		/>

		<!-- 2. Colossal Masthead & Navigation -->
		<EditionsMasthead
			edition={activeEdition}
			editionsList={data.editions || []}
			selectedThemeId={activeTheme.id}
			{selectedCategory}
			categories={popularCategories}
			onSelectEdition={handleSelectEdition}
			onSelectCategory={handleSelectCategory}
			onOpenArchives={() => (isArchiveOpen = true)}
		/>

		<!-- 3. Main Editorial Stage -->
		<main class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
			<!-- Visual Stage: Cover Hero (Left) + Spotlight Stack (Right) -->
			<section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
				<!-- Cover Hero (7 columns) -->
				<div class="lg:col-span-7 xl:col-span-8 flex flex-col">
					<CoverHero
						post={curatedLayout.coverHero}
						theme={activeTheme}
						onOpenReader={(p) => (activeReaderPost = p)}
					/>
				</div>

				<!-- Spotlight Stack (5 columns) -->
				<div class="lg:col-span-5 xl:col-span-4 flex flex-col">
					<SpotlightStack
						postTop={curatedLayout.spotlightTop}
						postBottom={curatedLayout.spotlightBottom}
						theme={activeTheme}
						onOpenReader={(p) => (activeReaderPost = p)}
					/>
				</div>
			</section>

			<!-- 4. The Weekly Broadsheet: 3-Column Newspaper Layout (Inspo 3 The Free Press) -->
			<BroadsheetGrid
				col1={curatedLayout.broadsheetCol1}
				col2={curatedLayout.broadsheetCol2}
				col3={curatedLayout.broadsheetCol3}
				theme={activeTheme}
				onOpenReader={(p) => (activeReaderPost = p)}
			/>

			<!-- 5. Fast Wire & Scorecard -->
			<ScorecardWire
				briefs={curatedLayout.scorecardBriefs}
				theme={activeTheme}
				onOpenReader={(p) => (activeReaderPost = p)}
			/>

			<!-- 6. Issue Navigation Bar (Pagination Between Weekly Editions) -->
			<nav
				class="edition-pagination mt-16 pt-8 pb-12 border-t-2 border-black/80 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs uppercase"
				aria-label="Edition Navigation"
			>
				<div>
					{#if prevEdition}
						<button
							type="button"
							onclick={() => handleSelectEdition(prevEdition.id)}
							class="group flex items-center gap-2 text-zinc-600 hover:text-black transition-colors"
						>
							<span class="text-base group-hover:-translate-x-1 transition-transform">←</span>
							<span>PREVIOUS ISSUE: <strong>{prevEdition.weekLabel}</strong> ({prevEdition.dateRange})</span>
						</button>
					{:else}
						<span class="text-zinc-400">OLDEST ARCHIVE ISSUE REACHED</span>
					{/if}
				</div>

				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={() => (isArchiveOpen = true)}
						class="px-4 py-2 rounded-full border border-black/20 bg-white hover:bg-black hover:text-white transition-all font-bold tracking-wider"
					>
						BROWSE ALL EDITIONS ↗
					</button>
				</div>

				<div>
					{#if nextEdition}
						<button
							type="button"
							onclick={() => handleSelectEdition(nextEdition.id)}
							class="group flex items-center gap-2 text-zinc-600 hover:text-black transition-colors"
						>
							<span>NEXT ISSUE: <strong>{nextEdition.weekLabel}</strong> ({nextEdition.dateRange})</span>
							<span class="text-base group-hover:translate-x-1 transition-transform">→</span>
						</button>
					{:else}
						<span class="text-emerald-700 font-bold">CURRENT ISSUE ACTIVE</span>
					{/if}
				</div>
			</nav>
		</main>

		<!-- Split Reader Modal (Inspo 2 House of Heat) -->
		{#if activeReaderPost}
			<SplitReader
				post={activeReaderPost}
				theme={activeTheme}
				onClose={() => (activeReaderPost = null)}
			/>
		{/if}

		<!-- Edition Archive Drawer -->
		<EditionArchiveDrawer
			isOpen={isArchiveOpen}
			currentEditionId={activeEdition.id}
			editions={data.editions || []}
			onSelectEdition={handleSelectEdition}
			onClose={() => (isArchiveOpen = false)}
		/>
	</div>
{:else}
	<!-- Empty State -->
	<div class="min-h-screen flex items-center justify-center p-8 bg-zinc-100 text-center font-mono">
		<div>
			<h2 class="text-2xl font-bold mb-2">No Editions Found</h2>
			<p class="text-zinc-500">Checking data stream...</p>
		</div>
	</div>
{/if}
