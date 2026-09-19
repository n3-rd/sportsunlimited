<script>
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { HamburgerMenu } from "svelte-radix";
	import SearchDialog from "./SearchDialog.svelte";
</script>

<div class="navigation w-full sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md shadow-sm border-b border-zinc-800/50 transition-all duration-300">
	<div class="nav-container w-full flex flex-row items-center justify-between text-white py-4 md:py-5 px-4 md:px-8">
		<div class="brand-container">
			<div class="brand font-bold text-xl md:text-2xl flex items-center gap-3">
				<img 
				src="/android-chrome-512x512.png" 
				alt="Sports Unlimited Logo" 
				class="w-12 h-10 object-contain"
			/>
			<div class="flex flex-col">
				<a href="/" class="hover:text-zinc-300 transition-colors" aria-label="Sports Unlimited Home">
				
					Sports Unlimited
				</a>
				<p class="brand-tagline hidden md:block text-xs text-zinc-400 mt-0.5 tracking-wide">
					Nigeria's Premier Sports News
				</p>
				</div>
			</div>
			
		</div>

		<div class="flex items-center gap-4">
			<!-- Desktop Navigation -->
			<nav class="nav flex-row gap-6 hidden md:flex" aria-label="Main navigation">
				<a href="/" class="nav-link hover:text-zinc-300 transition-colors font-medium">Home</a>
				<a href="/tags" class="nav-link hover:text-zinc-300 transition-colors font-medium">Categories</a>
				<a href="/npfl/standings" class="nav-link hover:text-zinc-300 transition-colors font-medium">NPFL Table</a>
				<a href="/npfl/fixtures" class="nav-link hover:text-zinc-300 transition-colors font-medium">NPFL Fixtures</a>
				<a href="/advertising" class="nav-link hover:text-zinc-300 transition-colors font-medium">Advertising</a>
				<a href="/about" class="nav-link hover:text-zinc-300 transition-colors font-medium">About</a>
				<a href="/contact" class="nav-link hover:text-zinc-300 transition-colors font-medium">Contact</a>
			</nav>

			<!-- Search Dialog -->
			<SearchDialog />

			<!-- Mobile Menu -->
			<div class="mobile-menu block md:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<button class="mobile-menu-button p-2 hover:bg-zinc-800/80 rounded-lg transition-colors" aria-label="Menu">
							<HamburgerMenu />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="mobile-menu-content w-56 mt-2 bg-white/95 backdrop-blur-xl border border-zinc-200/60 shadow-xl rounded-xl">
						<DropdownMenu.Group class="p-1">
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									Home
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/tags" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									Categories
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/npfl/standings" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									NPFL Table
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/npfl/fixtures" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									NPFL Fixtures
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/advertising" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									Advertising
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/about" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									About
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/contact" class="flex items-center gap-3 w-full py-3 px-4 rounded-lg hover:bg-zinc-100/80 transition-colors text-zinc-900 font-medium">
									Contact
								</a>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>

<style>
	:global(.mobile-menu-content) {
		animation: slideDown 0.2s ease-out;
	}
	
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	:global(.mobile-menu-item) {
		margin: 0.125rem 0;
	}
	
	:global(.mobile-menu-item a:hover) {
		color: #e11d48; /* rose-600 */
	}
</style>
