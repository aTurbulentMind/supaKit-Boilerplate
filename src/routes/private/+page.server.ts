// +page.server.ts

import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

	const { data: newMessages, error } = await supabase.from('form_submissions').select('*');

	if (error) {
		console.error('Error fetching data:', error.message);
		return fail(500, { error: error.message });
	}

	return { newMessages };

	console.log('newMessages', newMessages);
};

export const actions: Actions = {
	updateMessageViewed: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();

		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

		const formData = await request.formData();
		const messageId = formData.get('messageId');
		const been_viewed = formData.get('been_viewed') === 'on';

		//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

		try {
			const { error } = await supabase
				.from('form_submissions')
				.update({ been_viewed })
				.eq('vstr_id', messageId);

			if (error) {
				console.error('Error updating message:', error.message);
				return fail(500, { error: error.message });
			}

			//➖ ➖ ➖ ➖ ➖ 🦖➖ ➖ ➖ 🌟  🌟  🌟

			return { success: true };
		} catch (error) {
			console.error('Error updating message:', error);
			return fail(500, { error: error.message });
		}
	}
};
