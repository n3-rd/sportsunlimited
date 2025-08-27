<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";

    interface Props {
        tags: string[];
    }

    let { tags }: Props = $props();
console.log('tags',tags);
</script>

{#if tags?.length}
<div class="post__tags flex flex-row flex-wrap items-center gap-2 py-4">
    {#each tags as tag}
    <Button>
        <h2>
            <a href={`/tags/${tag}`} class="post__tag">{tag}</a>
        </h2>
    </Button>
    
    {/each}
</div>
{/if}