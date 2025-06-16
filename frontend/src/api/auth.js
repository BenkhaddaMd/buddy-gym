import httpService from "../utils/httpService";

/**
 * Fetches the currently authenticated user's data
 * @returns {Promise<Object>} User data object
 * @throws {Error} If the request fails
 */
export const getCurrentUser = async () => {
  try {
    // Make GET request to the endpoint
    const response = await httpService.get('/auth/users/me/');
    
    // Return the user data
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};