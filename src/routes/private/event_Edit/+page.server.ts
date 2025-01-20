import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	fetchEventsAndImages,
	sanitizeEventName,
	uploadFlyerImage
} from '$lib/assets/utils/eve_utils.ts';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		const { existingEvents, folders, flyers, error } = await fetchEventsAndImages(supabase);

		if (error) {
			console.error('Error fetching data:', error);
			return { error };
		}

		return { existingEvents, folders, flyers, error: null };
	} catch (err) {
		console.error('Error loading data:', err);
		return {
			existingEvents: [],
			folders: [],
			flyers: [],
			error: err.message
		};
	}
};

export const actions: Actions = {
	submit: async ({ request, locals: { supabase, safeGetSession } }) => {
		console.log('🅰️ Starting submit action');
		const { session } = await safeGetSession();
		if (!session) {
			console.error('🅱️ Unauthorized access');
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		console.log('🅲 Form data received:', formData);

		const eventHub = formData.get('eventHub');
		console.log('🅳 Event hub:', eventHub);

		const eventData = {
			event_name: formData.get('event_name'),
			event_date: formData.get('event_date'),
			location: formData.get('location'),
			description: formData.get('description'),
			status_id: formData.get('status_id')
		};
		console.log('🅴 Parsed event data:', eventData);

		const flyerFiles = formData.getAll('flyer'); // Ensure the name matches the input field
		const images = formData.getAll('images');
		console.log('🅵 flyerFiles:', flyerFiles);
		console.log('🅶 images:', images);

		const sanitizedEventName = sanitizeEventName(eventData.event_name);
		console.log('🅷 Sanitized Event Name:', sanitizedEventName);
		const uploadErrors = [];

		// 🌟 Handle 'New' Event Submission
		if (eventHub === 'New') {
			console.log('🅸 Processing new event submission');
			const { data: newEvent, error: insertError } = await supabase
				.from('events')
				.insert([eventData])
				.select('event_name');

			if (insertError) {
				console.error('🅹 Error inserting new event:', insertError.message);
				return fail(500, { error: insertError.message });
			}

			for (const image of images) {
				console.log('🅺 Uploading image:', image);
				if (image instanceof File && image.size > 0) {
					const { success, error } = await uploadFlyerImage(supabase, sanitizedEventName, image);
					if (!success) uploadErrors.push(error);
				}
			}
		}

		// 🌟 Handle 'Edit' Event Submission
		if (eventHub === 'Edit') {
			console.log('🅻 Processing event edit submission');
			const id = formData.get('event_name');

			const { data: events, error: eventsError } = await supabase
				.from('events')
				.update([eventData])
				.eq('event_name', id)
				.select('event_name');

			if (eventsError) {
				console.error('🅼 Error updating event:', eventsError.message);
				return fail(500, { error: eventsError.message });
			}

			for (const flyerFile of flyerFiles) {
				console.log('🅽 Uploading flyerFile:', flyerFile);
				if (flyerFile instanceof File && flyerFile.size > 0) {
					const { success, error } = await uploadFlyerImage(
						supabase,
						sanitizedEventName,
						flyerFile
					);
					if (!success) uploadErrors.push(error);
				}
			}

			if (uploadErrors.length > 0) {
				console.error('🅾️ Upload errors occurred:', uploadErrors);
				return fail(500, { error: uploadErrors.join(', ') });
			}
		}

		console.log('🅿️ Form submission successful!');
		return { success: true };
	}
};
