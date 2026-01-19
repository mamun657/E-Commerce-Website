import api from '../lib/api';

/**
 * Fetch related products based on category and price similarity
 * @param {string} productId - The ID of the current product
 * @returns {Promise<Array>} Array of related products
 */
export const fetchRelatedProducts = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}/related`);
        return response.data.products || [];
    } catch (error) {
        console.error('Failed to fetch related products:', error);
        return [];
    }
};

/**
 * Fetch multiple products by their IDs (Option A: Parallel individual fetches)
 * @param {Array<string>} productIds - Array of product IDs
 * @returns {Promise<Array>} Array of products (filters out failed requests)
 */
export const fetchProductsByIds = async (productIds) => {
    try {
        if (!productIds || productIds.length === 0) {
            return [];
        }

        // Fetch all products in parallel, handling failures gracefully
        const promises = productIds.map((id) =>
            api.get(`/products/${id}`).catch(() => null)
        );

        const results = await Promise.all(promises);

        // Filter out failed requests and extract product data
        return results
            .filter((res) => res?.data?.product)
            .map((res) => res.data.product);
    } catch (error) {
        console.error('Failed to fetch products by IDs:', error);
        return [];
    }
};

/**
 * Track product view in localStorage (for "People Also Viewed")
 * @param {string} productId - The ID of the viewed product
 */
export const trackProductView = (productId) => {
    try {
        if (!productId) return;

        // Get existing viewed products
        const stored = localStorage.getItem('viewedProducts');
        let viewedProducts = stored ? JSON.parse(stored) : [];

        // Remove productId if it already exists (deduplication)
        viewedProducts = viewedProducts.filter((id) => id !== productId);

        // Add current product to the beginning
        viewedProducts.unshift(productId);

        // Keep only last 5 products
        viewedProducts = viewedProducts.slice(0, 5);

        // Save back to localStorage
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    } catch (error) {
        // localStorage might be blocked in private browsing mode
        console.warn('Failed to track product view:', error);
    }
};

/**
 * Get viewed product IDs from localStorage (excluding current product)
 * @param {string} currentProductId - The ID of the current product to exclude
 * @returns {Array<string>} Array of product IDs
 */
export const getViewedProductIds = (currentProductId) => {
    try {
        const stored = localStorage.getItem('viewedProducts');
        if (!stored) return [];

        const viewedProducts = JSON.parse(stored);

        // Filter out current product
        return viewedProducts.filter((id) => id !== currentProductId);
    } catch (error) {
        console.warn('Failed to get viewed products:', error);
        return [];
    }
};
