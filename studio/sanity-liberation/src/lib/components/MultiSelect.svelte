<script lang="ts">
	import { ChevronDown, Check, X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let {
		options = [],
		selected = $bindable([]),
		label = '',
		id = '',
		placeholder = 'Select options...'
	} = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let dropdownRef = $state<HTMLDivElement | null>(null);

	const filteredOptions = $derived(
		options.filter((opt) =>
			typeof opt === 'string'
				? opt.toLowerCase().includes(searchQuery.toLowerCase())
				: opt.label.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function toggleOption(value: string) {
		if (selected.includes(value)) {
			selected = selected.filter((v) => v !== value);
		} else {
			selected = [...selected, value];
		}
	}

	function removeOption(value: string) {
		selected = selected.filter((v) => v !== value);
	}

	function getOptionLabel(opt: string | { label: string; value: string }): string {
		return typeof opt === 'string' ? opt : opt.label;
	}

	function getOptionValue(opt: string | { label: string; value: string }): string {
		return typeof opt === 'string' ? opt : opt.value;
	}

	function isSelected(opt: string | { label: string; value: string }): boolean {
		const value = getOptionValue(opt);
		return selected.includes(value);
	}

	// Close dropdown when clicking outside
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
				searchQuery = '';
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	// Handle keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
			searchQuery = '';
		}
	}
</script>

<div class="relative" bind:this={dropdownRef}>
	<label for={id} class="block text-sm font-semibold text-white mb-2">
		{label}
	</label>
	<div class="relative">
		<!-- Selected tags display -->
		<div
			class="min-h-[42px] bg-[#1f1f1f] border border-[#333333] rounded-lg px-3 py-2 flex flex-wrap gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-[#60a5fa] focus-within:border-[#3b82f6] transition-all"
			onclick={() => {
				isOpen = !isOpen;
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					isOpen = !isOpen;
				}
			}}
			role="button"
			tabindex="0"
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			aria-label={label}
		>
			{#if selected.length === 0}
				<span class="text-[#9ca3af] py-1">{placeholder}</span>
			{:else}
				{#each selected as value}
					{@const option = options.find((opt) => getOptionValue(opt) === value)}
					{#if option}
						<span
							class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#3b82f6] text-white text-sm font-medium rounded-md"
						>
							{getOptionLabel(option)}
							<button
								type="button"
								onclick={(e) => {
									e.stopPropagation();
									removeOption(value);
								}}
								class="hover:bg-[#2563eb] rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#3b82f6]"
								aria-label="Remove {getOptionLabel(option)}"
							>
								<X class="h-3 w-3" />
							</button>
						</span>
					{/if}
				{/each}
			{/if}
			<ChevronDown
				class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af] transition-transform {isOpen
					? 'transform rotate-180'
					: ''}"
			/>
		</div>

		<!-- Dropdown menu -->
		{#if isOpen}
			<div
				class="absolute z-50 w-full mt-2 bg-[#1f1f1f] border border-[#333333] rounded-lg shadow-xl max-h-60 overflow-auto"
				role="listbox"
				aria-label={label}
			>
				<!-- Search input -->
				<div class="sticky top-0 bg-[#1f1f1f] border-b border-[#333333] p-2">
					<input
						type="text"
						bind:value={searchQuery}
						onkeydown={handleKeydown}
						placeholder="Search..."
						class="w-full px-3 py-2 bg-[#141414] border border-[#333333] rounded-md text-white placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#3b82f6] text-sm"
						autofocus
					/>
				</div>

				<!-- Options list -->
				<div class="py-1">
					{#if filteredOptions.length === 0}
						<div class="px-4 py-3 text-sm text-[#9ca3af]">No options found</div>
					{:else}
						{#each filteredOptions as option}
							{@const value = getOptionValue(option)}
							{@const label = getOptionLabel(option)}
							{@const selected = isSelected(option)}
							<button
								type="button"
								onclick={() => toggleOption(value)}
								class="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-inset flex items-center gap-3 transition-colors"
								role="option"
								aria-selected={selected}
							>
								<div
									class="flex-shrink-0 w-5 h-5 border-2 rounded {selected
										? 'bg-[#3b82f6] border-[#3b82f6]'
										: 'border-[#666666]'}"
								>
									{#if selected}
										<Check class="h-3 w-3 text-white m-0.5" />
									{/if}
								</div>
								<span>{label}</span>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>


