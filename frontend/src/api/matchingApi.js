import axiosInstance from "./axiosInstance";

const matchingApi = {


  getSportsList: async () => {
    try {
      const response = await axiosInstance.get("/matching/sports/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
 
  getMatching: async () => {
    try {
      const response = await axiosInstance.get("/matching/matches/");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createSession: async (sessionData) => {
    try {
      const formData = new FormData();
      formData.append("sport", sessionData.sport);
      formData.append("location", sessionData.location);
      formData.append("date", sessionData.date);
      formData.append("time", sessionData.time);
      formData.append("max_participants", sessionData.max_participants);

      const response = await axiosInstance.post("/matching/sessions/", formData);

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getSessionList: async () => {
    const response = await axiosInstance.get("/matching/sessions/");
    return response.data;
  },

  participateInSession: async (sessionId) => {
    const response = await axiosInstance.post(`/matching/sessions/${sessionId}/join/`);
    return response.data;
  },
};

export default matchingApi;