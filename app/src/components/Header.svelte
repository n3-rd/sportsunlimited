<script>
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { HamburgerMenu } from "svelte-radix";
	import SearchDialog from "./SearchDialog.svelte";
</script>

<!-- Main Navigation -->
<header class="navigation w-full sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl shadow-sm border-b border-zinc-800/60 transition-all duration-300">
	<div class="nav-container max-w-7xl mx-auto flex flex-row items-center justify-between text-white py-3.5 px-4 md:px-8">
		<!-- Brand Lockup -->
		<div class="brand-container flex items-center">
			<a href="/" class="brand group flex items-center gap-3.5" aria-label="Sports Unlimited Home">
				<div class="relative p-1 rounded-xl bg-zinc-900 ring-1 ring-zinc-800 transition-transform duration-300 group-hover:scale-105">
					<img 
						src="/android-chrome-512x512.png" 
						alt="Sports Unlimited Logo" 
						class="w-9 h-9 object-contain"
					/>
				</div>
				<div class="flex flex-col">
					<span class="font-extrabold text-lg md:text-xl tracking-tight text-white group-hover:text-rose-400 transition-colors duration-300">
						SPORTS UNLIMITED
					</span>
					<p class="brand-tagline hidden md:block text-[9.5px] font-mono uppercase tracking-[0.2em] text-zinc-400 -mt-0.5">
						Nigeria's Premier Sports Journalism
					</p>
				</div>
			</a>
		</div>

		<div class="flex items-center gap-1.5 md:gap-6">
			<!-- Desktop Navigation -->
			<nav class="nav flex-row items-center gap-7 hidden md:flex" aria-label="Main navigation">
				<a href="/" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">Home</a>
				<a href="/tags" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">Categories</a>
				<a href="/npfl/standings" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">NPFL Table</a>
				<a href="/npfl/fixtures" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">NPFL Fixtures</a>
				<a href="/advertising" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">Advertising</a>
				<a href="/about" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">About</a>
				<a href="/contact" class="nav-link text-xs uppercase tracking-widest font-mono text-zinc-300 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-rose-500 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300">Contact</a>
			</nav>

			<!-- Search Dialog -->
			<div class="flex items-center">
				<SearchDialog />
			</div>

			<!-- Mobile Menu -->
			<div class="mobile-menu block md:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<button class="mobile-menu-button p-2 bg-transparent border-0 hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors text-zinc-300 hover:text-white flex items-center justify-center" aria-label="Menu">
							<HamburgerMenu size="22" />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="mobile-menu-content w-64 mt-2 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800 shadow-2xl rounded-2xl p-2">
						<DropdownMenu.Group class="space-y-1">
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									Home
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/tags" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									Categories
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/npfl/standings" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									NPFL Table
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/npfl/fixtures" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									NPFL Fixtures
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/advertising" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									Advertising
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/about" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									About
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="mobile-menu-item">
								<a href="/contact" class="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-200 hover:text-rose-400 font-mono text-xs uppercase tracking-wider">
									Contact
								</a>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</header>

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
