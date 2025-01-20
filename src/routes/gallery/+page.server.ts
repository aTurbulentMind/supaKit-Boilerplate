// +page.server.ts

import { fetchEventsAndImages } from '$lib/assets/utils/eve_utils';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	try {
		const { existingEvents, folders, error } = await fetchEventsAndImages(supabase);

		if (error) {
			console.error('Error fetching data:', error);
			return { existingEvents: [], folders: [], error };
		}

		return { existingEvents, folders, error: null };
	} catch (err) {
		console.error('Error loading data:', err);
		return {
			existingEvents: [],
			folders: [],
			error: err.message
		};
	}
};
