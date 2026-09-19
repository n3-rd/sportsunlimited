<script lang="ts">
	import type { Post } from '$lib/types';
	import type { EditionTheme } from '$lib/utils/editions';
	import { formatDate } from '$lib/utils/index';

	interface Props {
		briefs: Post[];
		theme: EditionTheme;
		onOpenReader: (post: Post) => void;
	}

	let { briefs, theme, onOpenReader }: Props = $props();
</script>

{#if briefs && briefs.length > 0}
	<section class="scorecard-wire mt-12 pt-8 border-t border-black/15">
		<div class="flex items-center justify-between gap-4 mb-6">
			<div class="flex items-center gap-3">
				<span class="inline-block w-2.5 h-2.5 rounded-full" style="background-color: {theme.accent}"></span>
				<h4 class="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-zinc-950">
					The Weekly Wire & Scorecard
				</h4>
			</div>
			<span class="text-xs font-mono uppercase tracking-wider text-zinc-500">
				{briefs.length} QUICK BRIEFS
			</span>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each briefs as post}
				<div
					class="p-4 rounded-xl border border-black/10 bg-white/60 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
				>
					<div>
						<div class="flex items-center justify-between gap-2 text-[10px] font-mono text-zinc-400 mb-1.5 uppercase">
							<span class="font-bold text-zinc-700">{(post.tags && post.tags[0]) || 'Sports'}</span>
							<span>{formatDate(post._createdAt)}</span>
						</div>
						<a
							href={`/post/${post.slug?.current}`}
							class="text-sm font-bold font-sans text-zinc-900 hover:text-blue-900 leading-snug line-clamp-2 block mb-2"
						>
							{post.title}
						</a>
					</div>

					<div class="flex items-center justify-between pt-2 border-t border-black/5 text-[10px] font-mono">
						<button
							type="button"
							onclick={() => onOpenReader(post)}
							class="text-zinc-600 hover:text-black font-bold uppercase tracking-wider hover:underline"
						>
							Quick Read ↗
						</button>
						<a href={`/post/${post.slug?.current}`} class="text-zinc-400 hover:text-zinc-700">
							Full Page →
						</a>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}
