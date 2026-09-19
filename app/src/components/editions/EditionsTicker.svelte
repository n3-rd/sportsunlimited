<script lang="ts">
	import type { EditionTheme, WeeklyEdition } from '$lib/utils/editions';

	interface Props {
		edition: WeeklyEdition;
		theme: EditionTheme;
		onOpenArchives?: () => void;
	}

	let { edition, theme, onOpenArchives }: Props = $props();

	// Curate ticker items from edition posts
	const tickerItems = $derived.by(() => {
		const items = [
			`EDITION #${edition.editionNumber} NOW LIVE • ${edition.dateRange.toUpperCase()}`,
			...edition.posts.slice(0, 8).map(p => `• ${p.title?.toUpperCase() || 'BREAKING SPORTS UPDATE'}`),
			`• NPFL SEASON UPDATES & CONTINENTAL HIGHLIGHTS • SPORTS UNLIMITED ARCHIVE`
		];
		return items;
	});
</script>

<div
	class="editions-ticker w-full overflow-hidden text-xs font-mono tracking-wider transition-colors duration-500 relative z-30"
	style="background-color: {theme.tickerBg}; color: {theme.tickerText}; border-bottom: 1px solid rgba(255,255,255,0.12);"
>
	<div class="flex items-center justify-between h-9 px-3 sm:px-6">
		<!-- Live Edition Badge -->
		<div class="flex items-center gap-2 pr-3 shrink-0 border-r border-white/15 mr-3">
			<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
			<span class="font-bold tracking-widest text-[11px] uppercase">
				{edition.isCurrent ? 'LATEST ISSUE' : `ISSUE #${edition.editionNumber}`}
			</span>
		</div>

		<!-- Ticker Marquee -->
		<div class="ticker-viewport flex-1 overflow-hidden whitespace-nowrap relative mask-edges">
			<div class="ticker-track inline-flex items-center gap-8 animate-marquee font-medium">
				{#each tickerItems as item, idx}
					<span class="inline-flex items-center gap-2">
						{item}
					</span>
				{/each}
				<!-- Duplicate for seamless infinite scroll -->
				{#each tickerItems as item, idx}
					<span class="inline-flex items-center gap-2 opacity-90" aria-hidden="true">
						{item}
					</span>
				{/each}
			</div>
		</div>

		<!-- Action CTA Pill -->
		<div class="pl-3 shrink-0 border-l border-white/15 ml-3">
			<button
				type="button"
				onclick={onOpenArchives}
				class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-bold rounded border border-white/40 hover:bg-white hover:text-black transition-all duration-200"
			>
				Editions Index
			</button>
		</div>
	</div>
</div>

<style>
	.mask-edges {
		mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent);
	}

	.animate-marquee {
		display: inline-flex;
		white-space: nowrap;
		animation: tickerScroll 42s linear infinite;
	}

	.ticker-track:hover {
		animation-play-state: paused;
	}

	@keyframes tickerScroll {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
