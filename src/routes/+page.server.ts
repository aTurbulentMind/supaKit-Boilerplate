//  +page.server.ts

import { fetchEventsAndImages } from '$lib/assets/utils/eve_utils';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	try {
		const { existingEvents, flyers, error } = await fetchEventsAndImages(supabase);

		if (error) {
			console.error('Error fetching data:', error);
		}

		return { session, existingEvents, flyers };
	} catch (error) {
		console.error('Unexpected error:', error.message);
		return { session: null, existingEvents: [], flyers: [], error: error.message };
	}
};
