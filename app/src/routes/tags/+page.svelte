<script lang="ts">
    export let data;
    console.log(data);

    const tagCounts = data.tagCounts
</script>


{#if tagCounts?.size}
    {#each Array.from(tagCounts) as [tag, count]}
        <h2
        class="text-3xl font-bold text-center py-5 hover:text-blue-500"
        >
            <a href={`/tags/${tag}`} class="post__tag">{tag} ({count} posts)</a>
        </h2>
    {/each}
{/if}
