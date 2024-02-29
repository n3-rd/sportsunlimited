<script lang="ts">
	import Card from '../../../components/Card.svelte';
	import { onDestroy } from 'svelte';
	import PostThumbs from '../../../components/PostThumbs.svelte';

	export let data;

	let posts: string | any[];
	posts = data.props.posts; // make posts reactive

	posts = posts.slice(8);

let displayCount = 8; // Initial number of posts to display

function loadMore() {
	displayCount += 8; // Load 8 more posts each time
}

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
	<h1 class="text-3xl font-bold text-center py-5">
		Tags for "{data.props.slug}"
	</h1>

    <div class="post-thumbs grid grid-cols-1 md:grid-cols-2 ">
<PostThumbs  posts={posts.slice(0, displayCount)}/>
</div>
{#if posts.length > displayCount}
<button on:click={loadMore}>Load More</button>
{/if}
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
