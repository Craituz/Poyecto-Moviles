import apiClient from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email, password) => {
  const response = await apiClient.post("/login", {
    email,
    password,
  });

  const { access_token, user } = response.data;

  await AsyncStorage.setItem("token", access_token);
  await AsyncStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const logout = async () => {
  await apiClient.post("/logout");
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};
