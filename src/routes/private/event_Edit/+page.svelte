<script lang="ts">
	import {
		showGalleryDetails,
		sanitizeEventName,
		deleteFlyerImage
	} from '$lib/assets/utils/eve_utils';
	// import { supabase } from '$lib/supabaseClient.js';
	import MeBase from '$lib/assets/img/meBase.jpg';
	import { enhance } from '$app/forms';

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟 Data

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let { flyers } = $state(data);

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟 Variables

	let loading = false;
	let eventHub = $state('');
	let formData = new FormData();

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

		// Find the corresponding flyer
		const flyer = flyers.find((flyer) => flyer.url.includes(galleryName));
		eventForm.flyer = flyer ? flyer.url : null;
	}

	$inspect(data);
	$inspect({ eventForm });

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟 Functions
	// Function to handle file upload
	function handleFileChange(event) {
		const files = event.target.files;
		eventForm.images = Array.from(files);
		formData = new FormData();
		eventForm.flyer = event.target.files;
		eventForm.images.forEach((image) => {
			formData.append('images', image);
		});
	}

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	// Combined function to delete an existing flyer image and clear the form's flyer field

	async function handleFlyerDelete() {
		const sanitizedEventName = sanitizeEventName(eventForm.event_name);
		const { success, error } = await deleteFlyerImage(supabase, sanitizedEventName);

		if (success) {
			console.log('1:Image deleted successfully');
			eventForm.flyer = ''; // Clear the image URL
		} else {
			console.error('Error deleting image:', error);
		}
	}

	// //➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	// async function handleGalleryUpload() {
	// 	if (eventForm.images.length > 0) {
	// 		const sanitizedEventName = sanitizeEventName(eventForm.event_name);
	// 		const uploadErrors = [];

	// 		for (const image of eventForm.images) {
	// 			if (image instanceof File && image.size > 0) {
	// 				const { success, error } = await uploadGalleryImage(
	// 					supabase,
	// 					sanitizedEventName,
	// 					image.name,
	// 					image
	// 				);
	// 				if (!success) uploadErrors.push(error);
	// 			}
	// 		}

	// 		if (uploadErrors.length > 0) {
	// 			console.error('Some images failed to upload:', uploadErrors);
	// 		} else {
	// 			console.log('Images uploaded successfully');
	// 		}
	// 	} else {
	// 		console.error('No images selected for upload');
	// 	}
	// }

	// async function handleGalleryDelete() {
	// 	const sanitizedEventName = sanitizeEventName(eventForm.event_name);
	// 	const deleteErrors = [];

	// 	for (const imageUrl of selectedImages) {
	// 		const imageName = imageUrl.split('/').pop();
	// 		const { success, error } = await deleteExistingGalleryImage(
	// 			supabase,
	// 			sanitizedEventName,
	// 			imageName
	// 		);

	// 		if (!success) {
	// 			deleteErrors.push(error);
	// 		} else {
	// 			selectedEventImages = selectedEventImages.filter((img) => img !== imageUrl);
	// 		}
	// 	}

	// 	if (deleteErrors.length > 0) {
	// 		console.error('Some images failed to delete:', deleteErrors);
	// 	} else {
	// 		selectedImages = []; // Clear the selected images
	// 	}
	// }
</script>

<svelte:head>
	<title>Event Operations - West Sound Roller Derby</title>
	<meta
		name="description"
		content="Manage and view events for West Sound Roller Derby. Create new events, edit existing ones, and view event details and flyers."
	/>
	<meta
		name="keywords"
		content="roller derby, West Sound, event operations, manage events, view events, create events, edit events"
	/>
	<meta property="og:title" content="Event Operations - West Sound Roller Derby" />
	<meta
		property="og:description"
		content="Manage and view events for West Sound Roller Derby. Create new events, edit existing ones, and view event details and flyers."
	/>
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<header class="head_Line">
	<h1>Modify Events</h1>
</header>

<!-- Event operation select -->
<select class="selector" bind:value={eventHub}>
	<option value="">-- select an event operation --</option>
	<option value="View">View</option>
	<option value="New">New</option>
	<option value="Edit">Edit</option>
</select>

