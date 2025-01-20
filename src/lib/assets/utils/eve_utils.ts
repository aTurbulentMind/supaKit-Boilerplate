// eve_utils.js - Helper functions for events
import pLimit from 'p-limit';

export const sanitizeEventName = (eventName) => {
	return eventName
		.toLowerCase()
		.replace(/[^a-z0-9-_ ]/gi, '')
		.replace(/\s+/g, ' ');
};

export const sanitizeFileName = (fileName) => {
	return fileName
		.toLowerCase()
		.replace(/[^a-z0-9-_ ]/gi, '')
		.replace(/\s+/g, ' ');
};

// Function to generate a public URL for a file in a specified folder
export const generatePublicUrl = (folder, filename) => {
	return `https://kptpnqqpryjldmrguosf.supabase.co/storage/v1/object/public/Gallery/${folder}/${sanitizeFileName(filename)}`;
};

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Fetch events and attempt to fetch images from folders without using list()
export const fetchEventsAndImages = async (supabase) => {
	try {
		// Fetch existing events from the 'events' table
		const { data: existingEvents, error: eventsError } = await supabase.from('events').select('*');

		if (eventsError) {
			console.error('Failed to fetch events:', eventsError.message);
			return { error: 'Failed to fetch events' };
		}

		const flyers = await Promise.all(
			existingEvents.map(async (event, index) => {
				const sanitizedEventName = sanitizeEventName(event.event_name);
				const fileName = `${sanitizedEventName}`;

				// Fetch the public URL directly from Supabase Storage using the sanitized name
				const { data } = supabase.storage.from('Gallery').getPublicUrl(`event_Flyer/${fileName}`);

				// Return the generated URL if it exists
				return { id: index, url: data.publicUrl };
			})
		);

		// Limit the number of concurrent requests
		const limit = pLimit(5);

		// Generate folders and attempt to fetch only existing images in parallel
		const foldersWithImages = await Promise.all(
			existingEvents.map((event) =>
				limit(async () => {
					// Removed sanitization for testing purposes
					const folderName = event.event_name;
					const imageUrls = [];

					for (let i = 1; i <= 20; i++) {
						const fileName = `${i}.jpg`;

						const { data } = supabase.storage
							.from('Gallery')
							.getPublicUrl(`bout_photos/${folderName}/${fileName}`);

						if (data && data.publicUrl) {
							try {
								const response = await fetch(data.publicUrl, { method: 'HEAD' });
								if (response.ok) {
									imageUrls.push({ name: fileName, url: data.publicUrl });
								} else {
									break;
								}
							} catch (error) {
								console.warn(`Image ${i}.jpg not found for ${folderName}`);
								break;
							}
						} else {
							break;
						}
					}

					return { folders: folderName, images: imageUrls };
				})
			)
		);

		return { existingEvents, flyers, folders: foldersWithImages, error: null };
	} catch (err) {
		console.error('Error loading data:', err.message);
		return { existingEvents: [], flyers: [], folders: [], error: 'Error loading data' };
	}
};

