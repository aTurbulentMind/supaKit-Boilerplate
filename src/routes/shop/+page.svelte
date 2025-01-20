<!-- +page.svelte  
	Shop/warehouse page.

	@since version 0.5.8
-->
<script lang="ts">
	// Import necessary functions and types from Svelte
	import { fade } from 'svelte/transition';
	import BaseBase from '$lib/assets/img/img1.jpg';
	// import { getImages } from '$lib/assets/utils/itm_utils.ts';

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	// Export the data prop
	interface Props {
		data: {
			session: any;
			productData: Array<{
				product_id: number;
				product_name: string;
				category: string;
				description: string;
				price: string;
			}>;
			productInventory: Array<{ product_id: number; size_id: number }>;
			sizeData: Array<{ size_id: number; size_name: string }>;
			productFolders: Array<string>;
		};
	}

	let { data }: Props = $props();

	let { productData, productInventory, sizeData, productFolders } = $state(data);

	$inspect({ productData, productInventory, sizeData, productFolders });

	let loading = false;
	let matchingInventory = $state({});
	let uniqueCategories = new Set(productData.map((product) => product.category));
	let selectedCategory = $state('');
	let selectedProduct = $state(null);
	let showModal = $state(false);
	let productImages = $state([]);
	let currentImageIndex = $state(0);
	let intervalId = $state({});

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	function handleCategorySelection(category) {
		selectedCategory = category;
	}

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	let filteredProducts = $derived(
		productData
			.filter((product) => product.category === selectedCategory)
			.map((product) => {
				const folder = productFolders.find(
					(folder) => folder.productFolder === product.product_name
				);
				return {
					...product,
					thumbnail: folder ? folder.imageUrls[0] : BaseBase
				};
			})
	);

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	const handleCardClick = async (product) => {
		selectedProduct = product;
		showModal = true;
		currentImageIndex = 0;
		matchingInventory = productData.filter((data) => data.product_name === product.product_name)[0];
		const sizes = productInventory.filter((inventory) => inventory.item_id === product.item_id);
		matchingInventory.sizes = sizes;

		// Find the matching folder and set the productImages
		const folder = productFolders.find((folder) => folder.productFolder === product.product_name);
		productImages = folder ? folder.imageUrls : [BaseBase];

		startAutoSlide();
	};

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	const nextImage = () => {
		if (productImages.length) {
			currentImageIndex = (currentImageIndex + 1) % productImages.length;
		}
	};

	const prevImage = () => {
		if (productImages.length) {
			currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
		}
	};

	const startAutoSlide = () => {
		stopAutoSlide();
		intervalId = setInterval(nextImage, 3000);
	};

	const stopAutoSlide = () => {
		if (intervalId) clearInterval(intervalId);
	};

	// $inspect({ matchingInventory });
</script>

