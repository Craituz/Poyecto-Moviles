import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


//const API_URL = "http://10.82.23.163:8000/api"; 
const API_URL = "https://agleam-layne-nontemporarily.ngrok-free.dev/api"; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
  
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;