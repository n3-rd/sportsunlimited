<script lang="ts">
	import Card from '../../../components/Card.svelte';

	export let data;

	const posts = data.props.posts;
	console.log(posts);
</script>

{#each posts as post}
	<Card {post} />
{/each}
