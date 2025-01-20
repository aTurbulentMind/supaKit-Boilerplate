//  +page.server.ts
// Import necessary functions and types from SvelteKit
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchProductsAndImages } from '$lib/assets/utils/itm_utils';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	try {
		const { session } = await safeGetSession();
		const { productData, productInventory, sizeData, productFolders, error } =
			await fetchProductsAndImages(supabase);

		if (error) {
			console.error('Error fetching product data:', error);
			return fail(500, { error: 'Failed to load product data' });
		}

		return {
			session,
			productData,
			productInventory,
			productFolders,
			sizeData
		};
	} catch (err) {
		console.error('Unexpected error:', err instanceof Error ? err.message : String(err));
		return fail(500, { error: 'An unexpected error occurred' });
	}
};