<main>
	<header class=" head_Line">
		<h1>a shop test.</h1>
	</header>

	<h2>This has item display setup but no cart yet</h2>

	<p>Select a category:</p>
	<section>
		{#if uniqueCategories.size > 0}
			<div class="tabs">
				{#each Array.from(uniqueCategories) as category}
					<button
						class:active-tab={selectedCategory === category}
						onclick={() => handleCategorySelection(category)}
					>
						{category}
					</button>
				{/each}
			</div>
		{/if}

		{#if selectedCategory}
			<div class="scroll-container">
				<div class="horizontal-grid">
					{#each filteredProducts as product}
						<button
							class="card"
							type="button"
							aria-label={`View details for ${product.product_name}`}
							onclick={() => handleCardClick(product)}
						>
							<img src={product.thumbnail} alt="Product Thumbnail" />
							<h4>{product.product_name}</h4>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Modal-->
		{#if showModal}
			<div class="modal-background">
				<div class="modal">
					<h4>{matchingInventory.product_name}</h4>

					<div class="carousel">
						{#if productImages && productImages.length > 0}
							<button onclick={prevImage} class="caro-nav-button">←</button>
							<img
								src={productImages[currentImageIndex] || BaseBase}
								alt={`Image of ${matchingInventory.product_name}`}
								transition:fade={{ duration: 500 }}
							/>
							<button onclick={nextImage} class="caro-nav-button">→</button>
						{:else}
							<img src={BaseBase} alt="Default product" />
						{/if}
					</div>

					<section>
						<p><strong>Description:</strong> {matchingInventory.description}</p>
						<p><strong>Price:</strong> {matchingInventory.price}</p>
						<p><strong>Category:</strong> {matchingInventory.category}</p>
					</section>

					{#if matchingInventory.sizes && matchingInventory.sizes.length > 0}
						<p><strong>Available Sizes - Remaining</strong></p>
						<p>
							{#each matchingInventory.sizes as inventory, i}
								{sizeData.find((size) => size.size_id === inventory.size_id)?.size_name ||
									'Unknown Size'} - {inventory.quantity}
								{#if i < matchingInventory.sizes.length - 1}/{/if}
							{/each}
						</p>
					{/if}

					<button type="button" onclick={() => (showModal = false)}>
						<span>Close</span>
					</button>
				</div>
			</div>
		{/if}
	</section>
</main>

<!-- svelte-ignore css_unused_selector -->
<style>
	button {
		all: unset;
	}

	.tabs button,
	.head_Line {
		z-index: 420;
	}

	.tabs {
		display: flex;
		flex-direction: column;
		gap: var(--size-1);
		margin-bottom: 20px;

		@media screen and (min-width: 768px) {
			flex-direction: row;
			margin-left: 10vw;
		}

		& button {
			padding: var(--space-Sm);
			margin: var(--space-Sm);
			border: none;
			background-color: var(--accent-1);
			border-radius: var(--rad-Sm);
			cursor: pointer;
			transition:
				background-color 0.3s,
				color 0.3s;

			&&:hover {
				background-color: var(--hover);
			}

			&&.active-tab {
				background-color: var(--color-active);
			}
		}
	}

	.horizontal-grid {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, 1fr);
		padding: var(--size-1);
		gap: var(--size-1);
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		position: relative;
	}

	/* Pseudo-elements for blur effect */
	.horizontal-grid::before,
	.horizontal-grid::after {
		content: '';
		position: fixed;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 20%;
		pointer-events: none;
		z-index: 1;
	}

	.horizontal-grid::before {
		left: 0;
		background: linear-gradient(to right, var(--bg-1), rgba(255, 255, 255, 0));
	}

	.horizontal-grid::after {
		right: 0;
		background: linear-gradient(to left, var(--bg-1), rgba(255, 255, 255, 0));
	}

	/* Card Styling */
	.card {
		min-width: 200px;
		background-color: var(--hallow);
		transition:
			transform 0.3s,
			box-shadow 0.3s;
		padding: var(--size-1);
		border-radius: var(--size-1);
		box-shadow: var(--box-Shadow);
		scroll-snap-align: start;
		cursor: pointer;

		&:hover {
			transform: scale(1.05);
		}

		& img {
			width: 100%;
			height: 9rem;
			object-fit: cover;
			border-radius: var(--rad-Sm);
		}
	}

	span {
		cursor: pointer;
	}

	.modal-background {
		position: absolute;
		top: 0;
		background-color: var(--bg-1);
		width: 100vw;
		z-index: 777;
	}

	.carousel {
		& img {
			max-width: 100%;
			max-height: 300px;
			border-radius: 8px;
			padding: var(--size-1);
			border-radius: var(--rad-Sm);
		}

		& button {
			background: var(--accent-1);
			padding: var(--size-1);
			width: 10px;
			border: var(--bord);
			border-radius: var(--rad-Sm);

			&:hover {
				background: var(--accent-1);
			}
		}
	}

	/* Animations */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideDown {
		from {
			transform: translateY(-30px);
		}
		to {
			transform: translateY(0);
		}
	}
</style>
