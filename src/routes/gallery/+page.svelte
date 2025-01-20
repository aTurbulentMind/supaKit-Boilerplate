<script lang="ts">
	import BaseBase from '$lib/assets/img/img1.jpg';

	//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

	import { showGalleryDetails } from '$lib/assets/utils/eve_utils';

	let { data } = $props();
	let folders = $state(data?.folders ?? []);
	let existingEvents = $state(data?.existingEvents ?? []);
	let showModal = $state(false);
	let selectedGallery = $state('');
	let selectedGalleryImages = $state([]);
	let eventForm = $state({});

	async function handleShowGalleryDetails(galleryName) {
		const result = showGalleryDetails(galleryName, existingEvents, folders);
		eventForm = result.eventForm;
		selectedGallery = result.selectedGallery;
		selectedGalleryImages = result.selectedGalleryImages;
		showModal = result.showModal;
	}
</script>

<main>
	<div class="head_Line">
		<h1>Test for Event Gallery</h1>
	</div>

	<p class="intro-paragraph">
		This is for connecting image and table data. specifically for something like an event gallery.
		Finds the images based on a matching tables row. So row in table events matches to a folder with
		the same name in an events folder in the storage space.
	</p>

	<section class="gallery-container">
		{#if folders && folders.length > 0}
			<article class="carousel-container">
				{#each folders as folder, index (folder.folders || index)}
					<button
						class="gallery-item {index % 2 === 0 ? 'above' : 'below'}"
						type="button"
						aria-label="View details for {folder.folders}"
						onclick={() => handleShowGalleryDetails(folder.folders)}
					>
						<img src={folder.images[0]?.url || BaseBase} alt="Event Thumbnail" />
						<h2 style="color: #fff;">{folder.folders}</h2>
					</button>
				{/each}
			</article>
		{:else if folders === undefined}
			<p aria-live="polite">Loading folders...</p>
		{:else}
			<p aria-live="polite">No folders found.</p>
		{/if}

		{#if showModal}
			<h3>{selectedGallery}</h3>
			{#if selectedGalleryImages && selectedGalleryImages.length > 0}
				{#each selectedGalleryImages as image}
					<img src={image.url} alt={image.name} />
				{/each}
			{:else}
				<p>No images available for this gallery.</p>
			{/if}

			{#if eventForm.event_name}
				<h4>Event Details</h4>
				<p><strong>Description:</strong> {eventForm.description}</p>
				<p><strong>Date:</strong> {eventForm.event_date}</p>
				<p><strong>Location:</strong> {eventForm.location}</p>
			{/if}

			<button class="ripple-btn" onclick={() => (showModal = false)}>Close</button>
		{/if}
	</section>
</main>

<!-- svelte-ignore css_unused_selector -->
<style>
	.intro-paragraph {
		margin-bottom: var(--size-2);
		color: var(--text-1);
	}

	.gallery-container {
		width: 90vw;
		margin: 10vh auto;
		color: var(--text-1);
		background-color: var(--hallow);
		border: var(--bord);
		box-shadow: var(--box-Shadow);
		border-radius: var(--rad-Sm);

		& h2 {
			text-transform: uppercase;
			padding: 20px;
			margin: 0;
		}

		& img {
			width: 20vw;
			cursor: pointer;
		}

		.gallery-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			cursor: pointer;

			& h2 {
				padding: 7vh 5vw 0 5vw;
				color: var(--text-1);
			}

			& img {
				max-width: 200px;
				object-fit: cover;
			}
		}

		.carousel-container {
			display: flex;
			overflow-x: auto;
			gap: 40px;
			height: 60vh;
			margin: 40px 10px;
			position: relative; /* To add the timeline line */
			align-items: center;

			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				width: 1400px;
				max-width: 2000px;
				height: 0;
				background: transparent;
				border: 5px dashed var(--accent-1);
				z-index: 0;
			}

			&::-webkit-scrollbar {
				height: 12px;
			}

			&::-webkit-scrollbar-thumb {
				background: var(--accent-1);
				border-radius: 6px;
			}

			&::-webkit-scrollbar-track {
				background: var(--accent-1);
			}
		}

		button {
			background: var(--accent-1);
			text-align: center;
			padding: var(--size-1);
			margin: var(--size-2);
			z-index: 1;

			&:hover {
				background: var(--hover);
				cursor: pointer;
			}
		}
	}

	.under {
		color: var(--text-1);

		& h3,
		label {
			margin: 0;
			padding: 0 20px;
		}

		& img {
			width: 70%;
			margin: 0;
			padding: 0;
		}

		& .carousel-container::before,
		.carousel-container::after {
			display: none;
		}
	}

	.modal-background {
		z-index: 420;
	}

	.carousel-container {
		display: flex;
		overflow-x: auto;
		gap: 40px;
		margin: 40px 10px;
		position: relative;
		align-items: center; /* Centers the timeline */

		/* Horizontal dashed timeline line */
		&::before {
			content: '';
			position: absolute;
			top: 50%; /* Middle of the container */
			left: 0;
			width: 200%;
			height: 0;
			border: 3px dashed var(--accent-2);
			z-index: 0;
		}

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.gallery-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		cursor: pointer;
		position: relative; /* To position above/below line */
		z-index: 1; /* Above the timeline line */

		h2 {
			padding: 7vh 5vw 0 5vw;
			color: var(--extra);
		}

		img {
			max-width: 200px;
			object-fit: cover;
		}
	}

	/* Alternating positions using CSS classes */
	.above {
		top: -100px; /* Shift above the timeline */
	}

	.below {
		top: 100px; /* Shift below the timeline */
	}

	/* Optional: Smooth transitions on hover */
	.gallery-item:hover {
		transform: scale(1.05);
		transition: transform 0.3s;
	}
</style>
