import axiosInstance from "./axiosInstance";

// Auth API Service
const authService = {
  /**
   * Verify JWT token
   * @returns {Promise<Object>} Verification result
   */
  verifyToken: async () => {
    const access = localStorage.getItem("access");
    if (!access) throw new Error("No access token found");
    
    try {
      const response = await axiosInstance.post("/auth/jwt/verify/", { token: access });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get current user data
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/users/me/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Auth tokens
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/jwt/create/", { email, password });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Register new user
   * @param {Object} userData 
   * @returns {Promise<Object>} Created user data
   */
  register: async ({ first_name, last_name, email, password, re_password }) => {
    try {
      const response = await axiosInstance.post("/auth/users/", {
        first_name,
        last_name,
        email,
        password,
        re_password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verify user email
   * @param {string} uid 
   * @param {string} token 
   * @returns {Promise<Object>} Verification result
   */
  verifyEmail: async (uid, token) => {
    try {
      const response = await axiosInstance.post("/auth/users/activation/", { uid, token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Initiate password reset
   * @param {string} email 
   * @returns {Promise<Object>} Reset result
   */
  resetPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/auth/users/reset_password/", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Confirm password reset
   * @param {string} uid 
   * @param {string} token 
   * @param {string} new_password 
   * @param {string} re_new_password 
   * @returns {Promise<Object>} Reset result
   */
  confirmResetPassword: async (uid, token, new_password, re_new_password) => {
    try {
      const response = await axiosInstance.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password,
        re_new_password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Social auth (Google)
   * @param {string} code 
   * @param {string} state 
   * @returns {Promise<Object>} Auth tokens
   */
  googleAuth: async (code, state) => {
    try {
      const formData = new FormData();
      formData.append('code', code);
      formData.append('state', state);
      
      const response = await axiosInstance.post("/auth/o/google-oauth2/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Social auth (Facebook)
   * @param {string} code 
   * @param {string} state 
   * @returns {Promise<Object>} Auth tokens
   */
  facebookAuth: async (code, state) => {
    try {
      const formData = new FormData();
      formData.append('code', code);
      formData.append('state', state);
      
      const response = await axiosInstance.post("/auth/o/facebook/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};

export default authService;