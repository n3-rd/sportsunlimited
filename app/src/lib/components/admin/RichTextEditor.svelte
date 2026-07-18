<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import { Link2, Image as ImageIcon } from 'lucide-svelte';

	let { value = $bindable(''), placeholder = 'Start typing...' } = $props();

	let editorContainer = $state<HTMLDivElement | null>(null);
	let editor = $state<Editor | null>(null);
	let isUpdating = false;
	let linkPopoverOpen = $state(false);
	let linkUrl = $state('');
	let linkPopoverEl = $state<HTMLDivElement | null>(null);
	let fileInputEl = $state<HTMLInputElement | null>(null);

	// Watch for value changes and update editor
	$effect(() => {
		if (editor && value && !isUpdating) {
			const currentContent = editor.getHTML();
			if (currentContent !== value && value.trim() !== '') {
				isUpdating = true;
				editor.commands.setContent(value);
				setTimeout(() => {
					isUpdating = false;
				}, 100);
			}
		}
	});

	onMount(() => {
		if (!editorContainer) return;

		let initialContent = value;
		if (value && typeof value === 'string') {
			try {
				const parsed = JSON.parse(value);
				if (Array.isArray(parsed) && parsed[0]?._type === 'block') {
					// Minimal HTML conversion for Sanity blocks if passed
					initialContent = parsed.map(b => b.children?.map((c: any) => c.text).join('') || '').join('<br>');
				}
			} catch {
				initialContent = value;
			}
		}

		editor = new Editor({
			element: editorContainer,
			extensions: [
				StarterKit,
				Image.configure({
					inline: true,
					allowBase64: true,
				}),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' }
				})
			],
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

	function toggleBold() { editor?.chain().focus().toggleBold().run(); }
	function toggleItalic() { editor?.chain().focus().toggleItalic().run(); }
	function setHeading(level: 1 | 2 | 3) { editor?.chain().focus().toggleHeading({ level }).run(); }
	function toggleBulletList() { editor?.chain().focus().toggleBulletList().run(); }
	function toggleOrderedList() { editor?.chain().focus().toggleOrderedList().run(); }
	function toggleBlockquote() { editor?.chain().focus().toggleBlockquote().run(); }
	function toggleCode() { editor?.chain().focus().toggleCode().run(); }

	function openLinkPopover() {
		const attrs = editor?.getAttributes('link');
		linkUrl = attrs?.href || 'https://';
		linkPopoverOpen = true;
		setTimeout(() => linkPopoverEl?.querySelector('input')?.focus(), 50);
	}

	function setLink() {
		const href = linkUrl.trim();
		if (href && href !== 'https://') {
			editor?.chain().focus().setLink({ href }).run();
		} else {
			editor?.chain().focus().unsetLink().run();
		}
		linkPopoverOpen = false;
		linkUrl = '';
	}

	function removeLink() {
		editor?.chain().focus().unsetLink().run();
		linkPopoverOpen = false;
		linkUrl = '';
	}

	function isLinkActive() { return editor?.isActive('link') ?? false; }

	// Image Upload handling (Base64)
	function triggerImageUpload() {
		fileInputEl?.click();
	}

	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const result = event.target?.result as string;
			if (result && editor) {
				editor.chain().focus().setImage({ src: result }).run();
			}
		};
		reader.readAsDataURL(file);
		// Reset input
		target.value = '';
	}

	$effect(() => {
		if (!linkPopoverOpen) return;
		function handleClick(e: MouseEvent) {
			const target = e.target as Node;
			if (linkPopoverEl && !linkPopoverEl.contains(target) && !editorContainer?.contains(target)) {
				linkPopoverOpen = false;
			}
		}
		setTimeout(() => window.addEventListener('click', handleClick), 0);
		return () => window.removeEventListener('click', handleClick);
	});
</script>

<div class="bg-[#1f1f1f] border border-[#333333] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#60a5fa] focus-within:border-[#3b82f6] transition-all">
	<div class="flex flex-wrap items-center gap-1 p-2 border-b border-[#333333] bg-[#141414]">
		<button type="button" onclick={toggleBold} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white" title="Bold"><strong class="font-bold">B</strong></button>
		<button type="button" onclick={toggleItalic} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] hover:text-white" title="Italic"><em class="italic">I</em></button>
		<div class="w-px h-6 bg-[#333333] mx-1"></div>
		<button type="button" onclick={() => setHeading(1)} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] text-sm font-semibold">H1</button>
		<button type="button" onclick={() => setHeading(2)} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] text-sm font-semibold">H2</button>
		<button type="button" onclick={() => setHeading(3)} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] text-sm font-semibold">H3</button>
		<div class="w-px h-6 bg-[#333333] mx-1"></div>
		<button type="button" onclick={toggleBulletList} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db]">•</button>
		<button type="button" onclick={toggleOrderedList} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db]">1.</button>
		<button type="button" onclick={toggleBlockquote} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db]">"</button>
		<button type="button" onclick={toggleCode} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] font-mono">&lt;/&gt;</button>
		<div class="w-px h-6 bg-[#333333] mx-1"></div>
		
		<!-- Link Tool -->
		<div class="relative">
			<button type="button" onclick={openLinkPopover} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db] {isLinkActive() ? 'bg-[#2a2a2a] text-[#60a5fa]' : ''}" title="Link">
				<Link2 class="h-4 w-4" />
			</button>
			{#if linkPopoverOpen}
				<div bind:this={linkPopoverEl} class="absolute left-0 top-full mt-1 z-50 w-72 p-2 bg-[#1f1f1f] border border-[#333333] rounded-lg shadow-xl">
					<input type="url" bind:value={linkUrl} placeholder="https://..." class="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded text-white text-sm mb-2" onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), setLink())} />
					<div class="flex gap-1">
						<button type="button" onclick={setLink} class="flex-1 px-3 py-1.5 bg-[#3b82f6] text-white text-sm rounded">Apply</button>
						<button type="button" onclick={removeLink} class="px-3 py-1.5 bg-[#333333] text-[#d1d5db] text-sm rounded">Remove</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Image Tool -->
		<button type="button" onclick={triggerImageUpload} class="p-2 rounded hover:bg-[#2a2a2a] text-[#d1d5db]" title="Insert Image">
			<ImageIcon class="h-4 w-4" />
		</button>
		<input type="file" bind:this={fileInputEl} onchange={handleImageUpload} accept="image/*" class="hidden" />
	</div>

	<div bind:this={editorContainer} class="min-h-[300px] max-h-[600px] overflow-y-auto"></div>
</div>

<style>
	:global(.tiptap) { outline: none; }
	:global(.tiptap p.is-editor-empty:first-child::before) { color: #9ca3af; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
	:global(.tiptap h1), :global(.tiptap h2), :global(.tiptap h3) { font-weight: 600; line-height: 1.2; margin-top: 1.5em; margin-bottom: 0.5em; }
	:global(.tiptap h1) { font-size: 2em; }
	:global(.tiptap h2) { font-size: 1.5em; }
	:global(.tiptap h3) { font-size: 1.25em; }
	:global(.tiptap p) { margin: 0.75em 0; }
	:global(.tiptap ul), :global(.tiptap ol) { padding-left: 1.5em; margin: 0.75em 0; }
	:global(.tiptap blockquote) { border-left: 4px solid #3b82f6; padding-left: 1em; margin: 1em 0; font-style: italic; color: #d1d5db; }
	:global(.tiptap code) { background-color: #2a2a2a; padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
	:global(.tiptap img) { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; }
</style>
