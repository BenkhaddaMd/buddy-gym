import axiosInstance from "./axiosInstance";

const sessionService = {
 
  getSportsList: async () => {
    try {
      const response = await axiosInstance.get("/account/sports/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer une nouvelle session
  createSession: async (sessionData) => {
    try {
      const formData = new FormData();
      formData.append("sport", sessionData.sport);
      formData.append("location", sessionData.location);
      formData.append("date", sessionData.date);
      formData.append("time", sessionData.time);
      formData.append("max_participants", sessionData.max_participants);

      const response = await axiosInstance.post("/account/sessions/", formData);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

};

export default sessionService;