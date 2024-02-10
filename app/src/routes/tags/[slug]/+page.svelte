<script lang="ts">
	import Card from '../../../components/Card.svelte';

	export let data;

	const posts = data.props.posts;
	console.log(posts);
</script>

<h2>
	Tags for "{data.props.slug}"
</h2>

{#each posts as post}
	<Card {post} />
{/each}

<style>
	h2 {
		text-align: center;
		padding: 1rem 0;
	}
</style>
