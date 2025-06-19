import axiosInstance from "./axiosInstance";

const matchingApi = {

  

  getAvailabilities: async () => {
    try {
      const response = await axiosInstance.get("/account/availability/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addAvailabilities: async (data) => {
    try {
      const response = await axiosInstance.post("/account/availability/", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
 
  getMatching: async () => {
    try {
      const response = await axiosInstance.get("/account/matches/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


  getSportPreference: async () => {
    try {
      const response = await axiosInstance.get("/account/preference/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addSportToPreference: async (data) => {
    try {
      const response = await axiosInstance.put("/account/preference/", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default matchingApi;