<script lang="ts">
	import type { WeeklyEdition } from '$lib/utils/editions';
	import { urlFor } from '$lib/utils/image';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		currentEditionId: string;
		editions: WeeklyEdition[];
		onSelectEdition: (editionId: string) => void;
		onClose: () => void;
	}

	let { isOpen, currentEditionId, editions, onSelectEdition, onClose }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-[110] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-label="Editions Archive Index"
	>
		<!-- Backdrop click to close -->
		<button
			type="button"
			class="absolute inset-0 cursor-default"
			onclick={onClose}
			aria-label="Close archive drawer"
		></button>

		<!-- Drawer Panel -->
		<div
			class="relative w-full max-w-md h-full bg-zinc-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-l border-white/15 shadow-2xl z-10 animate-in slide-in-from-right duration-300"
		>
			<div>
				<!-- Drawer Header -->
				<div class="flex items-center justify-between pb-6 mb-6 border-b border-white/15">
					<div>
						<span class="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-1">
							CHRONOLOGICAL ARCHIVE
						</span>
						<h3 class="text-2xl font-black font-display tracking-tight text-white uppercase">
							Editions Index
						</h3>
					</div>

					<button
						type="button"
						onclick={onClose}
						class="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center font-bold transition-colors"
						aria-label="Close drawer"
					>
						✕
					</button>
				</div>

				<p class="text-xs font-mono text-zinc-400 mb-6 leading-relaxed">
					Each edition is curated weekly with dedicated visual lead coverage, deep analytical broadsheets, and live news briefs.
				</p>

				<!-- Editions List -->
				<div class="space-y-4">
					{#each editions as item}
						{@const isSelected = item.id === currentEditionId}
						{@const heroImg = item.curated?.coverHero?.mainImage ? urlFor(item.curated.coverHero.mainImage).width(300).quality(80).url() : ''}
						<button
							type="button"
							onclick={() => {
								onSelectEdition(item.id);
								onClose();
							}}
							class="w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex gap-4 items-center group {isSelected ? 'bg-white text-black border-white shadow-lg' : 'bg-zinc-900/80 hover:bg-zinc-800/80 text-white border-white/10'}"
						>
							<!-- Thumbnail -->
							<div class="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border {isSelected ? 'border-black/20' : 'border-white/15'}">
								{#if heroImg}
									<img src={heroImg} alt={item.weekLabel} class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
								{:else}
									<div class="w-full h-full bg-zinc-800 flex items-center justify-center text-xs font-mono font-bold">
										#{item.editionNumber}
									</div>
								{/if}
							</div>

							<!-- Details -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<span class="font-display font-black text-base tracking-tight">
										{item.weekLabel}
									</span>
									{#if item.isCurrent}
										<span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider {isSelected ? 'bg-black text-white' : 'bg-emerald-400 text-black'}">
											Current
										</span>
									{/if}
								</div>
								<div class="text-[11px] font-mono {isSelected ? 'text-zinc-600' : 'text-zinc-400'} truncate">
									{item.dateRange}
								</div>
								<div class="text-[10px] font-mono mt-1 {isSelected ? 'text-zinc-500' : 'text-zinc-500'}">
									{item.totalPosts} articles • Lead: {item.primaryTag}
								</div>
							</div>

							<!-- Arrow indicator -->
							<span class="text-sm font-bold opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
								→
							</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Drawer Footer -->
			<div class="pt-6 mt-8 border-t border-white/15 text-center text-xs font-mono text-zinc-500">
				<span>SPORTS UNLIMITED // EDITIONS ENGINE</span>
			</div>
		</div>
	</div>
{/if}
