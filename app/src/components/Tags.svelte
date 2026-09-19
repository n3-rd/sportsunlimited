<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

    interface Props {
        tags: string[];
    }

    let { tags }: Props = $props();
</script>

{#if tags?.length}
<nav class="post__tags flex flex-row items-center gap-2 overflow-x-auto py-1 no-scrollbar" aria-label="Category tags">
	<a href="/" class="tag-link group flex-shrink-0">
		<span class="inline-flex items-center px-3.5 py-1.5 rounded-full bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-sm">
			All
		</span>
	</a>
	{#each tags as tag}
		<a href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} class="tag-link group flex-shrink-0">
			<span class="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-zinc-950 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:scale-95">
				{tag}
			</span>
		</a>
	{/each}
</nav>
{/if}

<style>
	.tag-link {
		text-decoration: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>