//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟
export const showGalleryDetails = (galleryName, existingEvents, folders) => {
	try {
		if (!galleryName || typeof galleryName !== 'string') {
			throw new Error('Invalid gallery name provided');
		}

		if (!Array.isArray(existingEvents) || !Array.isArray(folders)) {
			throw new Error('Invalid data provided for existingEvents or folders');
		}

		// Sanitize the gallery name for consistency (ensure the format is uniform)
		const sanitizedGalleryName = sanitizeEventName(galleryName);

		// Find the matching event and folder using the sanitized gallery name
		const matchingEvent = existingEvents.find(
			(event) => sanitizeEventName(event.event_name) === sanitizedGalleryName
		);

		const matchingFolder = folders.find(
			(folder) => sanitizeEventName(folder.folders) === sanitizedGalleryName
		);

		let eventForm = {};

		// If a matching event is found, set up the form with event data
		if (matchingEvent) {
			eventForm = {
				event_name: matchingEvent.event_name,
				event_date: new Date(matchingEvent.event_date).toISOString().slice(0, 10),
				location: matchingEvent.location,
				description: matchingEvent.description,
				status_id: matchingEvent.status_id.toString(),
				flyers: matchingFolder ? matchingFolder.flyers : [],
				images: matchingFolder ? matchingFolder.images : []
			};
		} else {
			eventForm = {
				event_name: sanitizedGalleryName,
				description: 'No event data found for this gallery.',
				event_date: '',
				location: '',
				status_id: '',
				flyers: [],
				images: []
			};
		}

		return {
			eventForm,
			selectedGallery: sanitizedGalleryName,
			selectedGalleryImages: matchingFolder ? matchingFolder.images : [],
			showModal: true
		};
	} catch (err) {
		console.error('Error showing gallery details:', err);
		return {
			eventForm: {},
			selectedGallery: '',
			selectedGalleryImages: [],
			showModal: false
		};
	}
};

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Function to upload a flyer image to Supabase storage
export const uploadFlyerImage = async (supabase, sanitizedName, image) => {
	// Sanitize file path to prevent directory traversal attacks
	const sanitizedFilePath = `event_Flyer/${sanitizedName.replace(/[^a-zA-Z0-9-_]/g, '')}`;
	const { error } = await supabase.storage.from('Gallery').upload(sanitizedFilePath, image);

	if (error) {
		console.error(`Error uploading flyer image: ${error.message}`);
		return { success: false, error: error.message };
	}

	return { success: true, filePath: sanitizedFilePath };
};

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Everything below this space does not work yet. Or is not need anymore and I have not cut it out yet. This is what I am currently working on

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣
//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Function to upload a gallery image to Supabase storage
export const uploadGalleryImage = async (supabase, folderName, sanitizedName, image) => {
	// Sanitize file path to prevent directory traversal attacks
	const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9-_]/g, '');
	const sanitizedFileName = sanitizedName.replace(/[^a-zA-Z0-9-_]/g, '');
	const filePath = `bout_photos/${sanitizedFolderName}/${sanitizedFileName}`;
	const { error } = await supabase.storage.from('Gallery').upload(filePath, image);

	if (error) {
		console.error(`Error uploading gallery image: ${error.message}`);
		return { success: false, error: error.message };
	}

	return { success: true, filePath };
};

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Function to delete an existing flyer image from Supabase storage
export const deleteFlyerImage = async (supabase, sanitizedName) => {
	const sanitizedFilePath = `event_Flyer/${sanitizedName}`;
	console.log('A: Sanitized File Path:', sanitizedFilePath);

	const { error: deleteError } = await supabase.storage.from('Gallery').remove([sanitizedFilePath]);

	if (deleteError) {
		console.error('B-1:Error deleting flyer:', deleteError.message);
		return { success: false, error: deleteError.message };
	}

	console.log('B-2:Flyer deleted successfully');
	return { success: true };
};

// Function to delete an existing gallery image from Supabase storage
export const deleteExistingGalleryImage = async (supabase, folderName, imageName) => {
	// Sanitize file path to prevent directory traversal attacks
	const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9-_]/g, '');
	const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9-_]/g, '');
	const { error: deleteError } = await supabase.storage
		.from('Gallery')
		.remove([`bout_photos/${sanitizedFolderName}/${sanitizedImageName}`]);

	if (deleteError) {
		console.error('Error deleting existing gallery image:', deleteError.message);
		return { success: false, error: 'Error deleting existing gallery image' };
	}

	return { success: true };
};

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Function to find a matching event for a given gallery name from a list of events
export const findMatchingEvent = (events, galleryName) => {
	const sanitizedGalleryName = sanitizeEventName(galleryName);
	return events.find((event) => sanitizeEventName(event.event_name) === sanitizedGalleryName);
};

// Function to find a matching image for a given event name from a list of images
export const findMatchingImage = (eventName, images) => {
	if (!eventName) {
		console.error('No event name provided to find the matching image');
		return null;
	}

	const sanitizedEventName = sanitizeEventName(eventName);

	return images.find((image) => {
		const imageName = decodeURIComponent(image.url.split('/').pop())
			.replace(/\.[^/.]+$/, '')
			.trim()
			.toLowerCase();

		return imageName === sanitizedEventName.toLowerCase();
	});
};

//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣

// Function to fetch images with pagination from a specified folder in Supabase storage
export const fetchImagesWithPagination = async (supabase, folderName, page, limit) => {
	try {
		// Sanitize folder name to prevent directory traversal attacks
		const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9-_]/g, '');

		// Fetch files from the specified folder with pagination
		const { data: files, error: filesError } = await supabase.storage
			.from('Gallery')
			.list(`bout_photos/${sanitizedFolderName}`, { limit, offset: page * limit });

		if (filesError) {
			console.error(`Error fetching images for folder ${sanitizedFolderName}:`, filesError.message);
			return [];
		}

		// Map the fetched files to an array of public URLs
		return files.map((file) => generatePublicUrl(`bout_photos/${sanitizedFolderName}`, file.name));
	} catch (err) {
		console.error('Error fetching images with pagination:', err.message);
		return [];
	}
};
//➖ ➖ ➖ ➖ ➖ 🦖➖🦕🦕 ➖ ➖ 🌟  🌟  🌟 💣
