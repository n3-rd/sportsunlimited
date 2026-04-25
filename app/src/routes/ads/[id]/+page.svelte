<script lang="ts">
    import snarkdown from 'snarkdown';
    import SEO from '../../../components/SEO.svelte';

    let { data } = $props();
    
    const html = $derived(snarkdown(data.content));
</script>

<SEO 
    title={`Advertisement | ${data.id}`}
    description="Check out this special offer from our partners."
/>

<div class="container mx-auto px-4 py-12 max-w-3xl">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Header Decoration -->
        <div class="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 w-full"></div>
        
        <div class="p-8 md:p-12">
            <div class="prose prose-red max-w-none prose-headings:font-bold prose-a:text-red-600 prose-strong:text-gray-900">
                {@html html}
            </div>
            
            <div class="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Advertisement</span>
                <a href="/" class="text-red-600 font-semibold hover:underline">Back to Sports Unlimited</a>
            </div>
        </div>
    </div>
</div>

<style>
    :global(.prose h1) {
        @apply text-4xl font-black text-gray-900 mb-8;
    }
    :global(.prose h2) {
        @apply text-2xl font-bold text-gray-800 mt-8 mb-4;
    }
    :global(.prose h3) {
        @apply text-xl font-bold text-gray-800 mt-6 mb-3;
    }
    :global(.prose p) {
        @apply text-gray-600 leading-relaxed mb-4 text-lg;
    }
    :global(.prose ul) {
        @apply list-disc list-inside mb-6 space-y-2;
    }
    :global(.prose li) {
        @apply text-gray-600 text-lg;
    }
    :global(.prose a) {
        @apply inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 no-underline mt-4;
    }
    :global(.prose code) {
        @apply bg-gray-100 px-2 py-1 rounded text-red-600 font-mono text-sm;
    }
</style>
