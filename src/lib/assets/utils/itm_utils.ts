// itm_utils.ts - Helper functions for item management
/**
 * Fetch products, inventory, sizes, and images from Supabase in parallel.
 *
 * @param {object} supabase - The Supabase client.
 * @returns {Promise<object>} - Returns fetched data or an error message.
 */

import pLimit from 'p-limit';
export const fetchProductsAndImages = async (supabase) => {
	try {
		// Fetch product-related data in parallel
		const [productData, productInventory, sizeData] = await Promise.all([
			supabase.from('products').select('*'),
			supabase.from('product_inventory').select('*'),
			supabase.from('sizes').select('size_id, size_name')
		]);

		// Check for errors in each fetch operation
		if (productData.error)
			throw new Error(`Failed to fetch products: ${productData.error.message}`);
		if (productInventory.error)
			throw new Error(`Failed to fetch product inventory: ${productInventory.error.message}`);
		if (sizeData.error) throw new Error(`Failed to fetch sizes: ${sizeData.error.message}`);

		// Limit the number of concurrent requests
		const limit = pLimit(5);

		// Fetch product-Folders in parallel
		const productFolders = await Promise.all(
			productData.data.map((event) =>
				limit(async () => {
					const productFolder = event.product_name;
					const imageUrls = [];

					for (let i = 1; i <= 10; i++) {
						const { data } = supabase.storage
							.from('Gallery')
							.getPublicUrl(`items/${productFolder}/${i}.jpg`);

						if (data && data.publicUrl) {
							try {
								// Check if the image exists by attempting a HEAD request
								const response = await fetch(data.publicUrl, { method: 'HEAD' });
								if (response.ok) {
									imageUrls.push(data.publicUrl);
								} else {
									break; // Stop looking for images if one is not found
								}
							} catch (error) {
								console.warn(`Image ${i}.jpg not found for ${productFolder}`);
								break; // Stop looking for images if one is not found
							}
						} else {
							break; // Stop looking for images if one is not found
						}
					}

					return { productFolder, imageUrls };
				})
			)
		);

		return {
			productData: productData.data,
			productInventory: productInventory.data,
			sizeData: sizeData.data,
			productFolders // Ensure this is included in the return object
		};
	} catch (error) {
		console.error(error.message);
		return {
			productData: [],
			productInventory: [],
			sizeData: [],
			productFolders: [], // Ensure this is included in the return object
			error: 'Error fetching data'
		};
	}
};

/**
 * Sanitize item names by making them lowercase, alphanumeric with hyphens.
 *
 * @param {string} itemName - The name of the item to sanitize.
 * @returns {string} - The sanitized item name.
 */
export const sanitizeItemName = (itemName: string): string => {
	return itemName
		.toLowerCase()
		.replace(/[^a-z0-9-_ ]/gi, ' ') // Normalize to alphanumeric with spaces
		.replace(/\s+/g, '-'); // Replace spaces with dashes
};
