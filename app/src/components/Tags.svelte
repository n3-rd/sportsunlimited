<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

    interface Props {
        tags: string[];
    }

    let { tags }: Props = $props();
</script>

{#if tags?.length}
<nav class="post__tags flex flex-row flex-wrap items-center gap-2 md:gap-3" aria-label="Category tags">
    {#each tags as tag}
        <a href={`/tags/${tag}`} class="tag-link group">
            <span class="inline-block px-4 py-2 rounded-full bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white font-semibold text-sm transition-all duration-200 border border-gray-200 hover:border-red-600">
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
</style>