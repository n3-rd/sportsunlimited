<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { htmlToSanityBlocks, sanityBlocksToHTML, type SanityBlock } from '$lib/utils/sanity-blocks';

	let { value = $bindable(''), placeholder = 'Start typing...' } = $props();

	let editorContainer = $state<HTMLDivElement | null>(null);
	let editor = $state<Editor | null>(null);

	let isUpdating = false;

	// Watch for value changes and update editor
	$effect(() => {
		if (editor && value && !isUpdating) {
			const currentContent = editor.getHTML();
			// Only update if content is different to avoid infinite loops
			if (currentContent !== value && value.trim() !== '') {
				isUpdating = true;
				editor.commands.setContent(value);
				// Reset flag after a brief delay
				setTimeout(() => {
					isUpdating = false;
				}, 100);
			}
		}
	});

	onMount(() => {
		if (!editorContainer) return;

		// Convert value to HTML if it's Sanity blocks
		let initialContent = '';
		if (value && typeof value === 'string') {
			try {
				const parsed = JSON.parse(value);
				if (Array.isArray(parsed) && parsed[0]?._type === 'block') {
					initialContent = sanityBlocksToHTML(parsed as SanityBlock[]);
				} else {
					initialContent = value;
				}
			} catch {
				initialContent = value;
			}
		}

		// Initialize editor
		editor = new Editor({
			element: editorContainer,
			extensions: [StarterKit],
			content: initialContent || '<p></p>',
			editorProps: {
				attributes: {
					class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
					'data-placeholder': placeholder
				}
			},
			onUpdate: ({ editor }) => {
				if (!isUpdating) {
					const html = editor.getHTML();
					// Only update if different to avoid triggering the effect
					if (value !== html) {
						isUpdating = true;
						value = html;
						setTimeout(() => {
							isUpdating = false;
						}, 100);
					}
				}
			}
		});

		// If value becomes available after mount, update editor
		if (value && initialContent !== value) {
			setTimeout(() => {
				if (editor && value) {
					editor.commands.setContent(value);
				}
			}, 0);
		}
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function setHeading(level: 1 | 2 | 3) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function setParagraph() {
		editor?.chain().focus().setParagraph().run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function toggleBlockquote() {
		editor?.chain().focus().toggleBlockquote().run();
	}

	function toggleCode() {
		editor?.chain().focus().toggleCode().run();
	}
</script>

<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#60a5fa] focus-within:border-[#3b82f6] transition-all">
	<!-- Toolbar -->
	<div class="flex flex-wrap items-center gap-1 p-2 border-b border-[#333333] bg-[#141414]">
		<button
			type="button"
			onclick={toggleBold}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414]"
			title="Bold (Ctrl+B)"
		>
			<strong class="font-bold">B</strong>
		</button>
		<button
			type="button"
			onclick={toggleItalic}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414]"
			title="Italic (Ctrl+I)"
		>
			<em class="italic">I</em>
		</button>
		<div class="w-px h-6 bg-[#333333] mx-1"></div>
		<button
			type="button"
			onclick={() => setHeading(1)}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414] text-sm font-semibold"
			title="Heading 1"
		>
			H1
		</button>
		<button
			type="button"
			onclick={() => setHeading(2)}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414] text-sm font-semibold"
			title="Heading 2"
		>
			H2
		</button>
		<button
			type="button"
			onclick={() => setHeading(3)}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414] text-sm font-semibold"
			title="Heading 3"
		>
			H3
		</button>
		<div class="w-px h-6 bg-[#333333] mx-1"></div>
		<button
			type="button"
			onclick={toggleBulletList}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414]"
			title="Bullet List"
		>
			•
		</button>
		<button
			type="button"
			onclick={toggleOrderedList}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414]"
			title="Numbered List"
		>
			1.
		</button>
		<button
			type="button"
			onclick={toggleBlockquote}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414]"
			title="Quote"
		>
			"
		</button>
		<button
			type="button"
			onclick={toggleCode}
			class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-1 focus:ring-offset-[#141414] text-sm font-mono"
			title="Code"
		>
			&lt;/&gt;
		</button>
	</div>

	<!-- Editor -->
	<div bind:this={editorContainer} class="min-h-[300px] max-h-[600px] overflow-y-auto"></div>
</div>

<style>
	:global(.tiptap) {
		outline: none;
	}

	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: #9ca3af;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global(.tiptap h1),
	:global(.tiptap h2),
	:global(.tiptap h3),
	:global(.tiptap h4),
	:global(.tiptap h5),
	:global(.tiptap h6) {
		font-weight: 600;
		line-height: 1.2;
		margin-top: 1.5em;
		margin-bottom: 0.5em;
	}

	:global(.tiptap h1) {
		font-size: 2em;
	}

	:global(.tiptap h2) {
		font-size: 1.5em;
	}

	:global(.tiptap h3) {
		font-size: 1.25em;
	}

	:global(.tiptap p) {
		margin: 0.75em 0;
	}

	:global(.tiptap ul),
	:global(.tiptap ol) {
		padding-left: 1.5em;
		margin: 0.75em 0;
	}

	:global(.tiptap blockquote) {
		border-left: 4px solid #3b82f6;
		padding-left: 1em;
		margin: 1em 0;
		font-style: italic;
		color: #d1d5db;
	}

	:global(.tiptap code) {
		background-color: #2a2a2a;
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-family: monospace;
		font-size: 0.9em;
	}

	:global(.tiptap pre) {
		background-color: #141414;
		padding: 1em;
		border-radius: 8px;
		margin: 1em 0;
		overflow-x: auto;
	}

	:global(.tiptap pre code) {
		background-color: transparent;
		padding: 0;
	}
</style>

