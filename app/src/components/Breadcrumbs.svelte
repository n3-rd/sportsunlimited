<script lang="ts">
	import { generateBreadcrumbStructuredData } from '$lib/utils/seo';

	interface BreadcrumbItem {
		name: string;
		url: string;
	}

	interface Props {
		items: BreadcrumbItem[];
	}

	let { items }: Props = $props();

	const structuredData = generateBreadcrumbStructuredData(items);
</script>

<nav class="breadcrumbs py-4 bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
	<div class="container max-w-6xl mx-auto px-4">
		<ol class="flex flex-wrap items-center gap-2 text-sm">
			{#each items as item, index}
				<li class="flex items-center">
					{#if index < items.length - 1}
						<a 
							href={item.url} 
							class="text-gray-600 hover:text-gray-900 transition-colors"
						>
							{item.name}
						</a>
						<span class="mx-2 text-gray-400">/</span>
					{:else}
						<span class="text-gray-900 font-medium" aria-current="page">
							{item.name}
						</span>
					{/if}
				</li>
			{/each}
		</ol>
	</div>
</nav>

{@html structuredData}



