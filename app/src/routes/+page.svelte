<script lang="ts">
	import Card from '../components/Card.svelte';
	import Welcome from '../components/Welcome.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<section>
	{#if data.tags?.length}
		<p class="post__tags">
			{#each data.tags as tag}
				<a href={`/tags/${tag}`} class="post__tag">{tag}</a>
			{/each}
		</p>
	{/if}

	{#if data.posts?.length}
		{#each data.posts as post}
			<Card {post} />
		{/each}
	{:else}
		<Welcome />
	{/if}
</section>
