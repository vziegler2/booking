/**
 * Data Service Module
 * Provides async functions for fetching structured data from external endpoints
 * Prepared for Headless CMS or API integration
 * @module dataService
 */

/**
 * Configuration for API endpoints
 * @type {Object}
 */
const API_CONFIG = {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
    retries: 3
};

/**
 * Custom error class for API-related errors
 * @extends Error
 */
class ApiError extends Error {
    /**
     * Creates an ApiError instance
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {string} endpoint - The endpoint that failed
     */
    constructor(message, statusCode, endpoint) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.endpoint = endpoint;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Fetches data from an API endpoint with retry logic
 * @async
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {Object} [options={}] - Fetch options
 * @param {string} [options.method='GET'] - HTTP method
 * @param {Object} [options.headers={}] - Request headers
 * @param {Object} [options.body] - Request body for POST/PUT
 * @returns {Promise<Object>} The parsed JSON response
 * @throws {ApiError} When the request fails after all retries
 * @example
 * const data = await fetchData('/projects');
 * console.log(data);
 */
async function fetchData(endpoint, options = {}) {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const fetchOptions = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        },
        signal: controller.signal
    };

    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    let lastError;

    for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
        try {
            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    endpoint
                );
            }

            return await response.json();
        } catch (error) {
            lastError = error;

            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408, endpoint);
            }

            if (attempt < API_CONFIG.retries) {
                // Exponential backoff
                await new Promise(resolve =>
                    setTimeout(resolve, Math.pow(2, attempt) * 1000)
                );
            }
        }
    }

    throw lastError instanceof ApiError
        ? lastError
        : new ApiError(lastError.message, 0, endpoint);
}

/**
 * Fetches project data from the API
 * @async
 * @returns {Promise<Array<Object>>} Array of project objects
 * @throws {ApiError} When the request fails
 * @example
 * const projects = await getProjects();
 * projects.forEach(p => console.log(p.name));
 */
async function getProjects() {
    return fetchData('/projects');
}

/**
 * Fetches blog posts from the API
 * @async
 * @param {Object} [params={}] - Query parameters
 * @param {number} [params.limit=10] - Maximum number of posts
 * @param {number} [params.offset=0] - Pagination offset
 * @param {string} [params.category] - Filter by category
 * @returns {Promise<Object>} Blog posts with pagination info
 * @throws {ApiError} When the request fails
 */
async function getBlogPosts(params = {}) {
    const queryParams = new URLSearchParams({
        limit: params.limit || 10,
        offset: params.offset || 0,
        ...(params.category && { category: params.category })
    });

    return fetchData(`/blog?${queryParams}`);
}

/**
 * Fetches testimonials/reviews from the API
 * @async
 * @returns {Promise<Array<Object>>} Array of testimonial objects
 * @throws {ApiError} When the request fails
 */
async function getTestimonials() {
    return fetchData('/testimonials');
}

/**
 * Submits a contact form to the API
 * @async
 * @param {Object} formData - The form data to submit
 * @param {string} formData.name - Contact name
 * @param {string} formData.email - Contact email
 * @param {string} formData.message - Contact message
 * @param {string} [formData.company] - Company name
 * @param {string} [formData.phone] - Phone number
 * @returns {Promise<Object>} Submission confirmation
 * @throws {ApiError} When the request fails
 */
async function submitContactForm(formData) {
    // Sanitize input to prevent XSS
    const sanitizedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
            key,
            typeof value === 'string' ? escapeHtml(value) : value
        ])
    );

    return fetchData('/contact', {
        method: 'POST',
        body: sanitizedData
    });
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Gets the service availability/calendar data
 * @async
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise<Array<Object>>} Available time slots
 * @throws {ApiError} When the request fails
 */
async function getAvailability(startDate, endDate) {
    return fetchData(`/availability?start=${startDate}&end=${endDate}`);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchData,
        getProjects,
        getBlogPosts,
        getTestimonials,
        submitContactForm,
        getAvailability,
        ApiError,
        API_CONFIG
    };
}

// Export for ES modules
export {
    fetchData,
    getProjects,
    getBlogPosts,
    getTestimonials,
    submitContactForm,
    getAvailability,
    ApiError,
    API_CONFIG
};
