<script lang="ts">
	import Card from '../../../components/Card.svelte';
	import { onDestroy } from 'svelte';

	export let data;

	let posts;
	$: posts = data.props.posts; // make posts reactive
	console.log(posts);

	onDestroy(() => {
		console.log('destroyed');
		posts = [];
	});
</script>

{#if posts.length === 0}
	<div class="no-tags">
		<h2>
			No post tagged as "{data.props.slug}" found.
		</h2>
	</div>
{:else}
	<h2>
		Tags for "{data.props.slug}"
	</h2>

	{#each posts as post}
		<Card {post} />
	{/each}
{/if}

<style>
	h2 {
		text-align: center;
		padding: 1rem 0;
	}
	.no-tags {
		height: 80vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