{#if eventHub === 'View'}
	<section>
		{#if folders && folders.length > 0}
			<article>
				<select onchange={(event) => handleShowGalleryDetails(event.target.value)}>
					{#each folders as folder, index (folder.folders || index)}
						<option value={folder.folders}>
							{folder.folders}
						</option>
					{/each}
				</select>
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
				{#if eventForm.flyer}
					<img src={eventForm.flyer} alt="Event Flyer" />
				{/if}
			{/if}

			<button class="ripple-btn" onclick={() => (showModal = false)}>Close</button>
		{/if}
	</section>
{:else if eventHub === 'New'}
	<form
		class="classicForm"
		method="post"
		action="?/submit"
		use:enhance
		enctype="multipart/form-data"
	>
		<input type="hidden" name="eventHub" value="New" />

		<label class="input-group" for="event_name"
			>Event Name
			<input
				type="text"
				id="event_name"
				name="event_name"
				bind:value={eventForm.event_name}
				required
				aria-label="Event Name"
			/>
		</label>

		<label class="input-group" for="event_date"
			>Event Date

			<input
				type="date"
				id="event_date"
				name="event_date"
				bind:value={eventForm.event_date}
				required
				aria-label="Event Date"
			/>
		</label>

		<label class="input-group" for="location"
			>Event Location

			<input
				type="text"
				id="location"
				name="location"
				bind:value={eventForm.location}
				required
				aria-label="Event Location"
			/>
		</label>

		<label for="status_id"
			>Status
			<select
				class="selector"
				id="status_id"
				name="status_id"
				bind:value={eventForm.status_id}
				required
				aria-label="Event Status"
			>
				<option value="1">1 - Pending</option>
				<option value="2">2 - Confirmed</option>
				<option value="3">3 - In Progress</option>
				<option value="4">4 - Completed</option>
				<option value="5">5 - Cancelled</option>
			</select>
		</label>

		<label class="input-group" for="description"
			>Event Description

			<textarea
				id="description"
				name="description"
				bind:value={eventForm.description}
				required
				aria-label="Event Description"
			></textarea>
		</label>

		<label for="event_image">Event Flyer</label>

		<input
			type="file"
			id="event_image"
			name="images"
			multiple
			onchange={handleFileChange}
			aria-label="Event Flyer"
		/>

		<br />
		<button class="W-button" type="submit" aria-busy={loading}>Submit</button>
	</form>
{:else if eventHub === 'Edit'}
	<h3>Event Edit</h3>
	<form
		class="classicForm"
		method="post"
		action="?/submit"
		use:enhance
		enctype="multipart/form-data"
	>
		<input type="hidden" name="eventHub" value="Edit" />

		<select onchange={(event) => handleShowGalleryDetails(event.target.value)}>
			{#each folders as folder, index (folder.folders || index)}
				<option value={folder.folders}>
					{folder.folders}
				</option>
			{/each}
		</select>

		<label class="input-group" for="event_name">
			Event Name
			<input
				type="text"
				id="event_name"
				name="event_name"
				bind:value={eventForm.event_name}
				required
				aria-label="Event Name"
			/>
		</label>

		<img src={eventForm.flyer} alt="Event Flyer" />

		<label class="input-group" for="event_date">
			Event Date
			<input
				type="date"
				id="event_date"
				name="event_date"
				bind:value={eventForm.event_date}
				required
				aria-label="Event Date"
			/>
		</label>

		<label class="input-group" for="location">
			Event Location
			<input
				type="text"
				id="location"
				name="location"
				bind:value={eventForm.location}
				required
				aria-label="Event Location"
			/>
		</label>

		<label for="status_id">Status</label>

		<select
			class="selector"
			id="status_id"
			name="status_id"
			bind:value={eventForm.status_id}
			required
			aria-label="Event Status"
		>
			<option value="1">1 - Pending</option>
			<option value="2">2 - Confirmed</option>
			<option value="3">3 - In Progress</option>
			<option value="4">4 - Completed</option>
			<option value="5">5 - Cancelled</option>
		</select>

		<label class="input-group" for="description">
			Event Description
			<textarea
				id="description"
				name="description"
				bind:value={eventForm.description}
				required
				aria-label="Event Description"
			></textarea>
		</label>

		<p>🌟🌟🌟🌟🌟🌟🌟🌟🌟</p>

		<label for="event_image">Event Flyer</label>
		<input
			type="file"
			id="event_image"
			name="flyer"
			multiple
			onchange={handleFileChange}
			aria-label="Event Flyer"
		/>

		<p>🌟🌟🌟🌟🌟🌟🌟🌟🌟</p>

		<button class="W-button" type="submit" aria-busy={loading}>Submit</button>
	</form>
{/if}

<br /> <br />
<br /> <br />

<!-- svelte-ignore css_unused_selector -->
<style>
	.selector {
		display: block;
		margin: 0 auto;
	}

	.sendableForm {
		margin: 5% auto;

		& .W-button {
			width: 60%;
			margin-top: 10%;
		}
	}

	.image-gallery {
		margin: 0;
		padding: 0;

		& img {
			padding: 0;
			margin: 0;
			width: 500px;
		}
	}

	figure {
		width: 40vw;
		/* margin: 10rem; */
		text-align: center;

		/* & img {
			width: 100%;
		} */

		& figcaption {
			margin-bottom: 2vh;
		}
	}

	.event-with-image {
		display: flex;
		flex-direction: column;
		margin-left: 0;
		width: 100%;

		& img {
			/* margin: 0 10vw; */
			width: 90%;
		}

		@media screen and (min-width: 768px) {
			flex-direction: row;

			& img {
				margin: 0;
			}
		}

		@media screen and (min-width: 1024px) {
			& img {
				width: 50%;
			}

			& .event-details {
				margin: 0 15vw;
			}
		}
	}

	.event-details,
	.event-flyer {
		margin: 10px;
	}

	img {
		max-width: 200px;
		height: auto;
	}

	.flyers {
		display: none;
	}

	.image-gallery {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: 1fr 1fr;
		contain: content;
		gap: 1%;
	}

	.bout-gallery-image {
		width: 80%;
	}
</style>
